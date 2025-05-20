import { configDotenv } from "dotenv";
import nodemailer from 'nodemailer'
configDotenv();

const transport = nodemailer.createTransport({
  host : process.env.mailtrap_host,
  port : process.env.mailtrap_port,
  auth : {
    user : process.env.mailtrap_user,
    pass : process.env.mailtrap_pass
  }
});

export const sendVerificationCode = async (recipientEmail, verificationCode) => {
  const mailOptions = {
    from : `"${process.env.app_name} <${process.env.email_sender}>"`,
    to : recipientEmail,
    subject : "Account Verification",
    text : "This is to verify your account",
    html : `<body><div>Your verification code is : </div> <div>${verificationCode}</div></body>`
  };

  try {
    transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
  }
}