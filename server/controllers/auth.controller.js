import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../../config/config";

const signin = async (req, res) => {
  const user = await User.findOne({ address: req.body.address });

  if (!user) return res.status(401).json({ error: "user not found" });

  if (!user.authenticate(req.body.message, req.body.signature))
    return res.status(401).json({ error: "signature and address don't match" });

  const token = jwt.sign({ address: req.body.address }, config.jwtSecret);

  res.cookie("t", token, { expire: new Date() + 9999 });

  res.status(200).json({
    token,
    user,
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Signed out",
  });
};

// Authorization: Bearer jsonwebtoken decode
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// req.user comes from user.controller userByAddress
const hasAuthorization = async (req, res, next) => {
  const auth = await User.findOne({ address: req.auth.address });
  if (auth.role === "admin") return next();

  const authorized =
    req.user && req.auth && req.user.address === req.auth.address;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }

  next();
};

const requireAdmin = async (req, res, next) => {
  const user = await User.findOne({ address: req.auth.address });
  if (!user) return res.status(403).json({ error: "user not found" });

  if (user.role !== "admin")
    return res.status(403).json({ error: "user is not authorized" });
    
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  requireAdmin,
};
