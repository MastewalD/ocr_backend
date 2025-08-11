const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "7d",
  });
}

module.exports = { hashPassword, comparePasswords, generateToken };
