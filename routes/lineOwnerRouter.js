const express = require("express");
const router = express.Router();

const {
  addNewLineOwner,
  loginLineOwner,
  getLoggedInUser,
  getLinesByOwnerId,
  editOwnerDetails,
  editOwnerPassword,
} = require("../controllers/lineOwnerCtrlr");

const {} = require("../controllers/validator");

router.post("/", addNewLineOwner);

router.post("/login", loginLineOwner);
router.get("/current-user", getLoggedInUser);
router.get("/:id/lines", getLinesByOwnerId);
router.put("/edit", editOwnerDetails);
router.put("/password", editOwnerPassword);

module.exports = router;
