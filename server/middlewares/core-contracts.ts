import { ethers } from "ethers";
import { Request, Response } from "express";
import CoreContract from "../models/core-contract.model";
const managerAbi = require("../abis/manager.abi.json").abi;
const marketplaceAbi = require("../abis/marketplace.abi.json").abi;
const auctionsAbi = require("../abis/auctions.abi.json").abi;
const buyoffersAbi = require("../abis/buyoffers.abi.json").abi;
const salesServiceAbi = require("../abis/salesservice.abi.json").abi;

const manager = async (req: Request, res: Response, next) => {
  const manager = await CoreContract.findOne({ key: "manager" });
  if (!manager)
    return res
      .status(400)
      .json({ error: "Couldn't find collection manager contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    manager: new ethers.Contract(
      manager.address,
      managerAbi,
      req.locals.web3Provider
    ),
  };

  next();
};

const marketplace = async (req: Request, res: Response, next) => {
  const marketplace = await CoreContract.findOne({ key: "marketplace" });
  if (!marketplace)
    return res
      .status(400)
      .json({ error: "Couldn't find marketplace contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    marketplace: new ethers.Contract(
      marketplace.address,
      marketplaceAbi,
      req.locals.web3Provider
    ),
  };
  next();
};

const auctions = async (req: Request, res: Response, next) => {
  const auctions = await CoreContract.findOne({ key: "auctions" });
  if (!auctions)
    return res.status(400).json({ error: "Couldn't find auctions contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    auctions: new ethers.Contract(
      auctions.address,
      auctionsAbi,
      req.locals.web3Provider
    ),
  };
  next();
};

const buyoffers = async (req: Request, res: Response, next) => {
  const buyoffers = await CoreContract.findOne({ key: "buyoffers" });
  if (!buyoffers)
    return res.status(400).json({ error: "Couldn't find buy offers contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    buyoffers: new ethers.Contract(
      buyoffers.address,
      buyoffersAbi,
      req.locals.web3Provider
    ),
  };
  next();
};

const salesservice = async (req: Request, res: Response, next) => {
  const salesservice = await CoreContract.findOne({ key: "salesservice" });
  if (!salesservice)
    return res
      .status(400)
      .json({ error: "Couldn't find sales service contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    salesservice: new ethers.Contract(
      salesservice.address,
      salesServiceAbi,
      req.locals.web3Provider
    ),
  };

  next();
};

export { manager, marketplace, auctions, buyoffers, salesservice };
