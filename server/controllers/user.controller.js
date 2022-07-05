import { ethers } from "ethers";
import User from "../models/user.model";

const list = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const create = async (req, res) => {
  if (
    !ethers.utils.verifyMessage(req.body.message, req.body.signature) ===
    req.body.address
  )
    return res
      .status(400)
      .json({ error: "Message signer doesn't equal provided address" });

  const user = new User({ address: req.body.address, role: "user" });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const userByAddress = async (req, res, next, address) => {
  try {
    const user = await User.findOne({ address: address });
    if (!user) return res.status(404).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const read = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const update = async (req, res) => {
  const user = req.user;
  const updated = req.body;
  
  // avoid username and role changes
  delete updated.username;
  delete updated.role;

  user = Object.assign(user, updated);
  try {
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await req.user.remove();
    res.status(200).json(removed);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { list, create, userByAddress, read, update, remove };
