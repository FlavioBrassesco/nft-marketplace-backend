/// <reference path="../../types/index.d.ts" />
import RequestCache, { IRequestCache } from "../models/request-cache";
import { Request, Response } from "express";
import { AnyBulkWriteOperation } from "mongodb";
import axios from "axios";
import Item, { IItem } from "../models/item.model";

const extractItemData = async (item): Promise<IItem> => {
  const { data: metadata } = await axios.get(item.tokenURI);

  if (metadata) {
    item = Object.assign(item, { metadata });
  }

  return item;
};

const itemCacher = async (request: Request, data) => {
  if (/^(.*\/){0,1}collections.*\/items.*/.test(request.originalUrl)) {
    if (Array.isArray(data)) {
      const items: AnyBulkWriteOperation[] = await Promise.all(
        data.map(async (item) => {
          const obj = {
            insertOne: { document: await extractItemData(item) },
          };
          return obj;
        })
      );

      await Item.bulkWrite(items, { ordered: false });
    } else {
      const item = await extractItemData(data);
      await Item.findOneAndUpdate(
        {
          collectionAddress: data.collectionAddress,
          tokenId: data.tokenId,
        },
        item,
        { upsert: true }
      );
    }
  }
};

const requestCacher = async (request: Request, data) => {
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
};

const cacheMiddleware = (request: Request, response: Response, next) => {
  const cacheOps = request.app.locals.settings.cacheOps;
  try {
    const responseJson = response.json;
    response.json = (data) => {
      // if there is no valid cache
      // and response is not an error
      // and there is not a caching operation running for this request
      if (
        request.locals.cacheData?.shouldCache &&
        data.error === undefined &&
        !cacheOps[request.originalUrl]
      ) {
        cacheOps[request.originalUrl] = true;
        Promise.all([
          requestCacher(request, data),
          itemCacher(request, data),
        ]).then((response) => {
          cacheOps[request.originalUrl] = false;
        });
      }

      response.json = responseJson;
      return responseJson.call(response, data);
    };
  } catch (error) {
    next(error);
  }
  next();
};

export default cacheMiddleware;
