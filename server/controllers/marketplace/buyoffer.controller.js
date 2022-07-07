import { ethers } from "ethers";
import { abi as erc721Abi } from "../../abis/erc721.abi.json";

const getCollectionOffers = async (collection, buyoffers) => {
  const totalSupply = (await collection.totalSupply()).toNumber();

  const collectionOutput = { collection: collection.address, tokens: [] };

  if (totalSupply > 0) {
    const tokens = await Promise.all(
      [...Array(totalSupply)].map(async (_, i) => {
        return await collection.tokenByIndex(i);
      })
    );

    await Promise.all(
      tokens.map(async (token) => {
        const tokenOffers = { tokenId: token.toString(), offers: [] };

        const offersCount = (
          await buyoffers.getAllOffersCount(collection.address, token)
        ).toNumber();

        if (offersCount > 0) {
          await Promise.all(
            [...Array(offersCount)].map(async (_, i) => {
              const offer = await buyoffers.offerByIndex(
                collection.address,
                token,
                i
              );
              tokenOffers.offers.push({
                user: offer[0],
                bid: offer[1].toString(),
              });
            })
          );
        }

        if (tokenOffers.offers.length)
          collectionOutput.tokens.push(tokenOffers);
      })
    );
  }
  return collectionOutput;
};

const getUserCollectionOffers = async (userAddress, collection, buyoffers) => {
  const collectionOutput = { collection: collection.address, tokens: [] };

  const offersCount = (
    await buyoffers.getUserOffersCount(userAddress, collection.address)
  ).toNumber();

  if (offersCount > 0) {
    await Promise.all(
      [...Array(offersCount)].map(async (_, i) => {
        const offer = await buyoffers.offerOfUserByIndex(
          userAddress,
          collection.address,
          i
        );
        console.log(offer);
        collectionOutput.tokens.push({
          tokenId: offer[0].toString(),
          offers: [{ user: userAddress, bid: offer[1].toString() }],
        });
      })
    );
  }

  return collectionOutput;
};

const list = async (req, res) => {
  const buyoffers = req.buyoffers;
  const manager = req.manager;

  const count = (await manager.getCollectionsCount()).toNumber();

  let output = [];

  if (count > 0) {
    const collections = await Promise.all(
      [...Array(count)].map(async (_, i) => {
        return await manager.collectionByIndex(i);
      })
    );

    output = await Promise.all(
      collections.map(async (collection) => {
        const erc721 = new ethers.Contract(
          collection,
          erc721Abi,
          req.web3Provider
        );

        if (req.query.user)
          return await getUserCollectionOffers(
            req.query.user,
            erc721,
            buyoffers
          );

        return await getCollectionOffers(erc721, buyoffers);
      })
    );
  }

  res.status(200).json(output);
};

const read = async (req, res) => {
  const buyoffers = req.buyoffers;
  const address = req.params.collectionAddress;

  const collection = new ethers.Contract(address, erc721Abi, req.web3Provider);

  let output;
  if (req.query.user)
    output = await getUserCollectionOffers(
      req.query.user,
      collection,
      buyoffers
    );
  else output = await getCollectionOffers(collection, buyoffers);

  res.status(200).json(output);
};

const getTokenOffers = async (collectionAddress, tokenId, buyoffers) => {
  const count = (
    await buyoffers.getAllOffersCount(collectionAddress, tokenId)
  ).toNumber();

  let output = [];
  if (count > 0) {
    output = await Promise.all(
      [...Array(count)].map(async (_, i) => {
        const offer = await buyoffers.offerByIndex(
          collectionAddress,
          tokenId,
          i
        );

        return {
          user: offer[0],
          bid: offer[1].toString(),
        };
      })
    );
  }

  return output;
};

const items = async (req, res) => {
  const buyoffers = req.buyoffers;
  const address = req.params.collectionAddress;
  const tokenId = req.params.tokenId;

  const offers = await getTokenOffers(address, tokenId, buyoffers);

  res.status(200).json({
    collection: address,
    tokens: [{ tokenId: tokenId, offers: offers }],
  });
};
export default { list, read, items };
