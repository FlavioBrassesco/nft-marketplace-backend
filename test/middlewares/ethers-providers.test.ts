import { Request, Response } from "express";
import ethersProvider from "../../server/middlewares/ethers-provider";

describe("ethersProvider middleware", () => {
  it("should fill request.locals.web3Provider with Provider", () => {
    const request = { locals: {} } as unknown as Request;
    const fn = jest.fn();

    ethersProvider(request, {} as unknown as Response, fn);

    expect(request.locals.web3Provider).toHaveProperty("sendTransaction");
    expect(fn).toBeCalled();
  });
});
