import { FilterQuery, Query, Callback } from "mongoose";
import {
  ICoreContract,
} from "../../server/models/core-contract.model";

export type MongooseFilter = (
  filter?: FilterQuery<ICoreContract> | undefined,
  callback?: Callback<unknown> | undefined
) => Query<unknown, unknown>;