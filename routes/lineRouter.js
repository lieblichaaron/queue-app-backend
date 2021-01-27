const express = require("express");
const router = express.Router();

const {
  addNewLine,
  getLineById,
  addShopperToLine,
  removeShopperFromLine,
  getLineByIdOnChange,
  serveNextCustomer,
  setLineActiveStatus,
} = require("../controllers/lineCtrlr");

const {} = require("../controllers/validator");

router.post("", addNewLine);

router.get("/:id", getLineById);

router.get("/watch/:id", getLineByIdOnChange);

router.put("/add-shopper/:id", addShopperToLine);

router.put("/remove-shopper/:id", removeShopperFromLine);

router.put("/served-one/:id", serveNextCustomer);

router.put("/status/:id", setLineActiveStatus);

module.exports = router;
