import { ethers } from "ethers";

export const addressValidator = {
  validator: (v) => ethers.utils.isAddress(v),
  message: (props) => `${props.value} is not a valid address`,
}