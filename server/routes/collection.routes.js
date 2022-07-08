import express from "express";
import collectionController from "../controllers/collection.controller";
import { manager } from "../middlewares/core-contracts";

const router = express.Router();

router.use(manager);

router
  .route("/collections")
  .get(collectionController.list);

router
  .route("/collections/:collectionAddress")
  .get(collectionController.read);

router
  .route("/collections/:collectionAddress/items")
  .get(collectionController.items);

router
  .route("/collections/:collectionAddress/items/:itemId")
  .get(collectionController.item);

router.param("collectionAddress", collectionController.collectionByAddress);
export default router;
