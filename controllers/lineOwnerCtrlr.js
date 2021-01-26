const bcrypt = require("bcrypt");
const jwt = require("../utils/auth");

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
  const authToken = await jwt.createToken(newOwner);
  res.status(200).json({
    authToken: authToken,
    displayName: newOwner.displayName,
  });
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

  if (!lineOwner) {
    return res.status(400).json({
      success: false,
      error: "Wrong login information",
    });
  }

  await bcrypt.compare(
    body.password,
    lineOwner.password,
    async (err, result) => {
      if (result) {
        const authToken = await jwt.createToken(lineOwner);
        res.status(200).json({
          authToken: authToken,
          displayName: lineOwner.displayName,
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Wrong password",
        });
      }
    }
  );
};

const getLoggedInUser = async (req, res) => {
  const email = req.headers.email;
  const user = await new LineOwner().getLineOwnerByEmail(email);
  res.json(user);
};

const editOwnerDetails = async (req, res) => {
  const email = req.headers.email;
  try {
    await new LineOwner().changeLineOwnerSettings(req.body, email);
  } catch (err) {
    if (err.message === "Email address is taken")
      res.status(400).send("email address already exists");
    return;
  }
  res.sendStatus(200);
};

module.exports = {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
  editOwnerDetails,
};
