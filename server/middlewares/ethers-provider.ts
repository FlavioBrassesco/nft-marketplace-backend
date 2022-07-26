/// <reference path="../../types/index.d.ts" />
import config from "../config/config";
import { ethers } from "ethers";
import { Request, Response } from "express";

const ethersProvider = (req: Request, res: Response, next) => {
  if (config.env !== "production") {
    req.locals.web3Provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
  } else {
    req.locals.web3Provider = new ethers.providers.AlchemyProvider("");
  }
  next();
};

export default ethersProvider;
