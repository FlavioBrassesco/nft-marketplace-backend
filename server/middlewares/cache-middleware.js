import RequestCache from "../models/request-cache";
import axios from "axios";
import Item from "../models/item.model";

const extractItemData = async (item) => {
  const { data: metadata } = await axios.get(item.tokenURI);

  if (metadata) {
    item = Object.assign(item, { metadata });
  }
};

const itemCacher = async (request, data) => {
  if (/^(.*\/){0,1}collections.*\/items.*/.test(request.originalUrl)) {
    if (Array.isArray(data)) {
      const items = await Promise.all(
        data.map(async (item) => {
          const obj = { insertOne: { document: await extractItemData(item) } };
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

const requestCacher = async (request, data) => {
  const requestCache = {
    originalUrl: request.originalUrl,
    body: JSON.stringify(data),
    blockNumber: request.cacheData.blockNumber,
    transactionHash: request.cacheData.transactionHash,
  };

  await RequestCache.findOneAndUpdate(
    { originalUrl: request.originalUrl },
    requestCache,
    { upsert: true }
  );
};

const cacheMiddleware = (request, response, next) => {
  const cacheOps = request.app.locals.settings.cacheOps;
  try {
    const responseJson = response.json;
    response.json = (data) => {
      // if there is no valid cache
      // and response is not an error
      // and there is not a caching operation running for this request
      if (
        request.cacheData?.shouldCache &&
        data.error === undefined &&
        !cacheOps[request.originalUrl]
      ) {
        cacheOps[request.originalUrl] = true;
        Promise.all([requestCacher(), itemCacher()]).then((response) => {
          cacheOps[request.originalUrl] = false;
        });
      }

      response.json = responseJson;
      responseJson.call(response, data);
    };
  } catch (error) {
    next(error);
  }
  next();
};

export default cacheMiddleware;
