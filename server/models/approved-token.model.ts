import mongoose from "mongoose";
import { ethers } from "ethers";

const ApprovedTokenSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  symbol: {
    type: String,
  },
  decimals: {
    type: String,
  },
  address: {
    type: String,
    unique: true,
    required: [true, "An address is required"],
    trim: true,
    validate: {
      validator: (v:string) => ethers.utils.isAddress(v),
      message: (props) => `${props.value} is not a valid address`,
    },
  },
});

ApprovedTokenSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

export default mongoose.model("ApprovedToken", ApprovedTokenSchema);
