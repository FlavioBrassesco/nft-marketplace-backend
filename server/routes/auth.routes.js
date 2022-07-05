import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.use("/signin").post(authController.signin);
router.use("/signout").get(authController.signout);

export default router;
