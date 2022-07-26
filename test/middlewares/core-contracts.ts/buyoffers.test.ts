import { Signer, providers } from "ethers";
import { Request, Response } from "express";
import { buyoffers } from "../../../server/middlewares/core-contracts";
import CoreContract from "../../../server/models/core-contract.model";
import { NFTBuyOffers } from "../../../server/typechain-types/contracts/NFTBuyOffers";
import { NFTBuyOffers__factory } from "../../../server/typechain-types/factories/contracts/NFTBuyOffers__factory";
import { MongooseFilter } from "../../types/MongooseFilter";

describe("NFTBuyOffers middleware", () => {
  const connect = (a: string, p: Signer | providers.Provider) =>
    ({ isContract: true } as unknown as NFTBuyOffers);
  jest.spyOn(NFTBuyOffers__factory, "connect").mockImplementation(connect);

  it("should call response.json with status 400", async () => {
    const request = {} as unknown as Request;

    const result = { status: "", data: "" };
    const response = {
      status(n) {
        result.status = n;
        return this;
      },
      json: (data) => (result.data = data),
    } as unknown as Response;

    const filter = ((filter) => {
      return Promise.resolve(null);
    }) as unknown as MongooseFilter;
    jest.spyOn(CoreContract, "findOne").mockImplementation(filter);

    await buyoffers(request, response, () => true);
    expect(result.status).toEqual(400);
    expect(result.data).toHaveProperty("error");
  });

  it("should populate request.locals.contracts with buyoffers property", async () => {
    const request = {
      locals: {
        web3Provider: { fakeProvider: true },
      },
    } as unknown as Request;

    const response = {
      status: (n) => n,
      json: (data) => data,
    } as unknown as Response;

    const filter = ((filter) => {
      return Promise.resolve({ address: "fakeaddress" });
    }) as unknown as MongooseFilter;
    jest.spyOn(CoreContract, "findOne").mockImplementation(filter);

    await buyoffers(request, response, () => true);
    expect(request.locals.contracts.buyoffers).toEqual({ isContract: true });
  });
});
