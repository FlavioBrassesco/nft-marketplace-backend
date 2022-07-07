import express from "express";
import { ethers } from "ethers";
import CoreContract from "../models/core-contract.model";
import collectionController from "../controllers/collection.controller";
import { abi as managerAbi } from "../abis/manager.abi.json";

const router = express.Router();

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
