/// <reference path="../../../types/index.d.ts" />
import { Request } from "express";
import RequestCache, { IRequestCache } from "../../models/request-cache.model";

export default async function requestCacher(request: Request, data) {
  const requestCache: IRequestCache = {
    originalUrl: request.originalUrl,
    body: JSON.stringify(data),
    blockNumber: request.locals.cacheData.blockNumber,
    transactionHash: request.locals.cacheData.transactionHash,
  };

  await RequestCache.findOneAndUpdate(
    { originalUrl: request.originalUrl },
    requestCache,
    { upsert: true }
  );
}
