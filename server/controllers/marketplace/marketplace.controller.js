const getItems = async (collectionAddress, marketplace) => {
  const count = (
    await marketplace.getAllItemsCount(collectionAddress)
  ).toNumber();

  let output = [];
  if (count > 0) {
    output = await Promise.all(
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
  }
  return output;
};

const getUserItems = async (userAddress, collectionAddress, marketplace) => {
  const count = (
    await marketplace.getUserItemsCount(userAddress, collectionAddress)
  ).toNumber();

  let output = [];
  if (count > 0) {
    output = await Promise.all(
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
  }
  return output;
};

const list = async (req, res) => {
  const marketplace = req.marketplace;
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
            items: await getUserItems(req.query.user, collection, marketplace),
          });
        })
      );
    } else {
      await Promise.all(
        collections.map(async (collection) => {
          output.push({
            collection: collection,
            items: await getItems(collection, marketplace),
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
      .json(await getUserItems(user, address, req.marketplace));
  return res.status(200).json(await getItems(address, req.marketplace));
};

const item = async (req, res) => {
  const address = req.params.collectionAddress;
  const tokenId = req.params.tokenId;
  const marketplace = req.marketplace;

  let output = await marketplace.items(address, tokenId);
  output = {
    seller: output[0],
    price: output[1].toString(),
    collection: address,
    tokenId: tokenId,
  };
  res.status(200).json(output);
};

export default { list, items, item };
