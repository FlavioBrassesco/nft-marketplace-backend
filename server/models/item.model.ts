import mongoose from "mongoose";

export interface IItem {
  tokenId: string;
  collectionAddress: string;
  tokenURI: string;
  owner: string;
}

const Item: mongoose.Schema<IItem> = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    collectionAddress: { type: String, required: true, index: true },
    tokenURI: { type: String },
    owner: { type: String },
  },
  { strict: false }
);

Item.index({ tokenId: 1, collectionAddress: 1 }, { unique: true });

export default mongoose.model<IItem>("Item", Item);
