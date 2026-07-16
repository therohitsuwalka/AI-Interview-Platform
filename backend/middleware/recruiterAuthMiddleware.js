import jwt from "jsonwebtoken";
import Recruiter from "../models/Recruiter.js";

const recruiterAuthMiddleware = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        success: false,
        message: "Authorization denied.",
      });

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const recruiter =
      await Recruiter.findById(decoded.id);

    if (!recruiter) {

      return res.status(401).json({
        success: false,
        message: "Recruiter not found.",
      });

    }

    req.user = {

      id: recruiter._id,

    };

    next();

  } catch (error) {

    return res.status(401).json({

      success: false,

      message: "Invalid Token.",

    });

  }

};

export default recruiterAuthMiddleware;