import mongoose from "mongoose";
import { addressValidator } from "../helpers/validators";

export interface IItem {
  tokenId: string;
  collectionAddress: string;
  tokenURI: string;
  owner: string;
}

const Item: mongoose.Schema<IItem> = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    collectionAddress: {
      type: String,
      required: true,
      index: true,
      validate: addressValidator,
    },
    tokenURI: { type: String },
    owner: { type: String, validate: addressValidator },
  },
  { strict: false }
);

Item.index({ tokenId: 1, collectionAddress: 1 }, { unique: true });

Item.set("toJSON", {
  transform(document, obj) {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

export default mongoose.model<IItem>("Item", Item);
