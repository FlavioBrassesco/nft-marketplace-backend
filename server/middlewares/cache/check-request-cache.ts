/// <reference path="../../../types/index.d.ts" />
import RequestCache, { IRequestCache } from "../../models/request-cache";
import { Request } from "express";
import { Contract, providers } from "ethers";

export type RequestCacheData = {
  shouldCache: boolean;
  blockNumber: number;
  transactionHash: string;
  response: IRequestCache | null;
};

// this checker requires coreContracts middleware and ethersProvider middleware
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

export default async function checkRequestCache(request: Request) {
  const cachedResponse = await getLatestCachedResponse(request);
  const bn = cachedResponse
    ? cachedResponse.blockNumber
    : (await request.locals.web3Provider.getBlockNumber()) - 5000 || 0;

  const log = await getLatestLog(
    request.locals.contracts.manager,
    request.locals.web3Provider,
    bn
  );

  if (!cachedResponse) {
    return {
      shouldCache: true,
      blockNumber:
        log?.blockNumber ||
        (await request.locals.web3Provider.getBlockNumber()),
      transactionHash: "",
      response: cachedResponse,
    };
  }

  // if the log is so old we cannot retrieve it (or in the worst case there is no log)
  if (!log?.blockNumber) {
    return {
      shouldCache: true,
      blockNumber: await request.locals.web3Provider.getBlockNumber(),
      transactionHash: "",
      response: cachedResponse,
    };
  }

  // if the log block number is newer
  // or is equal to the block number of the cached response but has a different hash
  if (
    log.blockNumber > cachedResponse?.blockNumber ||
    (log.blockNumber === cachedResponse?.blockNumber &&
      cachedResponse?.transactionHash &&
      cachedResponse?.transactionHash !== log.transactionHash)
  ) {
    return {
      shouldCache: true,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      response: cachedResponse,
    };
  }

  return {
    shouldCache: false,
    body: cachedResponse.body,
  };
}
