import CoreContract from "../../server/models/core-contract.model";
import coreContractController from "../../server/controllers/core-contract.controller";
import * as mockingoose from "mockingoose";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";

describe("CoreContract controller", () => {
  const fakeaddress = "0x5b56f09e7d6272fc014f8526a5290700c5bb302b";
  const contracts = [
    { key: "manager", address: fakeaddress },
    { key: "marketplace", address: fakeaddress },
  ];
  
  it("fetch() --> should return core contract data", async () => {
    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn(contracts, "find");
    await coreContractController.fetch(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: fakeaddress,
          id: expect.any(String),
          key: "manager",
        }),
        expect.objectContaining({
          address: fakeaddress,
          id: expect.any(String),
          key: "marketplace",
        }),
      ])
    );
  });

  it("create() --> should create core contract entry in db", async () => {
    const request = new MockExpressRequest({
      body: {
        key: "manager",
        address: fakeaddress,
      },
    });
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn(
      {
        key: "manager",
        address: fakeaddress,
      },
      "save"
    );
    await coreContractController.create(request, response);

    expect(response.statusCode).toBe(201);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        key: "manager",
        address: fakeaddress,
        id: expect.any(String),
      })
    );
  });

  it("contractByKey() --> should return status 404 and error if findOne returns null", async () => {
    const request = new MockExpressRequest({ locals: {} });
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn(null, "findOne");
    const next = jest.fn();
    await coreContractController.contractByKey(request, response, next, "key");

    expect(response.statusCode).toBe(404);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("contractByKey() --> should populate request.locals.contract with contract data", async () => {
    const request = new MockExpressRequest({ locals: {} });
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn(
      { key: "manager", address: fakeaddress },
      "findOne"
    );
    const next = jest.fn();
    await coreContractController.contractByKey(
      request,
      response,
      next,
      "manager"
    );

    expect(request.locals.contract).toEqual(
      expect.objectContaining({
        key: "manager",
        address: fakeaddress,
        id: expect.any(String),
      })
    );
    expect(next).toBeCalled();
  });

  it("read() --> should return request.locals.contract data", async () => {
    const request = new MockExpressRequest({
      locals: { contract: { key: "manager", address: fakeaddress } },
    });
    const response = new MockExpressResponse();

    await coreContractController.read(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual({
      key: "manager",
      address: fakeaddress,
    });
  });

  it("update() --> should return status 200 and updated contract data", async () => {
    const request = new MockExpressRequest({
      locals: {
        contract: { key: "manager", address: fakeaddress, save: jest.fn() },
      },
      body: { key: "auctions", address: "0xfakeaddress" },
    });
    const response = new MockExpressResponse();

    await coreContractController.update(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual({
      key: "auctions",
      address: "0xfakeaddress",
    });
    expect(request.locals.contract.save).toBeCalled();
  });

  it("remove() --> should return status 200 and removed contract data", async () => {
    const request = new MockExpressRequest({
      locals: { contract: { remove: jest.fn(() => "fake.remove.result") } },
    });
    const response = new MockExpressResponse();

    await coreContractController.remove(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toBe("fake.remove.result");
    expect(request.locals.contract.remove).toBeCalled();
  });
});
