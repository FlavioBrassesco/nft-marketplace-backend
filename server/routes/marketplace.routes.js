import express from "express";
import marketplaceController from "../controllers/marketplace/marketplace.controller";
import auctionController from "../controllers/marketplace/auction.controller";
import buyofferController from "../controllers/marketplace/buyoffer.controller";

import {
  manager,
  marketplace,
  auctions,
  buyoffers,
} from "../middlewares/core-contracts";

const router = express.Router();

router.use(manager);

router.use("/marketplace/for-sale", marketplace);

router
  .route("/marketplace/for-sale")
  .get(marketplaceController.list);

router
  .route("/marketplace/for-sale/:collectionAddress")
  .get(marketplaceController.items);

router
  .route("/marketplace/for-sale/:collectionAddress/:tokenId")
  .get(marketplaceController.item);

router.use("/marketplace/auctions", auctions);

router
  .route("/marketplace/auctions")
  .get(auctionController.list);

router
  .route("/marketplace/auctions/:collectionAddress")
  .get(auctionController.items);

router
  .route("/marketplace/auctions/:collectionAddress/:tokenId")
  .get(auctionController.item);

router.use("/marketplace/buy-offers", buyoffers);

router
  .route("/marketplace/buy-offers")
  .get(buyofferController.list);

router
  .route("/marketplace/buy-offers/:collectionAddress")
  .get(buyofferController.read);

router
  .route("/marketplace/buy-offers/:collectionAddress/:tokenId")
  .get(buyofferController.items);

export default router;
