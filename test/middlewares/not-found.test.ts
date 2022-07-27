import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import notFound from "../../server/middlewares/not-found";

describe("notFound middleware", () => {
  it("should call response with error message", () => {
    const response = new MockExpressResponse();

    notFound(new MockExpressRequest(), response);

    expect(response.statusCode).toBe(404);
    expect(response._getJSON()).toHaveProperty("error");
  });
});
