import ethersProvider from "../../server/middlewares/ethers-provider";
import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";

describe("ethersProvider middleware", () => {
  it("should fill request.locals.web3Provider with Provider", () => {
    const request = new MockExpressRequest({ locals: {} });
    const next = jest.fn();

    ethersProvider(request, new MockExpressResponse(), next);

    expect(request.locals.web3Provider).toHaveProperty("sendTransaction");
    expect(next).toBeCalled();
  });
});
