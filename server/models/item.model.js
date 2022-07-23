import mongoose from "mongoose";

const Item = mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    collectionAddress: { type: String, required: true, index: true },
    tokenURI: { type: String },
    owner: { type: String },
  },
  { strict: false }
);

Item.index({ tokenId: 1, collectionAddress: 1 }, { unique: true });
export default mongoose.model("Item", Item);
