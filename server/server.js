import config from "../config/config";
import app from "./express";
import mongoose from "mongoose";

//db connection
mongoose.connect(config.mongoUri);

app.listen(config.port, (err) => {
  if (err) console.log(err);
  console.info(`Server started on port ${config.port}`);
});
