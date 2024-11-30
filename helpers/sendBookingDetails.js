const transporter = require("./transporter");

const sendBookingDetails = async (
  email,
  schedule,
  seats,
  amount,
  paymentMethod,
  payment
) => {
  const seatNumbers = seats.map((seat) => seat.seatNumber);

  try {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Bus Ticket Booking Details",
      text: `Hello,\n\nYour bus ticket booking details are as follows:\n\nBus: ${
        schedule.busId.busNumber
      }\nRoute: ${schedule.routeId.name}\nFrom: ${schedule.fromCity}\nTo: ${
        schedule.toCity
      }\nDeparture Time: ${schedule.departureTime}\nArrival Time: ${
        schedule.arrivalTime
      }\nSeats: ${seats.join(
        ", "
      )}\nAmount: ${amount}\nPayment Method: ${paymentMethod}\nTransaction Reference: ${
        payment.transactionReference
      }\nDate: ${schedule.date}\nEstimated Time: ${
        schedule.estimatedTime
      }\nPayment Date: ${payment.paymentDate}\n\nThank you!`,
      html: `
              <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bus Ticket Booking Details</title>
    <style>
        .container {
            font-family: Arial, sans-serif;
            margin: 0 auto;
            max-width: 800px;
            padding: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        th {
            background-color: #f4f4f4;
            font-weight: bold;
        }
        p {
            font-weight: 700;
        }
        h1 {
            text-align: center;
            font-weight: bold;
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SLTB</h1>
        <p>Hello,</p>
        <p>Your bus ticket booking details are as follows:</p>
        <table>
            <tbody>
                <tr>
                    <td>Bus</td>
                    <td>${schedule.busId.busId}</td>
                </tr>
                <tr>
                    <td>Route</td>
                    <td>${schedule.routeId.routeId} (${
        schedule.routeId.routeName
      })</td>
                </tr>
                <tr>
                    <td>From</td>
                    <td>${schedule.fromCity}</td>
                </tr>
                <tr>
                    <td>To</td>
                    <td>${schedule.toCity}</td>
                </tr>
                <tr>
                    <td>Departure Time</td>
                    <td>${schedule.departureTime}</td>
                </tr>
                <tr>
                    <td>Arrival Time</td>
                    <td>${schedule.arrivalTime}</td>
                </tr>
                <tr>
                    <td>Seats</td>
                    <td>${seatNumbers.join(", ")}</td>
                </tr>
                <tr>
                    <td>Amount</td>
                    <td>LKR. ${amount}.00</td>
                </tr>
                <tr>
                    <td>Payment Method</td>
                    <td>${paymentMethod}</td>
                </tr>
                <tr>
                    <td>Transaction Reference</td>
                    <td>${payment.transactionReference}</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>${schedule.date}</td>
                </tr>
                <tr>
                    <td>Estimated Time</td>
                    <td>${schedule.estimatedTime}</td>
                </tr>
                <tr>
                    <td>Payment Date</td>
                    <td>${payment.paymentDate}</td>
                </tr>
                <tr>
                    <td>Bus Operator Contact</td>
                    <td>${schedule.busId.busOwnerContact}</td>
                </tr>
            </tbody>
        </table>
        <p>Thank you!</p>
    </div>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = sendBookingDetails;
