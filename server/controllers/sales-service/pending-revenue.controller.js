const read = async (req, res) => {
  const salesservice = req.salesservice;
  try {
    const output = (
      await salesservice.getPendingRevenue(req.params.userAddress)
    ).toString();
    res
      .status(200)
      .json({ address: req.params.userAddress, pendingRevenue: output });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default { read };
