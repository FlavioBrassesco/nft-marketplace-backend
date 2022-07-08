import { abi as managerAbi } from "../abis/manager.abi.json";
import { abi as marketplaceAbi } from "../abis/marketplace.abi.json";
import { abi as auctionsAbi } from "../abis/auctions.abi.json";
import { abi as buyoffersAbi } from "../abis/buyoffers.abi.json";
import { abi as salesServiceAbi } from "../abis/salesservice.abi.json";

const manager = async (req, res, next) => {
  const manager = await CoreContract.findOne({ key: "manager" });
  if (!manager)
    return res
      .status(400)
      .json({ error: "Couldn't find collection manager contract" });

  const contract = new ethers.Contract(
    manager.address,
    managerAbi,
    req.web3Provider
  );
  req.manager = contract;
  next();
};

const marketplace = async (req, res, next) => {
  const marketplace = await CoreContract.findOne({ key: "marketplace" });
  if (!marketplace)
    return res
      .status(400)
      .json({ error: "Couldn't find marketplace contract" });

  req.marketplace = new ethers.Contract(
    marketplace.address,
    marketplaceAbi,
    req.web3Provider
  );
  next();
};

const auctions = async (req, res, next) => {
  const auctions = await CoreContract.findOne({ key: "auctions" });
  if (!auctions)
    return res.status(400).json({ error: "Couldn't find auctions contract" });

  req.auctions = new ethers.Contract(
    auctions.address,
    auctionsAbi,
    req.web3Provider
  );
  next();
};

const buyoffers = async (req, res, next) => {
  const buyoffers = await CoreContract.findOne({ key: "buyoffers" });
  if (!buyoffers)
    return res.status(400).json({ error: "Couldn't find buy offers contract" });

  req.buyoffers = new ethers.Contract(
    buyoffers.address,
    buyoffersAbi,
    req.web3Provider
  );
  next();
};

const salesservice = async (req, res, next) => {
  const salesservice = await CoreContract.findOne({ key: "salesservice" });
  if (!salesservice)
    return res
      .status(400)
      .json({ error: "Couldn't find sales service contract" });

  const contract = new ethers.Contract(
    salesservice.address,
    salesServiceAbi,
    req.web3Provider
  );
  req.salesservice = contract;
  next();
};

export default { manager, marketplace, auctions, buyoffers, salesservice };
