import { Request } from "express";
import * as mockingoose from "mockingoose";
import makeResponse from "../test-helpers/make-response";
import User, { IUser } from "../../server/models/user.model";
import userController from "../../server/controllers/user.controller";
import { ethers } from "ethers";

jest.mock("ethers", () => {
  return {
    ethers: {
      utils: {
        verifyMessage: jest.fn(),
        isAddress: () => true,
      },
    },
  };
});

const fakeUsers: IUser[] = [
  {
    username: "fakeuser",
    address: "0xfakeaddress",
    role: "user",
    pendingRevenue: "0x0000000001",
  },
];

describe("User controller", () => {
  it("list() --> should list all users", async () => {
    mockingoose(User).toReturn(fakeUsers, "find");

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    await userController.list({} as Request, response);

    console.log(result);
    expect(result[0]).toBe(200);
    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          username: expect.any(String),
          pendingRevenue: expect.any(String),
          id: expect.any(String),
          role: expect.any(String),
        }),
      ])
    );
  });

  it("create() --> should create a new user", async () => {
    const newUser = {
      username: "newuser",
      address: "0xnewuseraddress",
      role: "user",
      pendingRevenue: "0x00",
    } as IUser;
    const request = {
      body: {
        message: "fakemessage",
        signature: "fakesignature",
        address: newUser.address,
      },
    } as Request;
    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    // @ts-expect-error
    ethers.utils.verifyMessage.mockImplementationOnce(
      (m, s) => newUser.address
    );
    mockingoose(User).toReturn(newUser, "save");
    await userController.create(request as Request, response);

    expect(result[0]).toBe(201);
    expect(result[1]).toEqual(
      expect.objectContaining({
        address: newUser.address,
        id: expect.any(String),
        role: "user",
      })
    );
  });

  it("create() --> should not create a new user on failed verifyMessage", async () => {
    const request = {
      body: {
        message: "fakemessage",
        signature: "fakesignature",
        address: "useraddress",
      },
    } as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    // @ts-expect-error
    ethers.utils.verifyMessage.mockImplementationOnce((m, s) => "otheraddress");
    await userController.create(request as Request, response);

    expect(result[0]).toBe(400);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("userByAddress() --> should populate request.locals.user with a user", async () => {
    const request = {
      locals: {},
    } as Request;

    mockingoose(User).toReturn(fakeUsers[0], "findOne");

    const response = makeResponse((d) => d);

    const next = jest.fn();
    await userController.userByAddress(
      request,
      response,
      next,
      fakeUsers[0].address
    );

    expect(request.locals.user).toEqual(
      expect.objectContaining({
        address: fakeUsers[0].address,
        username: fakeUsers[0].username,
        pendingRevenue: fakeUsers[0].pendingRevenue,
        id: expect.any(String),
        role: fakeUsers[0].role,
      })
    );
    expect(next).toBeCalled();
  });

  it("userByAddress() --> should not populate request.locals.user with a null response fron findOne", async () => {
    const request = {
      locals: {},
    } as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    mockingoose(User).toReturn(null, "findOne");

    const next = jest.fn();
    await userController.userByAddress(
      request as Request,
      response,
      next,
      fakeUsers[0].address
    );

    expect(result[0]).toBe(404);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("read() --> should read user in request.locals.user", async () => {
    const request = {
      locals: {
        user: fakeUsers[0],
      },
    } as unknown as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    await userController.read(request as Request, response);

    expect(result[0]).toBe(200);
    expect(result[1]).toEqual(fakeUsers[0]);
  });

  it("update() --> should update user with request.body", async () => {
    const mock = jest.fn();

    const request = {
      locals: {
        user: {
          save: mock,
          ...fakeUsers[0],
        },
      },
      body: {
        username: "userupdated",
        address: "addressupdated",
      },
    } as unknown as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    await userController.update(request as Request, response);

    const updated = Object.assign(request.locals.user, {
      address: "addressupdated",
    });

    expect(mock).toBeCalled();
    expect(result[0]).toBe(200);
    expect(result[1]).toEqual(updated);
  });

  it("remove() --> should call remove and return remove result", async () => {
    const mock = jest.fn(() => true);
    const request = {
      locals: {
        user: {
          remove: mock,
        },
      },
    } as unknown as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    await userController.remove(request as Request, response);

    expect(result[0]).toBe(200);
    expect(result[1]).toBe(true);
  });
});
