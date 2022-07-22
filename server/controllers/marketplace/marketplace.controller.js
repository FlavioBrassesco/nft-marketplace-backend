const getItems = async (collectionAddress, marketplace) => {
  const count = (
    await marketplace.getAllItemsCount(collectionAddress)
  ).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const item = await marketplace.itemByIndex(collectionAddress, i);

      return {
        seller: item[0],
        price: item[1].toString(),
        collection: item[2],
        tokenId: item[3].toString(),
      };
    })
  );

  return output;
};

const getUserItems = async (userAddress, collectionAddress, marketplace) => {
  const count = (
    await marketplace.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  const output = await Promise.all(
    [...Array(count)].map(async (_, i) => {
      const item = await marketplace.itemOfUserByIndex(
        userAddress,
        collectionAddress,
        i
      );

      return {
        seller: item[0],
        price: item[1].toString(),
        collection: item[2],
        tokenId: item[3].toString(),
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
        ? await getUserItems(req.query.user, collection, req.contracts.marketplace)
        : await getItems(collection, req.contracts.marketplace);

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
        req.contracts.marketplace
      )
    : await getItems(req.params.collectionAddress, req.contracts.marketplace);

  return res.status(200).json(items);
};

const item = async (req, res) => {
  const items = await req.contracts.marketplace.items(
    req.params.collectionAddress,
    req.params.tokenId
  );

  const output = {
    seller: items[0],
    price: items[1].toString(),
    collection: req.params.collectionAddress,
    tokenId: req.params.tokenId,
  };
  res.status(200).json(output);
};

export default { list, items, item };
