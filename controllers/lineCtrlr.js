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

const getLineByIdOnChange = async (req, res) => {
  const { id } = req.params;
  const line = await lineInstance.getLineByIdOnChange(id);
  res.json(line);
};

const addShopperToLine = async (req, res) => {
  const { id } = req.params;
  const shopper = req.body;
  const line = await lineInstance.addShopperToLine(id, shopper);
  res.json(line.value);
};

const removeShopperFromLine = async (req, res) => {
  const { id } = req.params;
  const shopper = req.body;
  await lineInstance.removeShopperFromLine(id, shopper);
  res.json("You have left the line");
};
module.exports = {
  addNewLine,
  getLineById,
  addShopperToLine,
  removeShopperFromLine,
  getLineByIdOnChange,
};
