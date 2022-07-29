import db from "./models/db";
import express from "../server/express";

// !TODO e2e testing
describe("Express app", () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
});
