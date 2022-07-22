const getItems = async (collectionAddress, auctions) => {
  const count = (await auctions.getAllItemsCount(collectionAddress)).toNumber();

  const output = await Promise.all(
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

  return output;
};

const getUserItems = async (userAddress, collectionAddress, auctions) => {
  const count = (
    await auctions.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  const output = await Promise.all(
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

  return output;
};

const list = async (req, res) => {
  const count = (await req.contracts.manager.getCollectionsCount()).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const collection = await req.contracts.manager.collectionByIndex(i);

      const items = req.query.user
        ? await getUserItems(req.query.user, collection, req.contracts.auctions)
        : await getItems(collection, req.contracts.auctions);

      return { collection, items };
    })
  );

  res.status(200).json(output);
};

const items = async (req, res) => {
  const items = req.query.user
    ? await getUserItems(
        req.query.user,
        req.params.collectionAddress,
        req.contracts.auctions
      )
    : await getItems(req.params.collectionAddress, req.contracts.auctions);

  return res.status(200).json(items);
};

const item = async (req, res) => {
  const items = await req.contracts.auctions.items(
    req.params.collectionAddress,
    req.params.tokenId
  );

  const output = {
    seller: items[0],
    currentBidder: items[1],
    currentBid: items[2].toString(),
    endsAt: items[3].toString(),
    collection: req.params.collectionAddress,
    tokenId: req.params.tokenId,
  };
  res.status(200).json(output);
};

export default { list, items, item };
