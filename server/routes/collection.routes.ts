import express from "express";
import collectionController from "../controllers/collection.controller";
import { manager } from "../middlewares/core-contracts";
import CacheMiddleware from "../middlewares/cache/CacheMiddleware";

const router = express.Router();
const cm = CacheMiddleware.getInstance();

router.use("/collections", manager);
router.use("/collections", cm.getCheckerMiddleware("requestChecker"));

router.route("/collections")
  .get(collectionController.list);

router.route("/collections/:collectionAddress")
  .get(collectionController.read);

router
  .route("/collections/:collectionAddress/items")
  .get(collectionController.items);

router
  .route("/collections/:collectionAddress/items/:itemId")
  .get(collectionController.item);

router.param("collectionAddress", collectionController.collectionByAddress);

export default router;
