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
  const line = await lineInstance.addShopperToLine(id, shopper);
  res.json(line.value);
};
module.exports = {
  addNewLine,
  getLineById,
  getLinesByOwnerId,
  addShopperToLine,
};
