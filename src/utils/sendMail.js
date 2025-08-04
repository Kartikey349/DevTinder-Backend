const nodemailer = require("nodemailer")
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "kartikeys7518@gmail.com",
    pass: process.env.GMAIL_PASS || "reaxaxpemvtrufby",
  },
});

const sendMail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({
            from: `"DevTinder 💘" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
        });
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

module.exports = sendMail;