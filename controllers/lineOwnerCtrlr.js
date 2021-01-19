const LineOwner = require("../models/lineOwnerModel");
const lineOwnerInstance = new LineOwner();

const addNewLineOwner = async (req, res) => {
  let newOwner = req.body;
  await lineOwnerInstance.addLineOwner(newOwner);

  res.json("Line owner successfully added");
};

module.exports = {
  addNewLineOwner,
};
