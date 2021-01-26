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
  const token = await jwt.verifyToken(req.headers.authorization);
  if (!token) {
    res.status(401).send("no valid token found in authorization header");
    return;
  }
  try {
    const user = await new LineOwner().changeLineOwnerSettings(
      req.body,
      token.email
    );
    const newToken = await jwt.createToken(user);
    res.send(newToken);
  } catch (err) {
    res.status(400).send("email address already exists");
    return;
  }
};

const editOwnerPassword = async (req, res) => {
  const token = await jwt.verifyToken(req.headers.authorization);
  if (!token) {
    res.status(401).send("no valid token found in authorization header");
    return;
  }
  const lineOwnerInstance = new LineOwner();
  const user = await lineOwnerInstance.getLineOwnerByEmail(token.email);
  bcrypt.compare(req.body.oldPassword, user.password, async (err, result) => {
    if (err) {
      console.log('wrong here')
      res.status(500).send("something went wrong when checking password");
      return;
    }
    if (!result) res.status(400).send("password is incorrect");
    if (result) {
      bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
        if (err) throw err;
        const user = await lineOwnerInstance.changeLineOwnerPassword(token.email, hash);
        console.log(user)
      });
      const newToken = await jwt.createToken(user);

      res.send(newToken);
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
