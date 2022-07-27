import MockExpressRequest from "mock-express-request";
import MockExpressResponse from "mock-express-response";
import errorHandler from "../../server/middlewares/error-handler";

describe("errorHandler middleware", () => {
  it("should call response with error message", () => {
    const response = new MockExpressResponse();

    errorHandler(
      new Error("fake error message"),
      new MockExpressRequest(),
      response,
      jest.fn()
    );

    expect(response.statusCode).toBe(500);
    expect(response._getJSON()).toHaveProperty("error");
  });
});
