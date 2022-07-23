import config from "./config/config";
import app from "./express";
import mongoose from "mongoose";

// db connection
mongoose.connect(config.mongoUri);

app.listen(config.port, () => {
  console.info(`Server started on port ${config.port}`);
});
