import { ethers } from "ethers";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import auctionController from "../../../server/controllers/marketplace/auction.controller";

const managerContract = {
  getCollectionsCount() {
    return ethers.BigNumber.from(2);
  },
  collectionByIndex(i) {
    const n = i.toNumber ? i.toNumber() : parseInt(i);
    return this._collections[n];
  },
  _collections: ["0xfakecollection", "0xfakecollection2"],
};

const auctionContract = {
  items: jest.fn(() => ({
    seller: "0xfakeseller",
    currentBidder: "0xfakebidder",
    currentBid: ethers.BigNumber.from(11),
    endsAt: ethers.BigNumber.from(0),
  })),
  getAllItemsCount: jest
    .fn()
    .mockImplementation((a) => ethers.BigNumber.from(2)),
  getUserItemsCount: jest
    .fn()
    .mockImplementation((a) => ethers.BigNumber.from(2)),
  itemByIndex: function (a, i) {
    return this._items[i];
  },
  itemOfUserByIndex(a, a2, i) {
    return this._items[i];
  },
  _items: [
    {
      seller: "0xfakeseller",
      currentBidder: "0xfakebidder",
      currentBid: ethers.BigNumber.from(11),
      collectionAddress: "0xfakecollection",
      tokenId: ethers.BigNumber.from(0),
      endsAt: ethers.BigNumber.from(0),
    },
    {
      seller: "0xfakeseller",
      currentBidder: "0xfakebidder",
      currentBid: ethers.BigNumber.from(11),
      collectionAddress: "0xfakecollection",
      tokenId: ethers.BigNumber.from(1),
      endsAt: ethers.BigNumber.from(0),
    },
  ],
};

describe("Auction controller", () => {
  it("list() --> should return an object with a collections array and collection keys with items array", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          manager: managerContract,
          auctions: auctionContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await auctionController.list(request, response);

    expect(auctionContract.getAllItemsCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    console.log(response._getJSON());
    expect(response._getJSON().collections).toEqual(
      managerContract._collections
    );
    expect(response._getJSON()[managerContract._collections[0]]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: expect.any(String),
          tokenId: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
    expect(response._getJSON()[managerContract._collections[1]]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: expect.any(String),
          tokenId: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });

  it("list() --> (with req.query.user) should return an object with a collections array and collection keys with items array", async () => {
    const request = new MockExpressRequest({
      query: {
        user: "0xfakeuser",
      },
      locals: {
        contracts: {
          manager: managerContract,
          auctions: auctionContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await auctionController.list(request, response);

    expect(auctionContract.getUserItemsCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    console.log(response._getJSON());
    expect(response._getJSON().collections).toEqual(
      managerContract._collections
    );
    expect(response._getJSON()[managerContract._collections[0]]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: expect.any(String),
          tokenId: expect.objectContaining({ type: "BigNumber" }),
          endsAt: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
    expect(response._getJSON()[managerContract._collections[1]]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: expect.any(String),
          tokenId: expect.objectContaining({ type: "BigNumber" }),
          endsAt: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });

  it("item() --> should return a market item", async () => {
    const request = new MockExpressRequest({
      params: {
        collectionAddress: "0xfakecollection",
        tokenId: "0",
      },
      locals: {
        contracts: {
          manager: managerContract,
          auctions: auctionContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await auctionController.item(request, response);

    expect(auctionContract.items).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual({
      ...auctionContract.items(),
      currentBid: expect.objectContaining({ type: "BigNumber" }),
      endsAt: expect.objectContaining({ type: "BigNumber" }),
      collectionAddress: "0xfakecollection",
      tokenId: expect.objectContaining({ type: "BigNumber" }),
    });
  });

  it("items() --> should return all items for a collection", async () => {
    const request = new MockExpressRequest({
      params: {
        collectionAddress: "0xfakecollection",
      },
      locals: {
        contracts: {
          auctions: auctionContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await auctionController.items(request, response);

    expect(auctionContract.getAllItemsCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          endsAt: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: "0xfakecollection",
          tokenId: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });

  it("items() --> (with req.query.user) should return all items for a user", async () => {
    const request = new MockExpressRequest({
      query: {
        user: "0xfakeuser"
      },
      params: {
        collectionAddress: "0xfakecollection",
      },
      locals: {
        contracts: {
          auctions: auctionContract,
        },
      },
    });
    const response = new MockExpressResponse();

    await auctionController.items(request, response);

    expect(auctionContract.getUserItemsCount).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          seller: expect.any(String),
          currentBidder: expect.any(String),
          currentBid: expect.objectContaining({ type: "BigNumber" }),
          endsAt: expect.objectContaining({ type: "BigNumber" }),
          collectionAddress: "0xfakecollection",
          tokenId: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });
  
});
