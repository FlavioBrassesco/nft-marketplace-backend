import { ethers } from "ethers";
import AuthorizedMarketplace from "../../models/authorized-marketplace.model";
import CoreContract from "../../models/core-contract.model";

const list = async (req, res) => {
  try {
    const salesservice = await CoreContract.findOne({ key: "salesservice" });
    if (!salesservice)
      return res
        .status(400)
        .json({ error: "Couldn't find sales service contract" });

    const contract = new ethers.Contract(
      salesservice.address,
      ["function getAuthorizedMarketplaces() external view returns(address[])"],
      req.web3Provider
    );

    const marketplaces = await contract.getAuthorizedMarketplaces();

    const output = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const contract = new ethers.Contract(
          marketplace,
          ["function name() view returns (string)"],
          req.web3Provider
        );
        return { address: marketplace, name: await contract.name() };
      })
    );

    res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { list };
