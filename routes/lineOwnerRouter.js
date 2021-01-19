const express = require("express");
const router = express.Router();

const { addNewLineOwner } = require("../controllers/lineOwnerCtrlr");
const {} = require("../controllers/validator");

router.post("", addNewLineOwner);

module.exports = router;
