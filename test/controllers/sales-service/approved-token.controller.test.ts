import { ethers } from "ethers";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import approvedTokenController from "../../../server/controllers/sales-service/approved-token.controller";
import { ERC20__factory } from "../../../server/typechain-types/factories/@openzeppelin/contracts/token/ERC20/ERC20__factory";

const tokenContract = {
  name() {
    return "token.name";
  },
  symbol() {
    return "token.symbol";
  },
  decimals() {
    return ethers.BigNumber.from(18);
  },
  totalSupply() {
    return ethers.BigNumber.from(1000);
  },
};

jest.mock(
  "../../../server/typechain-types/factories/@openzeppelin/contracts/token/ERC20/ERC20__factory",
  () => {
    return {
      ERC20__factory: {
        connect() {
          return tokenContract;
        },
      },
    };
  }
);

describe("ApprovedToken controller", () => {
  it("list() --> should return an array of approved tokens", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          salesservice: {
            getApprovedTokens() {
              return ["fakeaddress", "fakeaddress2", "fakeaddress3"];
            },
          },
        },
        web3Provider: {},
      },
    });
    const response = new MockExpressResponse();

    await approvedTokenController.list(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          name: expect.any(String),
          symbol: expect.any(String),
          decimals: expect.objectContaining({ type: "BigNumber" }),
          totalSupply: expect.objectContaining({ type: "BigNumber" }),
        }),
      ])
    );
  });
});
