import express from "express";

import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import authorizedMarketplaceController from "../controllers/sales-service/authorized-marketplace.controller";
import approvedTokenController from "../controllers/sales-service/approved-token.controller";
import pendingRevenueController from "../controllers/sales-service/pending-revenue.controller";

const router = express.Router();

router
  .route("/sales-service/authorized-marketplaces")
  .get(authorizedMarketplaceController.list)
  .post(authController.requireSignin, authController.requireAdmin);
/*
router
  .route("/sales-service/authorized-marketplaces/:marketplaceAddress")
  .get(authorizedMarketplaceController.list)
  .put(authController.requireSignin, authController.requireAdmin)
  .remove(authController.requireSignin, authController.requireAdmin);

router.param("marketplaceAddress");
*/
router
  .route("/sales-service/approved-tokens")
  .get(approvedTokenController.list)
  .post(authController.requireSignin, authController.requireAdmin);
/*
router
  .route("/sales-service/approved-tokens/:tokenAddress")
  .get()
  .put(authController.requireSignin, authController.requireAdmin)
  .remove(authController.requireSignin, authController.requireAdmin);

router.param("tokenAddress");
*/
router
  .route("/sales-service/pending-revenue/:userAddress")
  .get(
    authController.requireSignin,
    authController.hasAuthorization,
    pendingRevenueController.read
  );

router.param("userAddress", userController.userByAddress);

export default router;