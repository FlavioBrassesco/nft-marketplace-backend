import mongoose from "mongoose";

export interface IRequestCache {
  originalUrl: string;
  body: string;
  blockNumber: number;
  transactionHash: string;
}

const RequestCache: mongoose.Schema<IRequestCache> = new mongoose.Schema({
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
