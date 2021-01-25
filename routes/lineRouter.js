const express = require("express");
const router = express.Router();

const {
  addNewLine,
  getLineById,
  getLinesByOwnerId,
  addShopperToLine,
} = require("../controllers/lineCtrlr");
const {} = require("../controllers/validator");

router.post("", addNewLine);

router.get("/:id", getLineById);

router.get("/owned-by/:id", getLinesByOwnerId);

router.put("/:id", addShopperToLine);

module.exports = router;
