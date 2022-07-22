import { ethers } from "ethers";
import { abi as erc721Abi } from "../abis/erc721.abi.json";

const getCollectionData = async (manager, collection) => {
  const output = {
    address: collection.address,
    name: await collection.name(),
    symbol: await collection.symbol(),
    contractURI: await collection.contractURI(),
    fee: (await manager.getFee(collection.address)).toString(),
    floorPrice: (await manager.getFloorPrice(collection.address)).toString(),
    whitelisted: await manager.isWhitelistedCollection(collection.address),
  };

  // catch erc721 non-enumerable
  try {
    output.totalSupply = (await collection.totalSupply()).toString();
  } catch {}

  return output;
};

const list = async (req, res) => {
  const count = (await req.contracts.manager.getCollectionsCount()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const address = await req.contracts.manager.collectionByIndex(i);
      const collection = new ethers.Contract(
        address,
        erc721Abi,
        req.web3Provider
      );
      return await getCollectionData(req.contracts.manager, collection);
    })
  );

  res.status(200).json(output);
};

const read = async (req, res) => {
  const output = await getCollectionData(
    req.contracts.manager,
    req.contracts.collection
  );
  res.status(200).json(output);
};

const collectionByAddress = async (req, res, next, address) => {
  req.contracts = {
    ...req.contracts,
    collection: new ethers.Contract(address, erc721Abi, req.web3Provider),
  };
  next();
};

const getItemData = async (collection, tokenId) => {
  return {
    tokenId: tokenId.toString(),
    tokenURI: await collection.tokenURI(tokenId),
    collectionAddress: collection.address,
    owner: await collection.ownerOf(tokenId),
  };
};

const getItemsOfUser = async (collection, userAddress) => {
  const count = (await collection.balanceOf(userAddress)).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const token = await collection.tokenOfOwnerByIndex(userAddress, i);
      return await getItemData(collection, token);
    })
  );

  return output;
};

const getItems = async (collection) => {
  const count = (await collection.totalSupply()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const token = await collection.tokenByIndex(i);
      return await getItemData(collection, token);
    })
  );

  return output;
};

const items = async (req, res) => {
  const output = req.query.user
    ? await getItemsOfUser(req.contracts.collection, req.query.user)
    : await getItems(req.contracts.collection);
  return res.status(200).json(output);
};

const item = async (req, res) => {
  const output = await getItemData(req.contracts.collection, req.tokenId);
  res.status(200).json(output);
};

export default { list, read, items, item, collectionByAddress };
