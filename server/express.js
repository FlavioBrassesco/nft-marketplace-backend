import express from "express";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

// express config
const app = express();
app.use(express.json());
app.use(compress());
app.use(helmet());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server up and running" });
});

export default app;
