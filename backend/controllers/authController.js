import User from "../models/User.js";
import Otp from "../models/Otp.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import otpGenerator from "otp-generator";

import { sendOTP } from "../services/emailService.js";

/* =====================================================
   Signup
===================================================== */

export const signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* =====================================================
   Login
===================================================== */

export const login = async (req, res) => {
    try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* =====================================================
   Forgot Password (Send OTP)
===================================================== */

export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Delete old OTP if exists
    await Otp.deleteMany({ email });

    // Generate 6 digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ), // 10 minutes
    });

    // Send Email
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* =====================================================
   Verify OTP
===================================================== */

export const verifyOtp = async (req, res) => {
    try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found.",
      });
    }

    if (otpData.expiresAt < new Date()) {

      await Otp.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });

    }

    if (otpData.otp !== otp) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });

    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* =====================================================
   Reset Password
===================================================== */

export const resetPassword = async (req, res) => {

  try {

    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });

    }

    const otpData = await Otp.findOne({ email });

    if (!otpData) {

      return res.status(404).json({
        success: false,
        message: "OTP not found.",
      });

    }

    if (otpData.expiresAt < new Date()) {

      await Otp.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });

    }

    if (otpData.otp !== otp) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await Otp.deleteOne({
      _id: otpData._id,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};