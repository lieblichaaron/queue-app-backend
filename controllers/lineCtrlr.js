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
  const line = await lineInstance.getLineById(id);
  let number;
  if (Array.isArray(line.line) && line.line.length > 0) {
    const prevNumber = line.line[line.line.length - 1].number;
    if (prevNumber === 99) {
      number = 1;
    } else {
      number = prevNumber + 1; 
    }
  } else {
    number = 1;
  }
  let newLine;
  if (line.isActive) {
    newLine = await lineInstance.addShopperToLine(id, 
      {
        joinTime: new Date().getTime(),
        number: number,
        serviceTime: 0,
        waitTime: 0,
      });
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

const serveNextCustomer = async (req, res) => {
  const lineId = req.params.id;
  const result = await lineInstance.serveNextCustomer(lineId);
  res.json(result);
}

const setLineActiveStatus = async (req,res) => {
  const {id} = req.params;
  const {isActive} = req.body;
  const status = await lineInstance.setLineActiveStatus(id, isActive)
  res.send(status)
}

module.exports = {
  addNewLine,
  getLineById,
  addShopperToLine,
  removeShopperFromLine,
  serveNextCustomer,
  getLineByIdOnChange,
  setLineActiveStatus
};
