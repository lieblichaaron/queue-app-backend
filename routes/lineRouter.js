const express = require("express");
const router = express.Router();

const { addNewLine, getLineById } = require("../controllers/lineCtrlr");
const {} = require("../controllers/validator");

router.post("", addNewLine);

router.get("/:id", getLineById);

module.exports = router;
