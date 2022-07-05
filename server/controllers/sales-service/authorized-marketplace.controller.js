import { ethers } from "ethers";
import AuthorizedMarketplace from "../../models/authorized-marketplace.model";
import CoreContract from "../../models/core-contract.model";
import { abi } from "../../abis/sales-service.abi";

const list = async (req, res) => {
  try {
    const salesservice = await CoreContract.findOne({ key: "salesservice" });
    if (!salesservice)
      return res
        .status(400)
        .json({ error: "Couldn't find sales service contract" });
        
    const contract = new ethers.Contract(
      salesservice.address,
      abi,
      req.web3Provider
    );

    const marketplaces = await contract.getAuthorizedMarketplaces();
    res.status(200).json(marketplaces);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { list };
