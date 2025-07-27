// Needed Resources 
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get("/login", 
  utilities.handleErrors(accountController.buildLogin));

module.exports = router;

// Process the registration data
