import Item from "../../server/models/item.model";
import db from "./db";

const validItem = {
  tokenId: "0",
  collectionAddress: "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
  tokenURI: "http://localhost:3000",
  owner: "0x6ebaf477f83e055589c1188bcc6ddccd8c9b131a",
};

describe("Item model", () => {
  beforeAll(async () => {
    await db.setUp();
    await Item.ensureIndexes();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test("tokenId should be required", async () => {
    let error = null;
    const { tokenId, ...testItem } = validItem;

    try {
      const item = new Item(testItem);
      await item.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("tokenId")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("required")).toBeGreaterThanOrEqual(0);
  });

  test("collectionAddress should be required", async () => {
    let error = null;
    const { collectionAddress, ...testItem } = validItem;

    try {
      const item = new Item(testItem);
      await item.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("collectionAddress")).toBeGreaterThanOrEqual(
      0
    );
    // @ts-expect-error
    expect(error.message.indexOf("required")).toBeGreaterThanOrEqual(0);
  });

  test("collectionAddress should be valid", async () => {
    let error = null;
    const testItem = { ...validItem, collectionAddress: "notvalid" };

    try {
      const item = new Item(testItem);
      await item.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("collectionAddress")).toBeGreaterThanOrEqual(
      0
    );
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
  });

  test("collectionAddress+tokenId should be unique", async () => {
    let error = null;

    try {
      const item = new Item(validItem);
      const item2 = new Item(validItem);
      await item.save();
      console.log("ERROR", item);
      await item2.save();
      console.log("ERROR", item2);
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });

  test("owner should be valid", async () => {
    let error = null;
    const testItem = { ...validItem, owner: "notvalid" };

    try {
      const item = new Item(testItem);
      await item.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("owner")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
  });

  test("items saves ok", async () => {
    let error = null;
    let item;

    try {
      item = new Item(validItem);
      await item.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(item._id).toBeDefined();
    expect(item.toJSON()).toEqual({
      ...validItem,
      id: expect.any(String),
    });
  });

  test("items saves ok with extra fields", async () => {
    let error = null;
    let item;

    try {
      item = new Item({ ...validItem, metadata: "etc" });
      await item.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(item._id).toBeDefined();
    expect(item.toJSON()).toEqual({
      ...validItem,
      metadata: "etc",
      id: expect.any(String),
    });
  });
});
