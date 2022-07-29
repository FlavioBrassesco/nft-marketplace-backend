import RequestCache from "../../server/models/request-cache.model";
import db from "./db";

const requestCache = {
  originalUrl: "api/test/request/cache",
  body: '{"json":"body"}',
  blockNumber: 1000,
  transactionHash: "randomhash",
};

describe("RequestCache model", () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  it("originalUrl is required", async () => {
    let error = null;
    const { originalUrl, ...testCache } = requestCache;

    try {
      const cache = new RequestCache(testCache);
      await cache.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error?.message.indexOf("originalUrl")).toBeGreaterThanOrEqual(0);
  });

  it("body is required", async () => {
    let error = null;
    const { body, ...testCache } = requestCache;

    try {
      const cache = new RequestCache(testCache);
      await cache.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error?.message.indexOf("body")).toBeGreaterThanOrEqual(0);
  });

  it("blockNumber is required", async () => {
    let error = null;
    const { blockNumber, ...testCache } = requestCache;

    try {
      const cache = new RequestCache(testCache);
      await cache.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error?.message.indexOf("blockNumber")).toBeGreaterThanOrEqual(0);
  });

  it("originalUrl is unique", async () => {
    let error = null;

    try {
      const cache = new RequestCache(requestCache);
      await cache.save();
      const cache2 = new RequestCache(requestCache);
      await cache2.save();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error?.message.indexOf("dup key")).toBeGreaterThanOrEqual(0);
  });

  it("requestCache validates ok", async () => {
    let error = null;
    let cache;
    try {
      cache = new RequestCache(requestCache);
      await cache.validate();
      await cache.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(cache._id).toBeDefined();
    expect(cache.transactionHash).toBeDefined();
  });
});
