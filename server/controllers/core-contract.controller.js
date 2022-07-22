import CoreContract from "../models/core-contract.model";

const fetch = async (req, res) => {
  const data = await CoreContract.find();
  res.status(200).json(data);
};

const create = async (req, res) => {
  const contract = new CoreContract(req.body);
  await contract.save();
  res.status(201).json(contract);
};

const contractByKey = async (req, res, next, key) => {
  const contract = await CoreContract.findOne({ key });
  if (!contract) {
    return res.status(404).json({ error: "Contract not found" });
  }
  req.contract = contract;
  next();
};

const read = async (req, res) => {
  return res.status(200).json(req.contract);
};

const update = async (req, res) => {
  const contract = Object.assign(req.contract, req.body);
  await contract.save();
  return res.status(200).json(contract);
};

const remove = async (req, res) => {
  const removed = await req.contract.remove();
  return res.status(200).json(removed);
};

export default { fetch, create, contractByKey, read, update, remove };
