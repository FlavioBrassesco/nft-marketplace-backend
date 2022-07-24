import { Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next) => {
  console.error(err.message);
  res.status(500).send({ error: "something went wrong" });
};

export default errorHandler;
