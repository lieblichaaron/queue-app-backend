const bcrypt = require("bcrypt");

const LineOwner = require("../models/lineOwnerModel");
const lineOwnerInstance = new LineOwner();

const addNewLineOwner = async (req, res) => {
  let newOwner = await req.body;

  if (!newOwner) {
    return res.status(400).json({
      success: false,
      error: "No information provided",
    });
  }

  newOwner.password = await bcrypt.hash(newOwner.password, 10);
  await lineOwnerInstance.addLineOwner(newOwner);
  res.status(200).json(newOwner);
};

const loginLineOwner = async (req, res) => {
  let body = await req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No email provided",
    });
  }

  const lineOwner = await lineOwnerInstance.getLineOwnerByEmail(body.email);
  console.log(lineOwner);

  await bcrypt.compare(
    body.password,
    lineOwner.password,
    async (err, result) => {
      if (result) {
        console.log(result);
        res.json(lineOwner);
      }
    }
  );
};

module.exports = {
  addNewLineOwner,
  loginLineOwner,
};
