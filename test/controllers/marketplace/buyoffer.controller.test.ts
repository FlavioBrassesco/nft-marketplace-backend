import { ethers } from "ethers";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import buyofferController from "../../../server/controllers/marketplace/buyoffer.controller";
import { MockERC721__factory } from "../../../server/typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory";

jest.mock(
  "../../../server/typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory",
  () => {
    return {
      MockERC721__factory: {
        connect() {
          return collection;
        },
      },
    };
  }
);

const collection = {
  tokenByIndex(i) {
    return ethers.BigNumber.from(i);
  },
  totalSupply() {
    return ethers.BigNumber.from(3);
  },
};

const _getAllOffersCount = jest.fn();
const _getUserOffersCount = jest.fn();

const buyofferContract = {
  getAllOffersCount(c, t) {
    _getAllOffersCount();
    return ethers.BigNumber.from(3);
  },
  getUserOffersCount(c, t) {
    _getUserOffersCount();
    return ethers.BigNumber.from(3);
  },
  offerByIndex(c, t, i) {
    return this._offers[i];
  },
  offerOfUserByIndex(u, c, i) {
    return this._offers[i];
  },
  _offers: [
    {
      tokenId: ethers.BigNumber.from(0),
      user: "0xfakeuser",
      bid: ethers.BigNumber.from(10),
    },
    {
      tokenId: ethers.BigNumber.from(1),
      user: "0xfakeuser",
      bid: ethers.BigNumber.from(10),
    },
    {
      tokenId: ethers.BigNumber.from(2),
      user: "0xfakeuser",
      bid: ethers.BigNumber.from(10),
    },
  ],
};

describe("BuyOffer controller", () => {
  it("read() --> should return all buy offers for a given collection", async () => {
    const request = new MockExpressRequest({
      params: {
        collectionAddress: "0xfakeaddress",
      },
      locals: {
        contracts: {
          buyoffers: buyofferContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await buyofferController.read(request, response);

    expect(_getAllOffersCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON().tokens).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
    expect(response._getJSON()["0"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: expect.any(String),
          bid: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
    expect(response._getJSON()["1"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: expect.any(String),
          bid: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });

  it("read() --> should return all buy offers for a given user", async () => {
    const request = new MockExpressRequest({
      query: {
        user: "0xfakeuser",
      },
      params: {
        collectionAddress: "0xfakeaddress",
      },
      locals: {
        contracts: {
          buyoffers: buyofferContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await buyofferController.read(request, response);

    expect(_getUserOffersCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON().tokens).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
    expect(response._getJSON()["0"]).toEqual(
      expect.objectContaining({
        user: expect.any(String),
        bid: expect.objectContaining({ type: "BigNumber" }),
      })
    );
    expect(response._getJSON()["1"]).toEqual(
      expect.objectContaining({
        user: expect.any(String),
        bid: expect.objectContaining({ type: "BigNumber" }),
      })
    );
  });

  it("items() --> should return all buy offers for a given token", async () => {
    const request = new MockExpressRequest({
      params: {
        collectionAddress: "0xfakeaddress",
        tokenId: "0",
      },
      locals: {
        contracts: {
          buyoffers: buyofferContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await buyofferController.items(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: expect.any(String),
          bid: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });
});
