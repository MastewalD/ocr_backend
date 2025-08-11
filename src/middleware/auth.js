const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";
function authMiddleware(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  try {
    console.log(jwt.decode(token))
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId; 
  } catch {
    return null;
  }
}

module.exports = authMiddleware;
