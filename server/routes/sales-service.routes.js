import express from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import authorizedMarketplaceController from "../controllers/sales-service/authorized-marketplace.controller";
import approvedTokenController from "../controllers/sales-service/approved-token.controller";
import pendingRevenueController from "../controllers/sales-service/pending-revenue.controller";
import { salesservice } from "../middlewares/core-contracts";

const router = express.Router();

router.use("/sales-service", salesservice);

router
  .route("/sales-service/authorized-marketplaces")
  .get(authorizedMarketplaceController.list)
  .post(authController.requireSignin, authController.requireAdmin);

router
  .route("/sales-service/approved-tokens")
  .get(approvedTokenController.list)
  .post(authController.requireSignin, authController.requireAdmin);

router
  .route("/sales-service/pending-revenue/:userAddress")
  .get(
    authController.requireSignin,
    authController.hasAuthorization,
    pendingRevenueController.read
  );

router.param("userAddress", userController.userByAddress);

export default router;
