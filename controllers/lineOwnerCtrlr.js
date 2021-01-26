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
        res.status(200).json(lineOwner);
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
    res.status(400).send("email address already exists");
    return;
  }
  res.sendStatus(200);
};

const editOwnerPassword = async (req, res) => {
  const email = req.headers.email;
  const lineOwnerInstance = new LineOwner();
  const user = await lineOwnerInstance.getLineOwnerByEmail(email);
  bcrypt.compare(req.body.oldPassword, user.password, async (err, result) => {
    if (err) {
      res.status(500).send("something went wrong when checking password");
      return;
    }
    if (!result) res.status(400).send("password is incorrect");
    if (result) {
      bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
        if (err) throw err;
       lineOwnerInstance.changeLineOwnerPassword(email, hash);
      });
      res.sendStatus(200);
    }
  });
};

module.exports = {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
  editOwnerDetails,
  editOwnerPassword,
};
