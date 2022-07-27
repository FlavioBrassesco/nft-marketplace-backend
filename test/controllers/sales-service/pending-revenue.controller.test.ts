import { ethers } from "ethers";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import pendingRevenueController from "../../../server/controllers/sales-service/pending-revenue.controller";

describe("PendingRevenue controller", () => {
  it("read() --> should return pending revenue for user", async () => {
    const request = new MockExpressRequest({
      locals: {
        contracts: {
          salesservice: {
            getPendingRevenue() {
              return ethers.BigNumber.from(10000);
            },
          },
        },
      },
      params: {
        userAddress: "fakeuseraddress",
      },
    });
    const response = new MockExpressResponse();

    await pendingRevenueController.read(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSON()).toEqual(
      expect.objectContaining({
        address: "fakeuseraddress",
        pendingRevenue: expect.objectContaining({ type: "BigNumber" }),
      })
    );
  });
});
