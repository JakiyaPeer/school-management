



const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send("Please login first");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("Decoded token:", decoded);

    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = authMiddleware;

