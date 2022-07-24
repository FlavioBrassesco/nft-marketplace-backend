import mongoose from "mongoose";
import { ethers } from "ethers";

export interface ICoreContract {
  key: string;
  address:string;
}

const CoreContractSchema:mongoose.Schema<ICoreContract> = new mongoose.Schema({
  key: {
    type: String,
    enum: [
      "manager",
      "marketplace",
      "auctions",
      "buyoffers",
      "salesservice",
      "unirouter",
      "unifactory",
    ],
    unique: true,
    required: [true, "A Key is required"],
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

CoreContractSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

export default mongoose.model("CoreContract", CoreContractSchema);
