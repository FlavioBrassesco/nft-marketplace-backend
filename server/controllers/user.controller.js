import { ethers } from "ethers";
import User from "../models/user.model";

const list = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const create = async (req, res) => {
  if (
    !ethers.utils.verifyMessage(req.body.message, req.body.signature) ===
    req.body.address
  )
    return res
      .status(400)
      .json({ error: "message signer doesn't equal provided address" });

  const user = new User({ address: req.body.address, role: "user" });
  await user.save();

  res.status(201).json(user);
};

const userByAddress = async (req, res, next, address) => {
  const user = await User.findOne({ address });
  if (!user) return res.status(404).json({ error: "User not found" });
  req.user = user;
  next();
};

const read = async (req, res) => {
  res.status(200).json(req.user);
};

const update = async (req, res) => {
  const updated = req.body;
  // avoid username and role changes
  delete updated.username;
  delete updated.role;

  const user = Object.assign(req.user, updated);

  await user.save();
  res.status(200).json(user);
};

const remove = async (req, res) => {
  const removed = await req.user.remove();
  res.status(200).json(removed);
};

export default { list, create, userByAddress, read, update, remove };
