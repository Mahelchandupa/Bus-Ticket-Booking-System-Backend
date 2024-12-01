const transporter = require("../transporter");

const sendLoginDetails = async (busOwnerEmail, username, temporaryPassword) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: busOwnerEmail,
      subject: "Your Bus Management System Login Details",
      text: `Hello ${username},\n\nYour account has been created successfully. Here are your login details:\n\nUsername: ${username}\nPassword: ${temporaryPassword}\n\nPlease log in and change your password immediately for security reasons.\n\nThank you!`,
      html: `
          <p>Hello <strong>${username}</strong>,</p>
          <p>Your account has been created successfully. Here are your login details:</p>
          <ul>
            <li><strong>Username:</strong> ${username}</li>
            <li><strong>Password:</strong> ${temporaryPassword}</li>
          </ul>
          <p>Please log in and change your password immediately for security reasons.</p>
          <p>Thank you!</p>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", busOwnerEmail);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = sendLoginDetails