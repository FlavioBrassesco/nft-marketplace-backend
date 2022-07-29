import CoreContract from "../../server/models/core-contract.model";
import db from "./db";

const validContract = {
  key: "manager",
  address: "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
};

describe("CoreContract model", () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test("key should be required", async () => {
    let error = null;
    const { key, ...testContract } = validContract;

    try {
      const contract = new CoreContract(testContract);
      await contract.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("required")).toBeGreaterThanOrEqual(0);
  });

  test("key should be valid", async () => {
    let error = null;
    const testContract = { ...validContract, key: "notvalid" };

    try {
      const contract = new CoreContract(testContract);
      await contract.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
  });

  test("key should be unique", async () => {
    let error = null;

    try {
      const contract = new CoreContract(validContract);
      const contract2 = new CoreContract({
        ...validContract,
        address: "0x6ebaf477f83e055589c1188bcc6ddccd8c9b131a",
      });
      await contract.save();
      await contract2.save();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("dup key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("key:")).toBeGreaterThanOrEqual(0);
  });

  test("address should be required", async () => {
    let error = null;
    const { address, ...testContract } = validContract;

    try {
      const contract = new CoreContract(testContract);
      await contract.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("address")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("required")).toBeGreaterThanOrEqual(0);
  });

  test("address should be unique", async () => {
    let error = null;

    try {
      const contract = new CoreContract(validContract);
      const contract2 = new CoreContract({
        ...validContract,
        key: "marketplace",
      });
      await contract.save();
      await contract2.save();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("dup key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("address:")).toBeGreaterThanOrEqual(0);
  });

  test("address should be valid", async () => {
    let error = null;
    const testContract = { ...validContract, address: "notvalid" };

    try {
      const contract = new CoreContract(testContract);
      await contract.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("address")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
  });

  test("valid core-contract is saved", async () => {
    let error = null;
    let contract;
    try {
      contract = new CoreContract(validContract);
      await contract.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(contract._id).toBeDefined();
    expect(contract.toJSON()).toEqual({
      ...validContract,
      id: expect.any(String),
    });
  });
});
