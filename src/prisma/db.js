const prisma = require("./client"); 

async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = testDbConnection;
