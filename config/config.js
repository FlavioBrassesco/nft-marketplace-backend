import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  mongoUri:
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URI
      : process.env.MONGODB_TEST,
  jwtSecret: process.env.JWT_SECRET,
};
export default config;
