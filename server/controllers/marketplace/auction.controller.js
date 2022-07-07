const getItems = async (collectionAddress, auctions) => {
  const count = (await auctions.getAllItemsCount(collectionAddress)).toNumber();

  let output = [];
  if (count > 0) {
    output = await Promise.all(
      [...Array(count)].map(async (_, i) => {
        const item = await auctions.itemByIndex(collectionAddress, i);

        return {
          seller: item[0],
          currentBidder: item[1],
          currentBid: item[2].toString(),
          endsAt: item[3].toString(),
          collection: item[4].toString(),
          tokenId: item[5].toString(),
        };
      })
    );
  }
  return output;
};

const getUserItems = async (userAddress, collectionAddress, auctions) => {
  const count = (
    await auctions.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  let output = [];
  if (count > 0) {
    output = await Promise.all(
      [...Array(count)].map(async (_, i) => {
        const item = await auctions.itemOfUserByIndex(
          userAddress,
          collectionAddress,
          i
        );

        return {
          seller: item[0],
          currentBidder: item[1],
          currentBid: item[2].toString(),
          endsAt: item[3].toString(),
          collection: item[4].toString(),
          tokenId: item[5].toString(),
        };
      })
    );
  }
  return output;
};

const list = async (req, res) => {
  const auctions = req.auctions;
  const manager = req.manager;

  const count = (await manager.getCollectionsCount()).toNumber();

  const output = [];

  if (count > 0) {
    const collections = await Promise.all(
      [...Array(count)].map(async (_, i) => {
        return await manager.collectionByIndex(i);
      })
    );

    if (req.query.user) {
      await Promise.all(
        collections.map(async (collection) => {
          output.push({
            collection: collection,
            items: await getUserItems(req.query.user, collection, auctions),
          });
        })
      );
    } else {
      await Promise.all(
        collections.map(async (collection) => {
          output.push({
            collection: collection,
            items: await getItems(collection, auctions),
          });
        })
      );
    }
  }

  res.status(200).json(output);
};

const items = async (req, res) => {
  const address = req.params.collectionAddress;
  const user = req.query.user;
  if (user)
    return res
      .status(200)
      .json(await getUserItems(user, address, req.auctions));
  return res.status(200).json(await getItems(address, req.auctions));
};

const item = async (req, res) => {
  const address = req.params.collectionAddress;
  const tokenId = req.params.tokenId;
  const auctions = req.auctions;

  let output = await auctions.items(address, tokenId);
  output = {
    seller: output[0],
    currentBidder: output[1],
    currentBid: output[2].toString(),
    endsAt: output[3].toString(),
    collection: address,
    tokenId: tokenId,
  };
  res.status(200).json(output);
};

export default { list, items, item };
