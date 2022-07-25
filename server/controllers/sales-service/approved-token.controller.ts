/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { ERC20__factory } from "../../typechain-types/factories/@openzeppelin/contracts/token/ERC20/ERC20__factory";
import { SalesService } from "../../typechain-types/contracts/services/SalesService";

const list = async (req: Request, res: Response) => {
  const salesservice = <SalesService>req.locals.contracts.salesservice;
  const tokens = await salesservice.getApprovedTokens();

  const output = await Promise.all(
    tokens.map(async (token) => {
      const erc20 = ERC20__factory.connect(token, req.locals.web3Provider);

      return {
        address: token,
        name: await erc20.name(),
        symbol: await erc20.symbol(),
        decimals: await erc20.decimals(),
        totalSupply: await erc20.totalSupply(),
      };
    })
  );
  res.status(200).json(output);
};

export default { list };
