import { ethers } from "ethers";
import CoreContract from "../../models/core-contract.model";

const read = async (req, res) => {
  try {
    const salesservice = await CoreContract.findOne({ key: "salesservice" });
    if (!salesservice)
      return res
        .status(400)
        .json({ error: "Couldn't find Sales service contract" });

    const contract = new ethers.Contract(
      salesservice.address,
      [
        "function getPendingRevenue(address) external view returns(uint256 revenue)",
      ],
      req.web3Provider
    );

    const output = (
      await contract.getPendingRevenue(req.params.userAddress)
    ).toString();
    res
      .status(200)
      .json({ address: req.params.userAddress, pendingRevenue: output });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { read };
