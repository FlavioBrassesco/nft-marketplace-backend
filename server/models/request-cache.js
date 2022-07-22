import mongoose from "mongoose";

const RequestCache = mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  transactionHash: {
    type: String,
  },
});

export default mongoose.model("RequestCache", RequestCache);
