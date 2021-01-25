const Line = require("../models/lineModel");
const lineInstance = new Line();

const addNewLine = async (req, res) => {
  let newLine = req.body;
  const lineId = await lineInstance.addLine(newLine);
  res.json(lineId);
};

module.exports = {
  addNewLine,
};
