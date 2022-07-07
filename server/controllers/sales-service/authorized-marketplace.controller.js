import { ethers } from "ethers";

const list = async (req, res) => {
  const salesservice = req.salesservice;
  try {
    const marketplaces = await salesservice.getAuthorizedMarketplaces();

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
