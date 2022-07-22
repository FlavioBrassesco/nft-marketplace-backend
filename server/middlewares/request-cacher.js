import RequestCache from "../models/request-cache";

const requestCacher = (request, response, next) => {
  try {
    const responseJson = response.json;
    response.json = async (data) => {
      if (request.cacheData?.shouldCache && data.error === undefined) {
        const requestCache = {
          originalUrl: request.originalUrl,
          body: JSON.stringify(data),
          blockNumber: request.cacheData.blockNumber,
          transactionHash: request.cacheData.transactionHash,
        };

        if (request.cacheData?.response) {
          request.cacheData.response.update(requestCache);
        } else {
          const rc = new RequestCache(requestCache);
          await rc.save();
        }

        console.log("cache written - request-cacher.js - 15");
      }

      response.json = responseJson;
      responseJson.call(response, data);
    };
  } catch (error) {
    next(error);
  }
  next();
};
export default requestCacher;
