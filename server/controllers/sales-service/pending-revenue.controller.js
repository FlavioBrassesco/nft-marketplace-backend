const read = async (req, res) => {
  const output = (
    await req.salesservice.getPendingRevenue(req.params.userAddress)
  ).toString();
  res
    .status(200)
    .json({ address: req.params.userAddress, pendingRevenue: output });
};

export default { read };
