/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { ethers, BigNumber } from "ethers";
import { NFTAuctions } from "../../typechain-types/contracts/NFTAuctions";
import { NFTCollectionManager } from "../../typechain-types/contracts/NFTCollectionManager";

export type AuctionItemData = {
  seller: string;
  currentBidder: string;
  currentBid: BigNumber;
  endsAt: BigNumber;
  collectionAddress: string;
  tokenId: BigNumber;
};

const getItems = async (
  collectionAddress: string,
  auctions: NFTAuctions
): Promise<AuctionItemData[]> => {
  const count = (await auctions.getAllItemsCount(collectionAddress)).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const {
        seller,
        currentBidder,
        currentBid,
        endsAt,
        collectionAddress: ca,
        tokenId,
      } = await auctions.itemByIndex(collectionAddress, i);

      return {
        seller,
        currentBidder,
        currentBid,
        endsAt,
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
  auctions: NFTAuctions
): Promise<AuctionItemData[]> => {
  const count = (
    await auctions.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const {
        seller,
        currentBidder,
        currentBid,
        endsAt,
        collectionAddress: ca,
        tokenId,
      } = await auctions.itemOfUserByIndex(userAddress, collectionAddress, i);

      return {
        seller,
        currentBidder,
        currentBid,
        endsAt,
        collectionAddress: ca,
        tokenId,
      };
    })
  );

  return output;
};

const list = async (req: Request, res: Response) => {
  const manager = <NFTCollectionManager>req.locals.contracts.manager;
  const auctions = <NFTAuctions>req.locals.contracts.auctions;
  const count = (await manager.getCollectionsCount()).toNumber();

  const collections: string[] = [];
  let itemsByCollection: any = {};
  await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const collectionAddress = await manager.collectionByIndex(i);

      const items = req.query.user
        ? await getUserItems(
            <string>req.query.user,
            collectionAddress,
            auctions
          )
        : await getItems(collectionAddress, auctions);

      collections.push(collectionAddress);
      itemsByCollection = { ...itemsByCollection, [collectionAddress]: items };
    })
  );

  res.status(200).json({ collections, ...itemsByCollection });
};

const items = async (req: Request, res: Response) => {
  const auctions = <NFTAuctions>req.locals.contracts.auctions;

  const items = req.query.user
    ? await getUserItems(
        <string>req.query.user,
        req.params.collectionAddress,
        auctions
      )
    : await getItems(req.params.collectionAddress, auctions);

  return res.status(200).json(items);
};

const item = async (req: Request, res: Response) => {
  const auctions = <NFTAuctions>req.locals.contracts.auctions;

  const { seller, currentBidder, currentBid, endsAt } = await auctions.items(
    req.params.collectionAddress,
    req.params.tokenId
  );

  const output: AuctionItemData = {
    seller,
    currentBidder,
    currentBid,
    endsAt,
    collectionAddress: req.params.collectionAddress,
    tokenId: ethers.BigNumber.from(req.params.tokenId),
  };
  res.status(200).json(output);
};

export default { list, items, item };
