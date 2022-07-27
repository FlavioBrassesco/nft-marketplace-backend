import { Request } from "express";
import MockExpressRequest from "mock-express-request";
import makeResponse from "../test-helpers/make-response";
import authController from "../../server/controllers/auth.controller";
import User from "../../server/models/user.model";
import jwt from "jsonwebtoken";
import * as mockingoose from "mockingoose";
import { ethers } from "ethers";

jest.mock("ethers", () => {
  return {
    ethers: {
      utils: {
        verifyMessage: jest.fn(),
      },
    },
  };
});

describe("Auth controller", () => {
  it("signin() --> should respond with status 401 user not found", async () => {
    const request = {
      body: {
        address: "0xfakeaddress",
      },
    } as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    mockingoose(User).toReturn(null, "findOne");
    await authController.signin(request, response);

    expect(result[0]).toBe(401);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("signin() --> should respond with status 401 signature and address don't match", async () => {
    const request = {
      body: {
        address: "0xfakeaddress",
      },
    } as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    const fakeUser = {
      address: request.body.address,
    };
    mockingoose(User).toReturn(fakeUser, "findOne");

    // @ts-expect-error
    ethers.utils.verifyMessage.mockReturnValue("");

    await authController.signin(request, response);

    expect(result[0]).toBe(401);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("signin() --> should set cookie and respond with status 200", async () => {
    const request = {
      body: {
        address: "0xfakeaddress",
      },
    } as Request;

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    const cookie: any = {};
    // @ts-expect-error
    response.cookie = jest.fn((n, v, o) => {
      cookie.name = n;
      cookie.value = v;
      cookie.expires = o.expires;
    });

    const fakeUser = {
      address: request.body.address,
    };
    mockingoose(User).toReturn(fakeUser, "findOne");

    // @ts-expect-error
    ethers.utils.verifyMessage.mockReturnValue(request.body.address);

    await authController.signin(request, response);

    expect(cookie.name).toBe("t");
    expect(typeof cookie.value).toBe("string");
    expect(cookie.expires instanceof Date).toBe(true);

    expect(result[0]).toBe(200);
    expect(result[1]).toEqual(
      expect.objectContaining({
        token: cookie.value,
        user: expect.objectContaining({
          address: request.body.address,
          id: expect.any(String),
        }),
      })
    );
  });

  it("signout() --> should call clearCookie and return 200 with message", async () => {
    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    const cookie: any = {
      ["t"]: true,
    };

    // @ts-expect-error
    response.clearCookie = jest.fn((name) => {
      delete cookie[name];
    });

    await authController.signout({} as Request, response);

    expect(typeof cookie["t"]).toBe("undefined");
    expect(result[0]).toBe(200);
    expect(result[1]).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it("requireSignin() --> should call expressjwt and populate request.auth", async () => {
    const token = jwt.sign({ address: "0xfakeaddress" }, "test");

    const request = new MockExpressRequest({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mock = jest.fn();
    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    await authController.requireSignin(request as Request, response, mock);
    expect(request.auth.address).toBe("0xfakeaddress");
    expect(mock).toBeCalled();
  });

  it("hasAuthorization() --> should respond with 403 and error", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "user",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
      locals: {
        user: {
          address: "0xotherfakeaddress",
          role: "user",
        },
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    mockingoose(User).toReturn(user, "findOne");

    await authController.hasAuthorization(request as Request, response, mock);

    expect(result[0]).toBe(403);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("hasAuthorization() --> should call next if user admin", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "admin",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    mockingoose(User).toReturn(user, "findOne");

    await authController.hasAuthorization(request as Request, response, mock);

    expect(mock).toBeCalled();
  });

  it("hasAuthorization() --> should call next if authorized", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "user",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
      locals: {
        user: {
          ...user,
        },
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));
    mockingoose(User).toReturn(user, "findOne");

    await authController.hasAuthorization(request as Request, response, mock);

    expect(mock).toBeCalled();
  });

  it("requireAdmin() --> should return status 403 and error with user not found", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "admin",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    mockingoose(User).toReturn(null, "findOne");
    await authController.requireAdmin(request as Request, response, mock);
    expect(result[0]).toBe(403);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("requireAdmin() --> should return status 403 and error with user.role = user", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "user",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    mockingoose(User).toReturn(user, "findOne");
    await authController.requireAdmin(request as Request, response, mock);
    expect(result[0]).toBe(403);
    expect(result[1]).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("requireAdmin() --> should call next if user admin", async () => {
    const user = {
      address: "0xfakeaddress",
      role: "admin",
    };
    const request = new MockExpressRequest({
      auth: {
        ...user,
      },
    });

    const mock = jest.fn();

    const result: any[] = [];
    const response = makeResponse((d) => result.push(d));

    mockingoose(User).toReturn(user, "findOne");
    await authController.requireAdmin(request as Request, response, mock);
    expect(mock).toBeCalled();
  });
});
