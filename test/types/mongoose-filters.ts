import { FilterQuery, Query, Callback } from "mongoose";
import {
  ICoreContract,
} from "../../server/models/core-contract.model";

export type MongooseFindOneFilter = (
  filter?: FilterQuery<ICoreContract> | undefined,
  callback?: Callback<unknown> | undefined
) => Query<unknown, unknown>;

export type MongooseFindFilter = (callback?:Callback<unknown[]>| undefined) => Query<unknown[],unknown>;