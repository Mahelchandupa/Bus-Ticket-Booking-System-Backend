const { transporter } = require("./transporter");

const sendBookingDetails = async (email, schedule, seats, amount, paymentMethod, payment) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Bus Ticket Booking Details",
            text: `Hello,\n\nYour bus ticket booking details are as follows:\n\nBus: ${schedule.busId.busNumber}\nRoute: ${schedule.routeId.name}\nFrom: ${schedule.fromCity}\nTo: ${schedule.toCity}\nDeparture Time: ${schedule.departureTime}\nArrival Time: ${schedule.arrivalTime}\nSeats: ${seats.join(", ")}\nAmount: ${amount}\nPayment Method: ${paymentMethod}\nTransaction Reference: ${payment.transactionReference}\nDate: ${schedule.date}\nEstimated Time: ${schedule.estimatedTime}\nPayment Date: ${payment.paymentDate}\n\nThank you!`,
            html: `
            <p>Hello,</p>
            <p>Your bus ticket booking details are as follows:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
                <tbody>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Bus</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.busId.busNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Route</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.routeId.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">From</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.fromCity}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">To</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.toCity}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Departure Time</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.departureTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Arrival Time</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.arrivalTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Seats</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${seats.join(", ")}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Amount</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Payment Method</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${paymentMethod}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Transaction Reference</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${payment.transactionReference}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Date</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Estimated Time</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${schedule.estimatedTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; background-color: #f4f4f4; font-weight: bold; border: 1px solid #ddd;">Payment Date</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${payment.paymentDate}</td>
                    </tr>
                </tbody>
            </table>
            <p>Thank you!</p>
        `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email);
    } catch (error) {
        console.error("Failed to send email:", error);
    }

}

module.exports = sendBookingDetails
