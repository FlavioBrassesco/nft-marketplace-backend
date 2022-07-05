import mongoose from "mongoose";
import { ethers } from "ethers";

const AuthorizedMarketplaceSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    unique: true,
    required: [true, "An address is required"],
    trim: true,
    validate: {
      validator: (v) => ethers.utils.isAddress(v),
      message: (props) => `${props.value} is not a valid address`,
    },
  },
});

AuthorizedMarketplaceSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

export default mongoose.model(
  "AuthorizedMarketplace",
  AuthorizedMarketplaceSchema
);
