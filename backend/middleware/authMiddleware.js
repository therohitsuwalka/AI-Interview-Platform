import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("========== AUTH MIDDLEWARE ==========");

    const authHeader = req.headers.authorization;

    console.log("Authorization:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded Token:", decoded);

    req.user = decoded;

    console.log("req.user After Set:", req.user);

    console.log("====================================");

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }
};

export default authMiddleware;