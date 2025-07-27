// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const validate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildVehicleDetail);
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

module.exports = router;