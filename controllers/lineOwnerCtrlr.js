const bcrypt = require("bcrypt");

const LineOwner = require("../models/lineOwnerModel");

const addNewLineOwner = async (req, res) => {
  let newOwner = await req.body;

  if (!newOwner) {
    return res.status(400).json({
      success: false,
      error: "No information provided",
    });
  }

  // Call lineOwnerModel method to check if email already exists

  const lineOwnerInstance = new LineOwner(newOwner);
  newOwner.password = await bcrypt.hash(newOwner.password, 10);
  await lineOwnerInstance.addLineOwner(newOwner);
  res.json(newOwner);
};

const loginLineOwner = async (req, res) => {
  res.json();
};

const getLoggedInUser = async (req,res) => {
  const email = req.headers.email;
  console.log(email)
  const user = await new LineOwner().getLineOwnerByEmail(email);
  res.json(user);
}

module.exports = {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
};
