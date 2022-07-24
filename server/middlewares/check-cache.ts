import RequestCache, { IRequestCache } from "../models/request-cache";
import { Request, Response } from "express";
import { Contract, providers } from "ethers";

export type RequestCacheData = {
  shouldCache: boolean;
  blockNumber: number;
  transactionHash: string;
  response: IRequestCache | null;
};

// this middleware requires coreContracts middleware and ethersProvider middleware
// it should be called in each route that interacts with the blockchain, after coreContracts middleware

const getLatestLog = async (
  contract: Contract,
  provider: providers.BaseProvider,
  blockNumber: number
) => {
  const filter = {
    address: contract.address,
    fromBlock: blockNumber - 10,
    toBlock: "latest",
  };

  const logs = await provider.getLogs(filter);
  return logs[logs.length - 1];
};

const getLatestCachedResponse = async (
  req: Request
): Promise<IRequestCache | null> => {
  const cache = await RequestCache.findOne({
    originalUrl: req.originalUrl,
  });
  return cache;
};

const checkCache = async (req: Request, res: Response, next) => {
  if (req.method !== "GET") next();

  const cachedResponse = await getLatestCachedResponse(req);
  const bn = cachedResponse
    ? cachedResponse.blockNumber
    : (await req.locals.web3Provider.getBlockNumber()) - 5000 || 0;

  const log = await getLatestLog(
    req.locals.contracts.manager,
    req.locals.web3Provider,
    bn
  );

  if (!cachedResponse) {
    req.locals.cacheData = <RequestCacheData>{
      shouldCache: true,
      blockNumber:
        log?.blockNumber || (await req.locals.web3Provider.getBlockNumber()),
      transactionHash: "",
      response: cachedResponse,
    };
    return next();
  }

  // if the log is so old we cannot retrieve it (or in the worst case there is no log)
  if (!log?.blockNumber) {
    req.locals.cacheData = <RequestCacheData>{
      shouldCache: true,
      blockNumber: await req.locals.web3Provider.getBlockNumber(),
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
    req.locals.cacheData = <RequestCacheData>{
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
