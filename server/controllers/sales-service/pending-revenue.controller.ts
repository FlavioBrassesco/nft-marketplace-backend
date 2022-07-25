/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { SalesService } from "../../typechain-types/contracts/services/SalesService";

const read = async (req: Request, res: Response) => {
  const salesservice = <SalesService>req.locals.contracts.salesservice;

  const output = await salesservice.getPendingRevenue(req.params.userAddress);
  
  res
    .status(200)
    .json({ address: req.params.userAddress, pendingRevenue: output });
};

export default { read };
