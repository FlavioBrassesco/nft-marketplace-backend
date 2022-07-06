import express from "express";
import { ethers } from "ethers";
import CoreContract from "../models/core-contract.model";

import collectionController from "../controllers/collection.controller";

const router = express.Router();

const managerAbi = [
  "function isWhitelistedCollection(address) public view returns (bool)",
  "function getFee(address) public view returns (uint256)",
  "function getFloorPrice(address) public view returns (uint256)",
  "function getCollectionsCount() public view returns (uint256)",
  "function collectionByIndex(uint256) public view returns (address)",
];

// collection manager middleware
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

router.route("/collections").get(collectionController.list);

router.route("/collections/:collectionAddress").get(collectionController.read);

router
  .route("/collections/:collectionAddress/items")
  .get(collectionController.items);

router
  .route("/collections/:collectionAddress/items/:itemId")
  .get(collectionController.item);

router.param("collectionAddress", collectionController.collectionByAddress);
export default router;
