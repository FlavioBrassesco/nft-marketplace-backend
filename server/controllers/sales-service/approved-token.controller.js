import { ethers } from "ethers";
import { abi as erc20Abi } from "../../abis/erc20.abi.json";

const list = async (req, res) => {
  const tokens = await req.contracts.salesservice.getApprovedTokens();

  const output = await Promise.all(
    tokens.map(async (token) => {
      const erc20 = new ethers.Contract(token, erc20Abi, req.web3Provider);
      
      return {
        address: token,
        name: await erc20.name(),
        symbol: await erc20.symbol(),
        decimals: await erc20.decimals(),
        totalSupply: (await erc20.totalSupply()).toString(),
      };
    })
  );
  res.status(200).json(output);
};

export default { list };
