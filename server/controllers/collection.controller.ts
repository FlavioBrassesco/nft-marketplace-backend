/// <reference path="../../types/index.d.ts" />
import { Contract, BigNumber } from "ethers";
import { Request, Response } from "express";
import { NFTCollectionManager } from "../typechain-types/contracts/NFTCollectionManager";
import { MockERC721__factory } from "../typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory";

export type CollectionData = {
  address: string;
  name: string;
  symbol: string;
  contractURI: string;
  fee: BigNumber;
  floorPrice: BigNumber;
  isWhitelisted: boolean;
  totalSupply?: BigNumber;
};

export type ItemData = {
  tokenId: string;
  tokenURI: string;
  collectionAddress: string;
  owner: string;
};

const getCollectionData = async (
  manager: Contract,
  collection: Contract
): Promise<CollectionData> => {
  const output: CollectionData = {
    address: collection.address,
    name: await collection.name(),
    symbol: await collection.symbol(),
    contractURI: await collection.contractURI(),
    fee: await manager.getFee(collection.address),
    floorPrice: await manager.getFloorPrice(collection.address),
    isWhitelisted: await manager.isWhitelistedCollection(collection.address),
  };

  // catch erc721 non-enumerable
  try {
    output.totalSupply = await collection.totalSupply();
  } catch {}

  return output;
};

const list = async (req: Request, res: Response) => {
  const manager = <NFTCollectionManager>req.locals.contracts.manager;
  const count = (await manager.getCollectionsCount()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const address = await manager.collectionByIndex(i);
      const collection = MockERC721__factory.connect(
        address,
        req.locals.web3Provider
      );
      return await getCollectionData(req.locals.contracts.manager, collection);
    })
  );

  res.status(200).json(output);
};

const read = async (req: Request, res: Response) => {
  const output = await getCollectionData(
    req.locals.contracts.manager,
    req.locals.contracts.collection
  );
  res.status(200).json(output);
};

const collectionByAddress = async (
  req: Request,
  res: Response,
  next,
  address
) => {
  req.locals.contracts = {
    ...req.locals.contracts,
    collection: MockERC721__factory.connect(address, req.locals.web3Provider),
  };
  next();
};

const getItemData = async (
  collection: Contract,
  tokenId: string
): Promise<ItemData> => {
  return {
    tokenId: tokenId,
    tokenURI: await collection.tokenURI(tokenId),
    collectionAddress: collection.address,
    owner: await collection.ownerOf(tokenId),
  };
};

const getItemsOfUser = async (
  collection: Contract,
  userAddress: string
): Promise<ItemData[]> => {
  const count = (await collection.balanceOf(userAddress)).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const token = await collection.tokenOfOwnerByIndex(userAddress, i);
      return await getItemData(collection, token);
    })
  );

  return output;
};

const getItems = async (collection: Contract): Promise<ItemData[]> => {
  const count = (await collection.totalSupply()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const token = await collection.tokenByIndex(i);
      return await getItemData(collection, token);
    })
  );

  return output;
};

const items = async (req: Request, res: Response) => {
  const output = req.query.user
    ? await getItemsOfUser(
        req.locals.contracts.collection,
        <string>req.query.user
      )
    : await getItems(req.locals.contracts.collection);
  return res.status(200).json(output);
};

const item = async (req: Request, res: Response) => {
  const output = await getItemData(
    req.locals.contracts.collection,
    <string>req.query.tokenId
  );
  res.status(200).json(output);
};

export default { list, read, items, item, collectionByAddress };
