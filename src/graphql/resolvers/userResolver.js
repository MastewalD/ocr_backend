const prisma = require("../../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../errorHandler/appError");
const handlePrismaError = require("../../errorHandler/errorController");
require("dotenv").config();
module.exports = {
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (err) {
        throw handlePrismaError(err);
      }
    },

    user: async (_, { id }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
          include: { receipts: true },
        });
        if (!user) {
          throw new AppError("User not found", 404);
        }
        return user;
      } catch (err) {
        throw handlePrismaError(err);
      }
    },
  },

  Mutation: {
    register: async (_, { email, name, password }) => {
      try {
        if (!password || password.length < 6) {
          throw new AppError(
            "Password must be at least 6 characters long.",
            400
          );
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: { email, name, password: hashed },
        });
       

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        });

        return {
          token,
          message: "User registered successfully",
          user: newUser,
        };
      } catch (err) {
        throw handlePrismaError(err);
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new AppError("User not found", 404);

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new AppError("Invalid password/email", 401);
       
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        });

        return {
          token,
          message: "Login successful",
          user,
        };
      } catch (err) {
        throw handlePrismaError(err);
      }
    },
  },

  User: {
    receipts: (parent) =>
      prisma.receipt.findMany({ where: { userId: parent.id } }),
  },
};
