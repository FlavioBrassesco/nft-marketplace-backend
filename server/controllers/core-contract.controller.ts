/// <reference path="../../types/index.d.ts" />
import CoreContract from "../models/core-contract.model";
import { Request, Response } from "express";

const fetch = async (req: Request, res: Response) => {
  const data = await CoreContract.find();
  res.status(200).json(data);
};

const create = async (req: Request, res: Response) => {
  const contract = new CoreContract(req.body);
  await contract.save();
  res.status(201).json(contract);
};

const contractByKey = async (req: Request, res: Response, next, key) => {
  const contract = await CoreContract.findOne({
    key,
  });
  if (!contract) {
    return res.status(404).json({ error: "Contract not found" });
  }
  req.locals.contract = contract;
  next();
};

const read = async (req: Request, res: Response) => {
  return res.status(200).json(req.locals.contract);
};

const update = async (req: Request, res: Response) => {
  const contract = Object.assign(req.locals.contract, req.body);
  await contract.save();
  return res.status(200).json(contract);
};

const remove = async (req: Request, res: Response) => {
  const removed = await req.locals.contract.remove();
  return res.status(200).json(removed);
};

export default { fetch, create, contractByKey, read, update, remove };
