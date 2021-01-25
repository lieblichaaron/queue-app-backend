const express = require("express");
const router = express.Router();

const {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
  editOwnerDetails,
} = require("../controllers/lineOwnerCtrlr");

const {} = require("../controllers/validator");

router.post("/", addNewLineOwner);
router.post("/", loginLineOwner);
router.get("/current-user", getLoggedInUser);
router.put("/edit", editOwnerDetails)

module.exports = router;
