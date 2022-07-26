import { Request } from "express";
import Item, { IItem } from "../../models/item.model";
import RequestCache, { IRequestCache } from "../../models/request-cache";
import { AnyBulkWriteOperation } from "mongodb";
import axios from "axios";

export const extractItemData = async (item): Promise<IItem> => {
  const { data: metadata } = await axios.get(item.tokenURI);

  if (metadata) {
    item = Object.assign(item, { metadata });
  }

  return item;
};

export const itemCacher = async (request: Request, data) => {
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

export const requestCacher = async (request: Request, data) => {
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
