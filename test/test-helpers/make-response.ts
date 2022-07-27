import { Response } from "express";
export default function makeResponse(fn) {
  class FakeResponse {
    status(n) {
      fn(n);
      return this;
    }
    json(d) {
      fn(d);
      return this;
    }
  }
  return new FakeResponse() as Response;
}
