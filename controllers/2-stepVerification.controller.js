import nodemailer from "nodemailer" ; 
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken" ; 
import dotenv from "dotenv" ; 

dotenv.config({
    path: './.env'
})

const TwostepemailService = async (email, otp) => {
  try {
    const Transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "arpitno57@gmail.com",
        pass: "",
      },
    });

    const info = await Transporter.sendMail({
      from: '"uniBridge" <arpitno57@gmail.com>',
      to: `${email}`,
      subject: "Your OTP for UniBridge Login",
      text: `Your OTP is: ${otp}`,
      html: `<h1>OTP: ${otp}</h1>`,
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new ApiError(500, "Email sending failed");
  }
};
export default TwostepemailService;


