import { ethers } from "ethers";
import { abi as erc721Abi } from "../../abis/erc721.abi.json";

const getCollectionOffers = async (collection, buyoffers) => {
  const totalSupply = (await collection.totalSupply()).toNumber();

  const tokens = await Promise.all(
    [...Array(totalSupply)].map(async (_, i) => {
      const token = await collection.tokenByIndex(i);

      const count = (
        await buyoffers.getAllOffersCount(collection.address, token)
      ).toNumber();

      const offers = await Promise.all(
        [...Array(count)].map(async (_, i) => {
          const offer = await buyoffers.offerByIndex(
            collection.address,
            token,
            i
          );
          return {
            user: offer[0],
            bid: offer[1].toString(),
          };
        })
      );

      return { tokenId: token.toString(), offers };
    })
  );

  return { collection: collection.address, tokens };
};

const getUserCollectionOffers = async (userAddress, collection, buyoffers) => {
  const count = (
    await buyoffers.getUserOffersCount(userAddress, collection.address)
  ).toNumber();

  const tokens = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const offer = await buyoffers.offerOfUserByIndex(
        userAddress,
        collection.address,
        i
      );

      return {
        tokenId: offer[0].toString(),
        offers: [{ user: userAddress, bid: offer[1].toString() }],
      };
    })
  );

  return { collection: collection.address, tokens };
};

const list = async (req, res) => {
  const count = (await req.contracts.manager.getCollectionsCount()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const collection = req.contracts.manager.collectionByIndex(i);

      const erc721 = new ethers.Contract(
        collection,
        erc721Abi,
        req.web3Provider
      );

      if (req.query.user)
        return await getUserCollectionOffers(
          req.query.user,
          erc721,
          req.contracts.buyoffers
        );

      return await getCollectionOffers(erc721, req.contracts.buyoffers);
    })
  );

  res.status(200).json(output);
};

const read = async (req, res) => {
  const collection = new ethers.Contract(
    req.params.collectionAddress,
    erc721Abi,
    req.web3Provider
  );

  const output = req.query.user
    ? await getUserCollectionOffers(req.query.user, collection, req.contracts.buyoffers)
    : await getCollectionOffers(collection, req.contracts.buyoffers);

  res.status(200).json(output);
};

const getTokenOffers = async (collectionAddress, tokenId, buyoffers) => {
  const count = (
    await buyoffers.getAllOffersCount(collectionAddress, tokenId)
  ).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const offer = await buyoffers.offerByIndex(collectionAddress, tokenId, i);

      return {
        user: offer[0],
        bid: offer[1].toString(),
      };
    })
  );

  return output;
};

const items = async (req, res) => {
  const offers = await getTokenOffers(
    req.params.collectionAddress,
    req.params.tokenId,
    req.contracts.buyoffers
  );

  res.status(200).json({
    collection: req.params.collectionAddress,
    tokens: [{ tokenId: req.params.tokenId, offers }],
  });
};

export default { list, read, items };
