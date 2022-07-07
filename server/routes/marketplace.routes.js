import express from "express";
import { ethers } from "ethers";
import CoreContract from "../models/core-contract.model";

import marketplaceController from "../controllers/marketplace/marketplace.controller";
import auctionController from "../controllers/marketplace/auction.controller";
import buyofferController from "../controllers/marketplace/buyoffer.controller";

import { abi as managerAbi } from "../abis/manager.abi.json";
import { abi as marketplaceAbi } from "../abis/marketplace.abi.json";
import { abi as auctionsAbi } from "../abis/auctions.abi.json";
import { abi as buyoffersAbi } from "../abis/buyoffers.abi.json";

const router = express.Router();

router.use(async (req, res, next) => {
  const manager = await CoreContract.findOne({ key: "manager" });
  if (!manager)
    return res
      .status(400)
      .json({ error: "Couldn't find collection manager contract" });

  const contract = new ethers.Contract(
    manager.address,
    managerAbi,
    req.web3Provider
  );
  req.manager = contract;
  next();
});

router.use("/marketplace/for-sale", async (req, res, next) => {
  const marketplace = await CoreContract.findOne({ key: "marketplace" });
  if (!marketplace)
    return res
      .status(400)
      .json({ error: "Couldn't find marketplace contract" });

  req.marketplace = new ethers.Contract(
    marketplace.address,
    marketplaceAbi,
    req.web3Provider
  );
  next();
});

router.route("/marketplace/for-sale").get(marketplaceController.list);

router
  .route("/marketplace/for-sale/:collectionAddress")
  .get(marketplaceController.items);

router
  .route("/marketplace/for-sale/:collectionAddress/:tokenId")
  .get(marketplaceController.item);

router.use("/marketplace/auctions", async (req, res, next) => {
  const auctions = await CoreContract.findOne({ key: "auctions" });
  if (!auctions)
    return res.status(400).json({ error: "Couldn't find auctions contract" });

  req.auctions = new ethers.Contract(
    auctions.address,
    auctionsAbi,
    req.web3Provider
  );
  next();
});

router.route("/marketplace/auctions").get(auctionController.list);

router
  .route("/marketplace/auctions/:collectionAddress")
  .get(auctionController.items);

router
  .route("/marketplace/auctions/:collectionAddress/:tokenId")
  .get(auctionController.item);

router.use("/marketplace/buy-offers", async (req, res, next) => {
  const buyoffers = await CoreContract.findOne({ key: "buyoffers" });
  if (!buyoffers)
    return res.status(400).json({ error: "Couldn't find buy offers contract" });

  req.buyoffers = new ethers.Contract(
    buyoffers.address,
    buyoffersAbi,
    req.web3Provider
  );
  next();
});

router.route("/marketplace/buy-offers").get(buyofferController.list);
router
  .route("/marketplace/buy-offers/:collectionAddress")
  .get(buyofferController.read);
router
  .route("/marketplace/buy-offers/:collectionAddress/:tokenId")
  .get(buyofferController.items);

export default router;
