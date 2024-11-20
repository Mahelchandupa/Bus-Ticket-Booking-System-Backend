const http = require("http");
const connectDB = require("./config.js");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route.js");
const roadRoutes = require("./routes/roadRoute.route.js");
const busRoutes = require("./routes/bus.route.js");
const scheduleRoutes = require("./routes/schedule.route.js");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    return res.end(200, JSON.stringify({ message: "OK" }));
  }

  if ((await authRoutes(req, res)) === false) {
    if ((await roadRoutes(req, res)) === false) {
      if ((await busRoutes(req, res)) === false) {
        if ((await scheduleRoutes(req, res)) === false) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "Route not found" }));
        }
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
