import { Request, Response } from "express";
import errorHandler from "../../server/middlewares/error-handler";

describe("errorHandler middleware", () => {
  it("should call response with error message", () => {
    let result = { status: "", data: "" };
    const response = {
      status(n) {
        result.status = n;
        return this;
      },
      json(d) {
        result.data = d;
        return this;
      },
    } as unknown as Response;

    errorHandler(
      new Error("fake error message"),
      {} as unknown as Request,
      response,
      () => null
    );

    expect(result.status).toBe(500);
    expect(result.data).toHaveProperty("error");
  });
});
