const Line = require("../models/lineModel");
const lineInstance = new Line();
const LineOwner = require("../models/lineOwnerModel");
const lineOwnerInstance = new LineOwner();

const addNewLine = async (req, res) => {
  let newLine = req.body;
  const line = await lineInstance.addLine(newLine);
  await lineOwnerInstance.addLineToOwner(line._id.toString(), line.ownerId);
  res.json(line._id);
};

const getLineById = async (req, res) => {
  const { id } = req.params;
  const line = await lineInstance.getLineById(id);
  res.json(line);
};

const getLineByIdOnChange = async (req, res) => {
  const { id } = req.params;
  const line = await lineInstance.getLineByIdOnChange(id);
  res.json(line);
};

const addShopperToLine = async (req, res) => {
  const { id } = req.params;
  const shopper = req.body;
  const line = await lineInstance.getLineById(id);
  let newLine;
  if (line.isActive) {
    newLine = await lineInstance.addShopperToLine(id, shopper);
  } else {
    newLine =
      "The line is currently closed, we're sorry for the inconvenience.";
  }
  res.json(newLine);
};

const removeShopperFromLine = async (req, res) => {
  const { id } = req.params;
  const shopper = req.body;
  await lineInstance.removeShopperFromLine(id, shopper);
  res.json("You have left the line.");
};
module.exports = {
  addNewLine,
  getLineById,
  addShopperToLine,
  removeShopperFromLine,
  getLineByIdOnChange,
};
