/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { SalesService } from "../../typechain-types/contracts/services/SalesService";
import { NFTMarketplace__factory } from "../../typechain-types/factories/contracts/NFTMarketplace__factory";

const list = async (req: Request, res: Response) => {
  const salesservice = <SalesService>req.locals.contracts.salesservice;
  const marketplaces = await salesservice.getAuthorizedMarketplaces();

  const output = await Promise.all(
    marketplaces.map(async (marketplace) => {
      const contract = NFTMarketplace__factory.connect(
        marketplace,
        req.locals.web3Provider
      );
      return { address: marketplace, name: await contract.name() };
    })
  );

  res.status(200).json(output);
};

export default { list };
