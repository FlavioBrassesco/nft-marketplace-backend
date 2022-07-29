import app from "../server/express";
import mongoose from "mongoose";
import config from "../server/config/config";

jest.mock("../server/express", () => {
  return {
    listen: jest.fn(),
  };
});

jest.mock("mongoose", () => {
  return {
    connect: jest.fn(),
  };
});

describe("Server main file", () => {
  it("should call connect on mongoose with proper params", () => {
    require("../server/server");
    expect(mongoose.connect).toBeCalledWith(config.mongoUri);
  });

  it("should call listen on app with proper params", () => {
    require("../server/server");
    expect(app.listen).toBeCalledWith(config.port, expect.any(Function));
  });
});
