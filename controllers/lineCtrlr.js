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
  const lines = await getLinesByOwnerId(ownerId);
  res.json(lines)
}

module.exports = {
  addNewLine,
  getLineById,
  getLinesByOwnerId,
};
