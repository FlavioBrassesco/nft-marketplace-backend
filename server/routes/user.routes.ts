import express from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/user/")
  .get(userController.list)
  .post(userController.create);

router
  .route("/user/:address")
  .get(userController.read)
  .put(
    authController.requireSignin,
    authController.hasAuthorization,
    userController.update
  )
  .delete(
    authController.requireSignin,
    authController.hasAuthorization,
    userController.remove
  );

router.param("address", userController.userByAddress);

export default router;
