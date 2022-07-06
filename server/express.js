import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import { ethers } from "ethers";
import config from "../config/config";

import coreContractRoutes from "./routes/core-contract.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import salesServiceRoutes from "./routes/sales-service.routes";

// express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// ethers provider middleware
app.use((req, res, next) => {
  if (config.env !== "production") {
    req.web3Provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
  } else {
    req.web3Provider = new ethers.providers.AlchemyProvider("");
  }
  next();
});

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server up and running" });
});

app.use("/auth/", authRoutes);
app.use("/api/", coreContractRoutes);
app.use("/api/", userRoutes);
app.use("/api/", salesServiceRoutes);

export default app;
