const express = require("express");
const router = express.Router();

const { addNewLine } = require("../controllers/lineCtrlr");
const {} = require("../controllers/validator");

router.post("", addNewLine);

module.exports = router;
