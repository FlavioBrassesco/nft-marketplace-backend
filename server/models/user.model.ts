import mongoose from "mongoose";
import { ethers } from "ethers";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { username: { $type: "string" } },
    },
    trim: true,
    validate: {
      validator: (v:string) =>
        /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
      message: ({ value }) => `${value} is not a valid username`,
    },
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
  role: {
    type: String,
    enum: ["admin", "user"],
    required: [true, "Please specify user role"],
  },
  pendingRevenue: String,
});

UserSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

UserSchema.methods = {
  authenticate: function (message, signature) {
    return this.address === ethers.utils.verifyMessage(message, signature);
  },
};

export default mongoose.model("User", UserSchema);
