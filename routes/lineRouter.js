const express = require("express");
const router = express.Router();

const { addNewLine, getLineById, getLinesByOwnerId } = require("../controllers/lineCtrlr");
const {} = require("../controllers/validator");

router.post("", addNewLine);

router.get("/:id", getLineById);

router.get("/owned-by/:id", getLinesByOwnerId)

module.exports = router;
