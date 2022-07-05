import CoreContract from "../models/core-contract.model";

const fetch = async (req, res) => {
  try {
    const data = await CoreContract.find();
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const create = async (req, res) => {
  const contract = new CoreContract(req.body);
  try {
    await contract.save();
    res.status(201).json(contract);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const contractByKey = async (req, res, next, key) => {
  try {
    const contract = await CoreContract.findOne({ key: key });
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    req.contract = contract;
    next();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const read = async (req, res) => {
  return res.status(200).json(req.contract);
};

const update = async (req, res) => {
  try {
    let contract = req.contract;
    contract = Object.assign(contract, req.body);
    await contract.save();
    return res.status(200).json(contract);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await req.contract.remove();
    return res.status(200).json(removed);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export default { fetch, create, contractByKey, read, update, remove };
