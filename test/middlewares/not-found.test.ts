import { Request, Response } from "express";
import notFound from "../../server/middlewares/not-found";

describe("notFound middleware", () => {
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

    notFound({} as unknown as Request, response);

    expect(result.status).toBe(404);
    expect(result.data).toHaveProperty("error");
  });
});
