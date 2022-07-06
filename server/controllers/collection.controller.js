import { ethers } from "ethers";
import CoreContract from "../models/core-contract.model";

// IERC721Enumerable + IERC721Metadata
const erc721Abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function contractURI() public view returns (string)",
  "function totalSupply() public view returns (uint256)",
  "function tokenByIndex(uint256) public view returns (uint256)",
  "function balanceOf(address) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address,uint256) public view returns (uint256)",
  "function tokenURI(uint256) public view returns (string)",
  "function ownerOf(uint256) public view returns (address)",
];

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
  const manager = req.manager;
  try {
    const count = (await manager.getCollectionsCount()).toNumber();

    let output = [];
    if (count > 0) {
      const collections = await Promise.all(
        [...Array(count)].map(async (_, i) => {
          return await manager.collectionByIndex(i);
        })
      );

      output = await Promise.all(
        collections.map(async (address) => {
          const collection = new ethers.Contract(
            address,
            erc721Abi,
            req.web3Provider
          );
          return await getCollectionData(manager, collection);
        })
      );
    }

    res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const read = async (req, res) => {
  const manager = req.manager;
  const collection = req.collection;

  try {
    const output = await getCollectionData(manager, collection);

    res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const collectionByAddress = async (req, res, next, address) => {
  const erc721 = new ethers.Contract(address, erc721Abi, req.web3Provider);
  req.collection = erc721;
  next();
};

const getItemData = async (tokenId, collection) => {
  return {
    tokenId: tokenId.toString(),
    tokenURI: await collection.tokenURI(tokenId),
    collectionAddress: collection.address,
    owner: await collection.ownerOf(tokenId),
  };
};

const getItemsOfUser = async (userAddress, collection) => {
  const count = (await collection.balanceOf(userAddress)).toNumber();

  let output = [];
  if (count > 0) {
    const tokens = await Promise.all(
      [...Array(count)].map(
        async (_, i) => await collection.tokenOfOwnerByIndex(userAddress, i)
      )
    );

    output = await Promise.all(
      tokens.map(async (token) => {
        return await getItemData(token, collection);
      })
    );
  }
  return output;
};

const getItems = async (contract) => {
  const count = (await contract.totalSupply()).toNumber();

  let output = [];
  if (count > 0) {
    const tokens = await Promise.all(
      [...Array(count)].map(async (_, i) => await contract.tokenByIndex(i))
    );

    output = await Promise.all(
      tokens.map(async (token) => {
        return await getItemData(token, contract);
      })
    );
  }
  return output;
};

const items = async (req, res) => {
  const erc721 = req.collection;

  try {
    let output = [];
    if (req.query?.user) {
      output = await getItemsOfUser(req.query.user, erc721);
      return res.status(200).json(output);
    }
    output = await getItems(erc721);
    return res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const item = async (req, res) => {
  const erc721 = req.collection;
  const tokenId = req.params.itemId;

  try {
    const output = await getItemData(tokenId, erc721);
    res.status(200).json(output);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { list, read, items, item, collectionByAddress };
