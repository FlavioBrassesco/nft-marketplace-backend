import * as mockingoose from "mockingoose";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
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
    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    mockingoose(User).toReturn(fakeUsers, "find");

    await userController.list(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
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

    const request = new MockExpressRequest({
      body: {
        message: "fakemessage",
        signature: "fakesignature",
        address: newUser.address,
      },
    });
    const response = new MockExpressResponse();

    // @ts-expect-error
    ethers.utils.verifyMessage.mockImplementationOnce(
      (m, s) => newUser.address
    );
    mockingoose(User).toReturn(newUser, "save");

    await userController.create(request, response);

    expect(response.statusCode).toBe(201);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        address: newUser.address,
        id: expect.any(String),
        role: "user",
      })
    );
  });

  it("create() --> should not create a new user on failed verifyMessage", async () => {
    const request = new MockExpressRequest({
      body: {
        message: "fakemessage",
        signature: "fakesignature",
        address: "useraddress",
      },
    });
    const response = new MockExpressResponse();

    // @ts-expect-error
    ethers.utils.verifyMessage.mockImplementationOnce((m, s) => "otheraddress");

    await userController.create(request, response);

    expect(response.statusCode).toBe(400);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("userByAddress() --> should populate request.locals.user with a user", async () => {
    const request = new MockExpressRequest({
      locals: {},
    });
    const response = new MockExpressResponse();
    const next = jest.fn();

    mockingoose(User).toReturn(fakeUsers[0], "findOne");

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
    const request = new MockExpressRequest({
      locals: {},
    });
    const response = new MockExpressResponse();
    const next = jest.fn();

    mockingoose(User).toReturn(null, "findOne");

    await userController.userByAddress(
      request,
      response,
      next,
      fakeUsers[0].address
    );

    expect(response.statusCode).toBe(404);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("read() --> should read user in request.locals.user", async () => {
    const request = new MockExpressRequest({
      locals: { user: fakeUsers[0] },
    });
    const response = new MockExpressResponse();

    await userController.read(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(fakeUsers[0]);
  });

  it("update() --> should update user with request.body", async () => {
    const mock = jest.fn();
    const request = new MockExpressRequest({
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
    });
    const response = new MockExpressResponse();

    await userController.update(request, response);

    const updated = Object.assign(request.locals.user, {
      address: "addressupdated",
    });

    expect(mock).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        ...fakeUsers[0],
        address: "addressupdated",
      })
    );
  });

  it("remove() --> should call remove and return remove result", async () => {
    const mock = jest.fn(() => "mock.remove.result");
    const request = new MockExpressRequest({
      locals: {
        user: {
          remove: mock,
        },
      },
    });
    const response = new MockExpressResponse();

    await userController.remove(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toBe("mock.remove.result");
  });
});
