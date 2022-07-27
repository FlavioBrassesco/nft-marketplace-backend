import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import authorizedMarketplaceController from "../../../server/controllers/sales-service/authorized-marketplace.controller";
import { NFTMarketplace__factory } from "../../../server/typechain-types/factories/contracts/NFTMarketplace__factory";

const marketplaceContract = {
  name() {
    return "fakename";
  },
};

jest.mock(
  "../../../server/typechain-types/factories/contracts/NFTMarketplace__factory",
  () => {
    return {
      NFTMarketplace__factory: {
        connect() {
          return marketplaceContract;
        },
      },
    };
  }
);

describe("AuthorizedMarketplace controller", () => {
  it("list() --> should return an array of authorized marketplaces", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          salesservice: {
            getAuthorizedMarketplaces() {
              return ["fakeaddress", "fakeaddress2"];
            },
          },
        },
        web3Provider: {},
      },
    });
    const response = new MockExpressResponse();

    await authorizedMarketplaceController.list(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          name: expect.any(String),
        }),
      ])
    );
  });
});
