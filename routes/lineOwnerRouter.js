const express = require("express");
const router = express.Router();

const {
  addNewLineOwner,
  loginLineOwner,
} = require("../controllers/lineOwnerCtrlr");

const {} = require("../controllers/validator");

router.post("/", addNewLineOwner);
router.post("/login", loginLineOwner);

module.exports = router;
