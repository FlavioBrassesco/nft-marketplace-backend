/// <reference path="../../../types/index.d.ts" />
import { Request } from "express";
import Item, { IItem } from "../../models/item.model";
import { AnyBulkWriteOperation } from "mongodb";
import axios from "axios";

export const extractItemData = async (item): Promise<IItem> => {
  const { data: metadata } = await axios.get(item.tokenURI);

  if (metadata) {
    item = Object.assign(item, { metadata });
  }

  return item;
};

export default async function itemCacher(request: Request, data) {
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
}
