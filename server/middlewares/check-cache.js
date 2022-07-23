import RequestCache from "../models/request-cache";

// this middleware requires coreContracts middleware and ethersProvider middleware
// it should be called in each route that interacts with the blockchain, after coreContracts middleware

const getLatestLog = async (contract, provider, blockNumber) => {
  const filter = {
    address: contract.address,
    fromBlock: blockNumber - 10,
    toBlock: "latest",
  };

  const logs = await provider.getLogs(filter);
  return logs[logs.length - 1];
};

const getLatestCachedResponse = async (req) => {
  const cache = await RequestCache.findOne({
    originalUrl: req.originalUrl,
  });
  return cache;
};

const checkCache = async (req, res, next) => {
  if (req.method !== "GET") {
    next();
  }

  const cachedResponse = await getLatestCachedResponse(req);
  const bn = cachedResponse
    ? cachedResponse.blockNumber
    : (await req.web3Provider.getBlockNumber()) - 5000 || 0;

  const log = await getLatestLog(
    req.contracts.manager,
    req.web3Provider,
    bn
  );

  if (!cachedResponse) {
    req.cacheData = {
      shouldCache: true,
      blockNumber:
        log?.blockNumber || (await req.web3Provider.getBlockNumber()),
      transactionHash: "",
      response: cachedResponse,
    };
    return next();
  }

  // if the log is so old we cannot retrieve it (or in the worst case there is no log)
  if (!log?.blockNumber) {
    req.cacheData = {
      shouldCache: true,
      blockNumber: await req.web3Provider.getBlockNumber(),
      transactionHash: "",
      response: cachedResponse,
    };
    return next();
  }

  // if the log block number is newer
  // or is equal to the block number of the cached response but has a different hash
  if (
    log.blockNumber > cachedResponse?.blockNumber ||
    (log.blockNumber === cachedResponse?.blockNumber &&
      cachedResponse?.transactionHash &&
      cachedResponse?.transactionHash !== log.transactionHash)
  ) {
    console.log("log.blockNumber > - check-cache - 72");
    req.cacheData = {
      shouldCache: true,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      response: cachedResponse,
    };
    return next();
  }

  return res.status(200).json(JSON.parse(cachedResponse.body));
};

export default checkCache;
