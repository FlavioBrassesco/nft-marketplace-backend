import { ethers } from "ethers";
import CoreContract from "../../models/core-contract.model";

const list = async (req, res) => {
  try {
    const salesservice = await CoreContract.findOne({ key: "salesservice" });
    if (!salesservice)
      return res
        .status(400)
        .json({ error: "Couldn't find Sales service contract" });

    const contract = new ethers.Contract(
      salesservice.address,
      ["function getApprovedTokens() external view returns (address[])"],
      req.web3Provider
    );
    const tokens = await contract.getApprovedTokens();

    const output = await Promise.all(
      tokens.map(async (token) => {
        const contract = new ethers.Contract(
          token,
          [
            "function name() public view returns (string)",
            "function symbol() public view returns (string)",
            "function decimals() public view returns (uint8)",
            "function totalSupply() public view returns (uint256)",
          ],
          req.web3Provider
        );
        return {
          address: token,
          name: await contract.name(),
          symbol: await contract.symbol(),
          decimals: await contract.decimals(),
          totalSupply: (await contract.totalSupply()).toString(),
        };
      })
    );
    res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { list };
