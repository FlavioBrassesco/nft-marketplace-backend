import User from "../../server/models/user.model";
import db from "./db";
import { ethers } from "ethers";

const validUser = {
  username: "username",
  address: "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
  role: "user",
  pendingRevenue: "0",
};

describe("User model", () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  it("username is not valid", async () => {
    let error = null;
    const testuser = {
      ...validUser,
      username: ".wrongusername89",
    };

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("username")).toBeGreaterThanOrEqual(0);
  });

  it("username is not required", async () => {
    let error = null;
    const { username, ...testuser } = validUser;

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
  });

  it("username is unique", async () => {
    let error = null;

    try {
      const user = new User(validUser);
      await user.save();
      const user2 = new User(validUser);
      await user2.save();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("dup key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("username")).toBeGreaterThanOrEqual(0);
  });

  it("address is required", async () => {
    let error = null;
    const { address, ...testuser } = validUser;

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("address")).toBeGreaterThanOrEqual(0);
  });

  it("address is not valid", async () => {
    let error = null;
    const testuser = { ...validUser, address: "0x0000" };

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("address")).toBeGreaterThanOrEqual(0);
  });

  it("address is unique", async () => {
    let error = null;
    const otherValidUser = { ...validUser, username: "otheruser" };

    try {
      const user = new User(validUser);
      await user.save();
      const user2 = new User(otherValidUser);
      await user2.save();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("dup key")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("address")).toBeGreaterThanOrEqual(0);
  });

  it("role is required", async () => {
    let error = null;
    const { role, ...testuser } = validUser;

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("role")).toBeGreaterThanOrEqual(0);
  });

  it("role is not valid", async () => {
    let error = null;
    const testuser = { ...validUser, role: "otherrole" };

    try {
      const user = new User(testuser);
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    // @ts-expect-error
    expect(error.message.indexOf("validation")).toBeGreaterThanOrEqual(0);
    // @ts-expect-error
    expect(error.message.indexOf("role")).toBeGreaterThanOrEqual(0);
  });

  it("valid user is saved", async () => {
    let error = null;
    let user;
    try {
      user = new User(validUser);
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(user._id).toBeDefined();
  });

  it("user JSON is correct", async () => {
    const user = new User(validUser);
    await user.save();

    const userJson = user.toJSON();

    expect(userJson).toEqual({
      ...validUser,
      id: expect.any(String),
    });
  });

  it("user does not authenticate", async () => {
    // Create a wallet to sign the hash with
    let privateKey =
      "0x0123456789012345678901234567890123456789012345678901234567890123";
    let wallet = new ethers.Wallet(privateKey);
    let sig = await wallet.signMessage("message");

    const user = new User(validUser);
    await user.save();
    const result = user.authenticate("message", sig);

    expect(result).toBe(false);
  });

  it("user authenticates", async () => {
    jest
      .spyOn(ethers.utils, "verifyMessage")
      .mockImplementationOnce((m, s) => validUser.address);

    const user = new User(validUser);
    await user.save();
    const result = user.authenticate("message", "fakesignature");

    expect(result).toBe(true);
  });
});
