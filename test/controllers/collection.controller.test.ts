import { ethers, BigNumber, BigNumberish } from "ethers";
import { MockERC721__factory } from "../../server/typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import collectionController from "../../server/controllers/collection.controller";

jest.mock(
  "../../server/typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory",
  () => {
    return {
      MockERC721__factory: {
        connect: jest.fn(),
      },
    };
  }
);

describe("Collection controller", () => {
  const mockItems = {
    "0xfakeaddress": {
      "0": {
        _tokenURI: "faketokenuri0",
        _ownerOf: "0xfakeownerof0",
      },
      "1": {
        _tokenURI: "faketokenuri1",
        _ownerOf: "0xfakeownerof1",
      },
    },
    "0xfakeaddress2": {
      "0": {
        _tokenURI: "faketokenuri0",
        _ownerOf: "0xfakeownerof0",
      },
      "1": {
        _tokenURI: "faketokenuri1",
        _ownerOf: "0xfakeownerof1",
      },
    },
  };
  const mockCollections = {
    "0xfakeaddress": {
      address: "0xfakeaddress",
      _name: "fakename",
      name() {
        return this._name;
      },
      _symbol: "fakesymbol",
      symbol() {
        return this._symbol;
      },
      _contractURI: "fakeURI",
      contractURI() {
        return this._contractURI;
      },
      tokenURI(n) {
        return mockItems["0xfakeaddress"][n.toString()]._tokenURI;
      },
      ownerOf(n) {
        return mockItems["0xfakeaddress"][n.toString()]._ownerOf;
      },
      tokenByIndex(i) {
        return ethers.BigNumber.from(i);
      },
      totalSupply() {
        return ethers.BigNumber.from(2);
      },
      balanceOf(a) {
        return ethers.BigNumber.from(2);
      },
      tokenOfOwnerByIndex(a, i) {
        return ethers.BigNumber.from(i);
      },
      _fee: ethers.BigNumber.from(10),
      _floorPrice: ethers.BigNumber.from(10),
      _isWhitelisted: true,
    },
    "0xfakeaddress2": {
      address: "0xfakeaddress2",
      _name: "fakename2",
      name() {
        return this._name;
      },
      _symbol: "fakesymbol2",
      symbol() {
        return this._symbol;
      },
      _contractURI: "fakeURI2",
      contractURI() {
        return this._contractURI;
      },
      tokenURI(n) {
        return mockItems["0xfakeaddress2"][n.toString()]._tokenURI;
      },
      ownerOf(n) {
        return mockItems["0xfakeaddress2"][n.toString()]._ownerOf;
      },
      tokenByIndex(i) {
        return ethers.BigNumber.from(i);
      },
      totalSupply() {
        return ethers.BigNumber.from(2);
      },
      balanceOf(a) {
        return ethers.BigNumber.from(2);
      },
      tokenOfOwnerByIndex(a, i) {
        return ethers.BigNumber.from(i);
      },
      _fee: ethers.BigNumber.from(10),
      _floorPrice: ethers.BigNumber.from(10),
      _isWhitelisted: true,
    },
  };

  const mockManager = {
    getFee(address) {
      return mockCollections[address]._fee;
    },
    getFloorPrice(address) {
      return mockCollections[address]._floorPrice;
    },
    isWhitelistedCollection(address) {
      return mockCollections[address]._isWhitelisted;
    },
    getCollectionsCount() {
      return ethers.BigNumber.from(2);
    },
    collectionByIndex(i) {
      return ["0xfakeaddress", "0xfakeaddress2"][i];
    },
  };

  it("list() --> should return array with CollectionData entries", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          manager: mockManager,
        },
      },
    });

    MockERC721__factory.connect
      // @ts-expect-error
      .mockReturnValueOnce(mockCollections["0xfakeaddress"])
      .mockReturnValueOnce(mockCollections["0xfakeaddress2"]);

    const response = new MockExpressResponse();

    await collectionController.list(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          contractURI: expect.any(String),
          name: expect.any(String),
          symbol: expect.any(String),
          fee: expect.objectContaining({ type: "BigNumber" }),
          floorPrice: expect.objectContaining({ type: "BigNumber" }),
          isWhitelisted: expect.any(Boolean),
        }),
      ])
    );
    expect(response._getJSON()[0].address).toBe("0xfakeaddress");
    expect(response._getJSON()[1].address).toBe("0xfakeaddress2");
  });

  it("read() --> should return CollectionData", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          manager: mockManager,
          collection: mockCollections["0xfakeaddress"],
        },
      },
    });
    const response = new MockExpressResponse();

    await collectionController.read(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        contractURI: expect.any(String),
        name: expect.any(String),
        symbol: expect.any(String),
        fee: expect.objectContaining({ type: "BigNumber" }),
        floorPrice: expect.objectContaining({ type: "BigNumber" }),
        isWhitelisted: expect.any(Boolean),
      })
    );
    expect(response._getJSON().address).toBe("0xfakeaddress");
  });

  it("items() --> should return array of ItemData", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          collection: mockCollections["0xfakeaddress"],
        },
      },
    });
    const response = new MockExpressResponse();

    await collectionController.items(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tokenId: expect.objectContaining({ type: "BigNumber" }),
          tokenURI: expect.any(String),
          collectionAddress: expect.any(String),
          owner: expect.any(String),
        }),
      ])
    );
  });

  // improve this one since we cannot tell if branch was called successfully without looking at coverage
  it("items() --> should return array of ItemData branch query:user", async () => {
    const request = new MockExpressRequest({
      query: {
        user: "0xfakeuseraddress",
      },
      locals: {
        contracts: {
          collection: mockCollections["0xfakeaddress"],
        },
      },
    });
    const response = new MockExpressResponse();

    await collectionController.items(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tokenId: expect.objectContaining({ type: "BigNumber" }),
          tokenURI: expect.any(String),
          collectionAddress: expect.any(String),
          owner: expect.any(String),
        }),
      ])
    );
  });

  it("item() --> should return ItemData", async () => {
    const request = new MockExpressRequest({
      query: {
        tokenId: "0",
      },
      locals: {
        contracts: {
          collection: mockCollections["0xfakeaddress"],
        },
      },
    });
    const response = new MockExpressResponse();

    await collectionController.item(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        tokenId: expect.objectContaining({ type: "BigNumber" }),
        tokenURI: expect.any(String),
        collectionAddress: expect.any(String),
        owner: expect.any(String),
      })
    );
    expect(response._getJSON().collectionAddress).toBe("0xfakeaddress");
    expect(response._getJSON().tokenURI).toBe("faketokenuri0");
  });

  it("collectionByAddress() --> should populate request.locals.contracts.collection", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {},
      },
    });
    const response = new MockExpressResponse();
    const next = jest.fn();

    MockERC721__factory.connect
      // @ts-expect-error
      .mockReturnValueOnce(mockCollections["0xfakeaddress"]);

    await collectionController.collectionByAddress(
      request,
      response,
      next,
      "fakeaddress"
    );
    expect(request.locals.contracts.collection).toEqual(
      mockCollections["0xfakeaddress"]
    );
    expect(next).toBeCalled();
  });
});
