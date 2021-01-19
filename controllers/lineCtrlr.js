const Line = require("../models/lineModel");
const lineInstance = new Line();

const addNewLine = async (req, res) => {
  let newLine = req.body;
  await lineInstance.addLine(newLine);

  res.json("Line successfully added");
};

module.exports = {
  addNewLine,
};
