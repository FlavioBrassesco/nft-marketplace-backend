import CacheMiddleware, {
  Cacher,
  Checker,
} from "../../../server/middlewares/cache/CacheMiddleware";
import express from "express";

describe("CacheMiddleware", () => {
  let fakeExpress;
  let cache;
  const fakeCacher: Cacher = (request, data) => {
    const requestCache = {
      originalUrl: request.originalUrl,
      body: JSON.stringify(data),
      blockNumber: request.locals.cacheData.blockNumber,
      transactionHash: request.locals.cacheData.transactionHash,
    };
    cache = {
      [request.originalUrl]: requestCache,
    };
  };

  const url = "/api/mock/url";
  const fakeData = {
    fakedata: "this is fakedata",
  };

  beforeEach(() => {
    CacheMiddleware.destroy();
    cache = {};
    fakeExpress = express();
  });

  it("Should set app settings", () => {
    const cm = CacheMiddleware.getInstance();
    cm.registerApp(fakeExpress);
    expect(typeof fakeExpress.get("cacheOps")).not.toBe("undefined");
  });

  it("Should not cache data", () => {
    const request = {
      originalUrl: url,
      app: {
        locals: {
          settings: {
            cacheOps: {
              [url]: true,
            },
          },
        },
      },
      locals: {
        cacheData: {
          blockNumber: 1,
          transactionHash: "faketransactionhash",
          shouldCache: true,
        },
      },
    };

    const response = {
      status(number) {
        console.log("status:", number);
        return this;
      },
      json: (data) => console.log("Control returned", data),
    };

    const cm = CacheMiddleware.getInstance();
    cm.registerCacher(fakeCacher);
    const middleware = cm.getMiddleware();
    middleware(request, response, () => true);

    response.json(fakeData);

    expect(typeof cache[url]).toBe("undefined");
  });

  it("Should cache data", () => {
    const request = {
      originalUrl: url,
      app: {
        locals: {
          settings: {
            cacheOps: {},
          },
        },
      },
      locals: {
        cacheData: {
          blockNumber: 1,
          transactionHash: "faketransactionhash",
          shouldCache: true,
        },
      },
    };

    const response = {
      status(number) {
        console.log("status:", number);
        return this;
      },
      json: (data) => console.log("Control returned", data),
    };

    const cm = CacheMiddleware.getInstance();
    cm.registerCacher(fakeCacher);
    const middleware = cm.getMiddleware();
    middleware(request, response, () => true);

    response.json(fakeData);

    expect(cache[url]).toEqual({
      originalUrl: request.originalUrl,
      body: JSON.stringify(fakeData),
      blockNumber: request.locals.cacheData.blockNumber,
      transactionHash: request.locals.cacheData.transactionHash,
    });
  });

  it("Should prepare cache", () => {
    const request = {
      method: "GET",
      route: {
        path: url,
      },
      locals: {
        cacheData: {},
      },
    };

    const response = {
      status(number) {
        console.log("status:", number);
        return this;
      },
      json: (data) => console.log("Control returned", data),
    };

    const fakeChecker: Checker = (request) => {
      return {
        shouldCache: true,
        body: "fake body",
      };
    };

    const cm = CacheMiddleware.getInstance();
    cm.registerChecker("fakeChecker", fakeChecker);
    const checker = cm.getCheckerMiddleware("fakeChecker");

    checker(request, response, () => true).then(() => {
      expect(request.locals.cacheData).toEqual({
        shouldCache: true,
        body: "fake body",
      });
    });
  });

  it("Should retrieve cached data", async () => {
    const request = {
      method: "GET",
      locals: {
        cacheData: {},
      },
      route: {
        path: url,
      },
    };

    const response = {
      status(number) {
        console.log("status:", number);
        return this;
      },
      json: (data) => console.log("Control returned", data),
    };

    const fakeChecker: Checker = (request) => {
      return {
        shouldCache: false,
        body: JSON.stringify({ message: "fake cached body" }),
      };
    };

    const cm = CacheMiddleware.getInstance();
    cm.registerChecker("fakeChecker", fakeChecker);
    const checker = cm.getCheckerMiddleware("fakeChecker");

    let intercepted;
    response.json = (data) => (intercepted = data);
    await checker(request, response, () => true);
    expect(request.locals.cacheData).toEqual({});
    expect(intercepted).toEqual({ message: "fake cached body" });
  });

  it("Should not check on unregistered route", async () => {
    const request = {
      method: "GET",
      locals: {
        cacheData: {},
      },
      route: {
        path: url,
      },
    };

    const response = {
      status(number) {
        console.log("status:", number);
        return this;
      },
      json: (data) => console.log("Control returned", data),
    };

    const fakeChecker: Checker = (request) => {
      return {
        shouldCache: false,
        body: JSON.stringify({ message: "fake cached body" }),
      };
    };

    const cm = CacheMiddleware.getInstance();
    cm.registerChecker("otherChecker", fakeChecker);
    const checker = cm.getCheckerMiddleware("fakeChecker");

    let intercepted;
    response.json = (data) => (intercepted = data);

    await checker(request, response, () => true);
    expect(typeof intercepted).toBe("undefined");
    expect(request.locals.cacheData).toEqual({});
  });
});
