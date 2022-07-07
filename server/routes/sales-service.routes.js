import express from "express";
import CoreContract from "../models/core-contract.model";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import authorizedMarketplaceController from "../controllers/sales-service/authorized-marketplace.controller";
import approvedTokenController from "../controllers/sales-service/approved-token.controller";
import pendingRevenueController from "../controllers/sales-service/pending-revenue.controller";
import { abi as salesServiceAbi } from "../abis/salesservice.abi.json";

const router = express.Router();

router.use("/sales-service", async (req, res, next) => {
  const salesservice = await CoreContract.findOne({ key: "salesservice" });
  if (!salesservice)
    return res
      .status(400)
      .json({ error: "Couldn't find sales service contract" });

  const contract = new ethers.Contract(
    salesservice.address,
    salesServiceAbi,
    req.web3Provider
  );
  req.salesservice = contract;
  next();
});

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
