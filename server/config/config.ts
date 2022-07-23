import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV as string || "development",
  port: process.env.PORT || 8000,
  mongoUri:
    process.env.NODE_ENV === "production"
      ? process.env["MONGODB_URI"] as string
      : process.env["MONGODB_TEST"] as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
export default config;
