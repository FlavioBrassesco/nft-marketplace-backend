/// <reference path="../../types/index.d.ts" />
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../config/config";
import { Request, Response } from "express";

const signin = async (req: Request, res: Response) => {
  const user = await User.findOne({ address: req.body.address });

  if (!user) return res.status(401).json({ error: "user not found" });

  if (!user.authenticate(req.body.message, req.body.signature))
    return res.status(401).json({ error: "signature and address don't match" });

  const token = jwt.sign({ address: req.body.address }, config.jwtSecret);

  const date = new Date();
  res.cookie("t", token, { expires: new Date(date.getDate() + 9999) });

  res.status(200).json({
    token,
    user,
  });
};

const signout = (req: Request, res: Response) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Signed out",
  });
};

// Authorization: Bearer jsonwebtoken decode
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
});

// req.locals.user comes from user.controller userByAddress
const hasAuthorization = async (req: Request, res: Response, next) => {
  const auth = await User.findOne({ address: req.auth.address });
  if (auth?.role === "admin") return next();

  const authorized =
    req.locals.user && req.auth && req.locals.user.address === req.auth.address;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }

  next();
};

const requireAdmin = async (req: Request, res: Response, next) => {
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
