import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,

  },

});

export const sendOTP = async (email, otp) => {

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: "AI Interview Platform Password Reset OTP",

    html: `
      <div style="font-family:Arial;padding:30px">

        <h2>Password Reset</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 10 minutes.</p>

      </div>
    `,

  });

};