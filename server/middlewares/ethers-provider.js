import config from "../../config/config";
import { ethers } from "ethers";

const ethersProvider = (req, res, next) => {
  if (config.env !== "production") {
    req.web3Provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
  } else {
    req.web3Provider = new ethers.providers.AlchemyProvider("");
  }
  next();
};

export default ethersProvider;
