import express from "express";

import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/sales-service/authorized-marketplaces")
  .get()
  .post(authController.requireSignin, authController.requireAdmin);

router
  .route("/sales-service/authorized-marketplaces/:marketplaceAddress")
  .get()
  .put(authController.requireSignin, authController.requireAdmin)
  .remove(authController.requireSignin, authController.requireAdmin);

router.param("marketplaceAddress");

router
  .route("sales-service/approved-tokens")
  .get()
  .post(authController.requireSignin, authController.requireAdmin);

router
  .route("/sales-service/approved-tokens/:tokenAddress")
  .get()
  .put(authController.requireSignin, authController.requireAdmin)
  .remove(authController.requireSignin, authController.requireAdmin);

router.param("tokenAddress");

router.route("/sales-service/pending-revenue/:userAddress").get();

router.param("userAddress", userController.userByAddress);

export default router;
