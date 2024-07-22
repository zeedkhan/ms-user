const { PrismaClient } = require('@prisma/client');
const dotenv = require("dotenv");


dotenv.config();
// Prevent multiple instances of Prisma Client in development
const prisma = new PrismaClient();


module.exports = prisma;