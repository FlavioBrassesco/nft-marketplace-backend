import { salesservice } from "../../../server/middlewares/core-contracts";
import CoreContract from "../../../server/models/core-contract.model";
import { SalesService__factory } from "../../../server/typechain-types/factories/contracts/services/SalesService__factory";
import * as mockingoose from "mockingoose";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";

jest.mock(
  "../../../server/typechain-types/factories/contracts/services/SalesService__factory",
  () => {
    return {
      SalesService__factory: {
        connect: jest.fn(() => ({
          isContract: true,
        })),
      },
    };
  }
);

describe("SalesService middleware", () => {
  it("should call response.json with status 400", async () => {
    const request = new MockExpressRequest();
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn(null, "findOne");

    await salesservice(request, response, () => true);

    expect(response.statusCode).toEqual(400);
    expect(response._getJSON()).toHaveProperty("error");
  });

  it("should populate request.locals.contracts with salesservice property", async () => {
    const request = new MockExpressRequest({
      locals: {
        web3Provider: { fakeProvider: true },
      },
    });
    const response = new MockExpressResponse();

    mockingoose(CoreContract).toReturn({ address: "fakeaddress" }, "findOne");

    await salesservice(request, response, () => true);
    expect(request.locals.contracts.salesservice).toEqual({ isContract: true });
  });
});
