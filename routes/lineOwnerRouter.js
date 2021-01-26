const express = require("express");
const router = express.Router();

const {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
  editOwnerDetails,
  editOwnerPassword,
} = require("../controllers/lineOwnerCtrlr");

const {} = require("../controllers/validator");

router.post("/", addNewLineOwner);

router.post("/login", loginLineOwner);
router.get("/current-user", getLoggedInUser);
router.put("/edit", editOwnerDetails);
router.put("/password", editOwnerPassword);

module.exports = router;
