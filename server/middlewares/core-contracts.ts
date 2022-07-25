/// <reference path="../../types/index.d.ts" />
import { Request, Response } from "express";
import CoreContract from "../models/core-contract.model";
import { NFTCollectionManager__factory } from "../typechain-types/factories/contracts/NFTCollectionManager__factory";
import { NFTMarketplace__factory } from "../typechain-types/factories/contracts/NFTMarketplace__factory";
import { NFTAuctions__factory } from "../typechain-types/factories/contracts/NFTAuctions__factory";
import { NFTBuyOffers__factory } from "../typechain-types/factories/contracts/NFTBuyOffers__factory";
import { SalesService__factory } from "../typechain-types/factories/contracts/services/SalesService__factory";

const manager = async (req: Request, res: Response, next) => {
  const manager = await CoreContract.findOne({ key: "manager" });
  if (!manager)
    return res
      .status(400)
      .json({ error: "Couldn't find collection manager contract" });

  req.locals.contracts = {
    ...req.locals.contracts,
    manager: NFTCollectionManager__factory.connect(
      manager.address,
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
    marketplace: NFTMarketplace__factory.connect(
      marketplace.address,
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
    auctions: NFTAuctions__factory.connect(
      auctions.address,
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
    buyoffers: NFTBuyOffers__factory.connect(
      buyoffers.address,
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
    salesservice: SalesService__factory.connect(
      salesservice.address,
      req.locals.web3Provider
    ),
  };

  next();
};

export { manager, marketplace, auctions, buyoffers, salesservice };
