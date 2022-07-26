import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: "unknown endpoint" });
};
export default notFound;
