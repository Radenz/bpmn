import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendTextEmail(destination, subject, body) {
  await transporter.sendMail({
    from: `No Reply <${process.env.GMAIL_EMAIL}>`,
    to: destination,
    subject,
    text: body,
  });
}

export { sendTextEmail };
