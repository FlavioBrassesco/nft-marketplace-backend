/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ISalesServiceInterface extends utils.Interface {
  functions: {
    "BASE_CURRENCY()": FunctionFragment;
    "WETH()": FunctionFragment;
    "approvePayment(address,uint256,uint256)": FunctionFragment;
    "approvePaymentERC20(address,address,address,uint256,uint256,uint256)": FunctionFragment;
    "getPendingRevenue(address)": FunctionFragment;
    "retrievePendingRevenue()": FunctionFragment;
    "unlockPendingRevenue(address,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "BASE_CURRENCY"
      | "WETH"
      | "approvePayment"
      | "approvePaymentERC20"
      | "getPendingRevenue"
      | "retrievePendingRevenue"
      | "unlockPendingRevenue"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "BASE_CURRENCY",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "approvePayment",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "approvePaymentERC20",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPendingRevenue",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "retrievePendingRevenue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unlockPendingRevenue",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "BASE_CURRENCY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "approvePayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvePaymentERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPendingRevenue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievePendingRevenue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockPendingRevenue",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ISalesService extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISalesServiceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    BASE_CURRENCY(overrides?: CallOverrides): Promise<[string]>;

    WETH(overrides?: CallOverrides): Promise<[string]>;

    approvePayment(
      to_: PromiseOrValue<string>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    approvePaymentERC20(
      from_: PromiseOrValue<string>,
      to_: PromiseOrValue<string>,
      tokenAddress_: PromiseOrValue<string>,
      amountIn_: PromiseOrValue<BigNumberish>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPendingRevenue(
      user_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { revenue: BigNumber }>;

    retrievePendingRevenue(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unlockPendingRevenue(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      fee_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  BASE_CURRENCY(overrides?: CallOverrides): Promise<string>;

  WETH(overrides?: CallOverrides): Promise<string>;

  approvePayment(
    to_: PromiseOrValue<string>,
    price_: PromiseOrValue<BigNumberish>,
    feePercentage_: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  approvePaymentERC20(
    from_: PromiseOrValue<string>,
    to_: PromiseOrValue<string>,
    tokenAddress_: PromiseOrValue<string>,
    amountIn_: PromiseOrValue<BigNumberish>,
    price_: PromiseOrValue<BigNumberish>,
    feePercentage_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPendingRevenue(
    user_: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  retrievePendingRevenue(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unlockPendingRevenue(
    to_: PromiseOrValue<string>,
    amount_: PromiseOrValue<BigNumberish>,
    fee_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    BASE_CURRENCY(overrides?: CallOverrides): Promise<string>;

    WETH(overrides?: CallOverrides): Promise<string>;

    approvePayment(
      to_: PromiseOrValue<string>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approvePaymentERC20(
      from_: PromiseOrValue<string>,
      to_: PromiseOrValue<string>,
      tokenAddress_: PromiseOrValue<string>,
      amountIn_: PromiseOrValue<BigNumberish>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPendingRevenue(
      user_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    retrievePendingRevenue(overrides?: CallOverrides): Promise<void>;

    unlockPendingRevenue(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      fee_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    BASE_CURRENCY(overrides?: CallOverrides): Promise<BigNumber>;

    WETH(overrides?: CallOverrides): Promise<BigNumber>;

    approvePayment(
      to_: PromiseOrValue<string>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    approvePaymentERC20(
      from_: PromiseOrValue<string>,
      to_: PromiseOrValue<string>,
      tokenAddress_: PromiseOrValue<string>,
      amountIn_: PromiseOrValue<BigNumberish>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPendingRevenue(
      user_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    retrievePendingRevenue(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unlockPendingRevenue(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      fee_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BASE_CURRENCY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approvePayment(
      to_: PromiseOrValue<string>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    approvePaymentERC20(
      from_: PromiseOrValue<string>,
      to_: PromiseOrValue<string>,
      tokenAddress_: PromiseOrValue<string>,
      amountIn_: PromiseOrValue<BigNumberish>,
      price_: PromiseOrValue<BigNumberish>,
      feePercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPendingRevenue(
      user_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    retrievePendingRevenue(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unlockPendingRevenue(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      fee_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
