const transporter = require("./transporter");

const sendCancelBookingDetails = async (
  schedule,
  booking,
  reason,
  seatNumber,
  role
) => {
  let mailOptions = null;

  if (role === "user") {
    mailOptions = {
      from: process.env.EMAIL,
      to: booking.userId.email,
      subject: "Booking Cancelled",
      html: `
     <!DOCTYPE html>
<html>
<head>
  <title>Booking Cancelled - [Your Company Name]</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .important {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <p>Dear ${booking?.userId?.username} (Commuter),</p>
  <p>We're writing to inform you that your booking has been successfully cancelled: </p>
  <ul>
    <li>Route: ${schedule.routeId.name}</li>
    <li>Bus: ${schedule.busId.busNumber}</li>
    <li>Departure Time: ${schedule.departureTime}</li>
    <li>Arrival Time: ${schedule.arrivalTime}</li>
    <li>Seat Number: ${seatNumber}</li>
    <li class="important">Amount Paid: ${booking?.amount}</li>  <li class="important">Reason for cancellation: ${reason}</li>
  </ul>
  <p>Your refund will be processed within 2 business days.</p>
  <p>Thank you for using our service.</p>
  <p>Sincerely,</p>
  <p>SLTB</p>
</body>
</html>
        `,
    };
  } else {
    mailOptions = {
      from: process.env.EMAIL,
      to: booking.userId.email,
      subject: "Booking Cancelled",
      html: `
          <!DOCTYPE html>
<html>
<head>
  <title>Booking Cancelled - SLTB</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .important {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <p>Dear ${booking.userId.username} (Commuter),</p>
  <p>We are writing to inform you that your booking for the following route has been cancelled:</p>
  <ul>
    <li>Route: ${schedule.routeId.name}</li>
    <li>Bus: ${schedule.busId.busNumber}</li>
    <li>Departure Time: ${schedule.departureTime}</li>
    <li>Arrival Time: ${schedule.arrivalTime}</li>
    <li>Seat Number: ${seatNumber}</li>
    <li class="important">Amount Paid: ${booking.amount}</li>
    <li class="important">Reason for cancellation: ${reason}</li>
  </ul>
  <p>We apologize for any inconvenience this may cause. Your refund will be processed within 2 business days.</p>
  <p>Thank you for using our service.</p>
  <p>Sincerely,</p>
  <p>SLTB</p>
</body>
</html>
          `,
    };
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendCancelBookingDetails;
