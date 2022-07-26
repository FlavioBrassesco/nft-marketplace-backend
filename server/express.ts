/// <reference path="../types/index.d.ts" />
import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import coreContractRoutes from "./routes/core-contract.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import salesServiceRoutes from "./routes/sales-service.routes";
import collectionRoutes from "./routes/collection.routes";
import marketplaceRoutes from "./routes/marketplace.routes";
import notFound from "./middlewares/not-found";
import errorHandler from "./middlewares/error-handler";
import ethersProvider from "./middlewares/ethers-provider";
import CacheMiddleware from "./middlewares/cache/CacheMiddleware";
import { checkRequestCache } from "./middlewares/cache/checkers";

// express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  req.locals = {};
  next();
});

// ethers provider middleware
app.use(ethersProvider);

// intercepts json responses and calls cachers
// requires registerChecker in each route that needs caching
const cacheMiddleware = CacheMiddleware.getInstance();
cacheMiddleware.registerApp(app);
cacheMiddleware.registerChecker("requestChecker", checkRequestCache);
app.use(cacheMiddleware.getMiddleware());

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "server up and running" });
});

app.use("/auth/", authRoutes);
app.use("/api/", coreContractRoutes);
app.use("/api/", userRoutes);
app.use("/api/", salesServiceRoutes);
app.use("/api/", collectionRoutes);
app.use("/api/", marketplaceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
