import express from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const router = express.Router();

router
  .use("/user/")
  .get(userController.list)
  .post(userController.create);

router
  .use("/user/:address")
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
