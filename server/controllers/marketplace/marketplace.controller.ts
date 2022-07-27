/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { BigNumber, ethers } from "ethers";
import { NFTMarketplace } from "../../typechain-types/contracts/NFTMarketplace";
import { NFTCollectionManager } from "../../typechain-types/contracts/NFTCollectionManager";

export type MarketItemData = {
  seller: string;
  price: BigNumber;
  collectionAddress: string;
  tokenId: BigNumber;
};

const getItems = async (
  collectionAddress: string,
  marketplace: NFTMarketplace
): Promise<MarketItemData[]> => {
  const count = (
    await marketplace.getAllItemsCount(collectionAddress)
  ).toNumber();

  console.log("COUNT----", count);
  console.log("marketplace----", marketplace);

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      console.log(
        "itemByIndex----",
        marketplace.itemByIndex(collectionAddress, i)
      );
      const {
        seller,
        price,
        collectionAddress: ca,
        tokenId,
      } = await marketplace.itemByIndex(collectionAddress, i);

      return {
        seller,
        price,
        collectionAddress: ca,
        tokenId,
      };
    })
  );

  return output;
};

const getUserItems = async (
  userAddress: string,
  collectionAddress: string,
  marketplace: NFTMarketplace
): Promise<MarketItemData[]> => {
  const count = (
    await marketplace.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const {
        seller,
        price,
        collectionAddress: ca,
        tokenId,
      } = await marketplace.itemOfUserByIndex(
        userAddress,
        collectionAddress,
        i
      );

      return {
        seller,
        price,
        collectionAddress: ca,
        tokenId,
      };
    })
  );

  return output;
};

const list = async (req: Request, res: Response) => {
  const marketplace = <NFTMarketplace>req.locals.contracts.marketplace;
  const manager = <NFTCollectionManager>req.locals.contracts.manager;
  const count = (await manager.getCollectionsCount()).toNumber();

  let collections: string[] = [];
  let itemsByCollection = {};
  await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const collectionAddress = await manager.collectionByIndex(i);
      const items: MarketItemData[] = req.query.user
        ? await getUserItems(
            <string>req.query.user,
            collectionAddress,
            marketplace
          )
        : await getItems(collectionAddress, marketplace);

      collections.push(collectionAddress);
      itemsByCollection = { ...itemsByCollection, [collectionAddress]: items };
    })
  );

  res.status(200).json({ collections, ...itemsByCollection });
};

const items = async (req: Request, res: Response) => {
  const marketplace = <NFTMarketplace>req.locals.contracts.marketplace;
  const items: MarketItemData[] = req.query.user
    ? await getUserItems(
        <string>req.query.user,
        req.params.collectionAddress,
        marketplace
      )
    : await getItems(req.params.collectionAddress, marketplace);

  return res.status(200).json(items);
};

const item = async (req: Request, res: Response) => {
  const marketplace = <NFTMarketplace>req.locals.contracts.marketplace;
  const { seller, price } = await marketplace.items(
    req.params.collectionAddress,
    req.params.tokenId
  );

  const output: MarketItemData = {
    seller,
    price,
    collectionAddress: req.params.collectionAddress,
    tokenId: ethers.BigNumber.from(req.params.tokenId),
  };
  res.status(200).json(output);
};

export default { list, items, item };
