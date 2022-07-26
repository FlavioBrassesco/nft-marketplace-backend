/// <reference path="../../../types/index.d.ts" />
import { Request, Response } from "express";
import { BigNumber } from "ethers";
import { NFTCollectionManager } from "../../typechain-types/contracts/NFTCollectionManager";
import { NFTBuyOffers } from "../../typechain-types/contracts/NFTBuyOffers";
import { MockERC721 } from "../../typechain-types/contracts/mocks/MockERC721/MockERC721";
import { MockERC721__factory } from "../../typechain-types/factories/contracts/mocks/MockERC721/MockERC721__factory";

export type BuyOffer = {
  user: string;
  bid: BigNumber;
};

// !TODO ver que entregar en cuenta 0 de ofertas
const getCollectionOffers = async (
  collection: MockERC721,
  buyoffers: NFTBuyOffers
) => {
  const totalSupply = (await collection.totalSupply()).toNumber();

  let tokens: string[] = [];
  let offersByToken = {};

  await Promise.all(
    [...Array(totalSupply)].map(async (_, i) => {
      const token = await collection.tokenByIndex(i);

      const count = (
        await buyoffers.getAllOffersCount(collection.address, token)
      ).toNumber();

      const offers: BuyOffer[] = await Promise.all(
        [...Array(count)].map(async (_, i) => {
          const { user, bid } = await buyoffers.offerByIndex(
            collection.address,
            token,
            i
          );

          return {
            user,
            bid,
          };
        })
      );

      if (count > 0) {
        const tokenId = token.toString();
        tokens.push(tokenId);
        offersByToken = { ...offersByToken, [tokenId]: offers };
      }
    })
  );

  return {
    tokens,
    ...offersByToken,
  };
};

const getUserCollectionOffers = async (
  userAddress: string,
  collection: MockERC721,
  buyoffers: NFTBuyOffers
) => {
  const count = (
    await buyoffers.getUserOffersCount(userAddress, collection.address)
  ).toNumber();

  let tokens: string[] = [];
  let offersByToken = {};
  await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const { tokenId, bid } = await buyoffers.offerOfUserByIndex(
        userAddress,
        collection.address,
        i
      );

      tokens.push(tokenId.toString());
      offersByToken = {
        ...offersByToken,
        [tokenId.toString()]: { user: userAddress, bid },
      };
    })
  );

  return {
    tokens,
    ...offersByToken,
  };
};

const list = async (req: Request, res: Response) => {
  const manager = <NFTCollectionManager>req.locals.contracts.manager;
  const buyoffers = <NFTBuyOffers>req.locals.contracts.buyoffers;

  const count = (await manager.getCollectionsCount()).toNumber();

  let collections: string[] = [];
  let collectionOffers = {};
  await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const collectionAddress = await manager.collectionByIndex(i);

      const erc721 = MockERC721__factory.connect(
        collectionAddress,
        req.locals.web3Provider
      );

      const offers = req.query.user
        ? await getUserCollectionOffers(
            <string>req.query.user,
            erc721,
            buyoffers
          )
        : await getCollectionOffers(erc721, buyoffers);

      collections.push(collectionAddress);
      collectionOffers = {
        ...collectionOffers,
        [collectionAddress]: offers,
      };
    })
  );

  const output = {
    collections,
    ...collectionOffers,
  };

  res.status(200).json(output);
};

const read = async (req: Request, res: Response) => {
  const buyoffers = <NFTBuyOffers>req.locals.contracts.buyoffers;
  const collection = MockERC721__factory.connect(
    req.params.collectionAddress,
    req.locals.web3Provider
  );

  const output = req.query.user
    ? await getUserCollectionOffers(
        <string>req.query.user,
        collection,
        buyoffers
      )
    : await getCollectionOffers(collection, buyoffers);

  res.status(200).json(output);
};

const getTokenOffers = async (
  collectionAddress: string,
  tokenId: string | number,
  buyoffers: NFTBuyOffers
) => {
  const count = (
    await buyoffers.getAllOffersCount(collectionAddress, tokenId)
  ).toNumber();

  const output: BuyOffer[] = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const { user, bid } = await buyoffers.offerByIndex(
        collectionAddress,
        tokenId,
        i
      );

      return {
        user,
        bid,
      };
    })
  );

  return output;
};

const items = async (req: Request, res: Response) => {
  const buyoffers = <NFTBuyOffers>req.locals.contracts.buyoffers;

  const offers = await getTokenOffers(
    req.params.collectionAddress,
    req.params.tokenId,
    buyoffers
  );

  res.status(200).json(offers);
};

export default { list, read, items };
