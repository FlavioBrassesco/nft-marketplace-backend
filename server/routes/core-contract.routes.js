import express from "express";
const router = express.Router();

import coreContractController from "../controllers/core-contract.controller";
import authController from "../controllers/auth.controller";

router
  .route("/core-contracts/")
  .get(coreContractController.fetch)
  .post(
    authController.requireSignin,
    authController.requireAdmin,
    coreContractController.create
  );

router
  .route("/core-contracts/:key")
  .get(
    coreContractController.read
  )
  .put(
    authController.requireSignin,
    authController.requireAdmin,
    coreContractController.update
  )
  .delete(
    authController.requireSignin,
    authController.requireAdmin,
    coreContractController.remove
  );

router.param("key", coreContractController.contractByKey);

export default router;
