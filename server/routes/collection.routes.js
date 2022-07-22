import express from "express";
import collectionController from "../controllers/collection.controller";
import checkCache from "../middlewares/check-cache";
import { manager } from "../middlewares/core-contracts";

const router = express.Router();

router.use("/collections", manager);
router.use("/collections", checkCache);

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
