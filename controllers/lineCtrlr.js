const Line = require("../models/lineModel");
const lineInstance = new Line();

const addNewLine = async (req, res) => {
  let newLine = req.body;
  const lineId = await lineInstance.addLine(newLine);
  res.json(lineId);
};

const getLineById = async (req, res) => {
  const { id } = req.params;
  const line = await lineInstance.getLineById(id);
  res.json(line);
};

const getLinesByOwnerId = async (req, res) => {
  const ownerId = req.params.id;
  const lines = await lineInstance.getLinesByOwnerId(ownerId);
  res.json(lines);
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
  getLinesByOwnerId,
  addShopperToLine,
  removeShopperFromLine,
};
