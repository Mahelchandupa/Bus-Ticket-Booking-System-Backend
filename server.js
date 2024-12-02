const http = require("http");
const connectDB = require("./config.js");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route.js");
const roadRoutes = require("./routes/roadRoute.route.js");
const busRoutes = require("./routes/bus.route.js");
const scheduleRoutes = require("./routes/schedule.route.js");
const socketIo = require("socket.io");
const bookingRoutes = require("./routes/booking.route.js");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://bus-ticket-booking-system-frontend.vercel.app"];

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.writeHead(200);
    return res.end(JSON.stringify({ message: "OK" }));
  }

  if ((await authRoutes(req, res)) === false) {
    if ((await roadRoutes(req, res)) === false) {
      if ((await busRoutes(req, res)) === false) {
        if ((await scheduleRoutes(req, res)) === false) {
          if ((await bookingRoutes(req, res)) === false) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Route not found" }));
          }
        }
      }
    }
  }
});

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://bus-ticket-booking-system-frontend.vercel.app"],
    methods: ["GET", "POST"],
  },
});

// In-memory storage for seat states
let seatStates = {}; // { scheduleId: { seatNumber: { state: "Available" | "Processing" | "Booked", timer: TimeoutId } } }

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle multiple seat processing
  socket.on("multipleSeatsProcessing", ({ scheduleId, seats, userId }) => {
    console.log("multipleSeatsProcessing", scheduleId, seats);
    if (!seatStates[scheduleId]) seatStates[scheduleId] = {};

    const unavailableSeats = seats.filter(
      (seatNumber) => seatStates[scheduleId][seatNumber]?.state === "Booked"
    );

    if (unavailableSeats.length > 0) {
      return socket.emit("seatsUnavailable", { unavailableSeats });
    }

    seats.forEach((seatNumber) => {
      seatStates[scheduleId][seatNumber] = {
        state: "Processing",
        timer: setTimeout(() => {
          seatStates[scheduleId][seatNumber] = { state: "Available" };
          io.emit("seatReset", { scheduleId, seatNumber });
        }, 10 * 60 * 1000), // Reset after 10 minutes
      };
    });

    io.emit("seatStatusUpdate", {
      scheduleId,
      seats: seats.map((seatNumber) => ({
        seatNumber: seatNumber.seatNumber,
        state: "Processing",
      })),
    });
  });

  // Handle booking multiple seats
  socket.on("multipleSeatsBooked", ({ scheduleId, seats }) => {
    console.log("multipleSeatsBooked", scheduleId, seats);
    seats.forEach((seatNumber) => {
      if (seatStates[scheduleId]?.[seatNumber]) {
        console.log(
          "seatStates[scheduleId][seatNumber]",
          seatStates[scheduleId][seatNumber]
        );
        clearTimeout(seatStates[scheduleId][seatNumber].timer);
        seatStates[scheduleId][seatNumber] = { state: "Booked" };
      }
    });

    io.emit("seatStatusUpdate", {
      scheduleId,
      seats: seats.map((seatNumber) => ({
        seatNumber: seatNumber.seatNumber,
        state: "Booked",
      })),
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = io;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
