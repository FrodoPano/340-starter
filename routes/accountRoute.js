const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const authMiddleware = require("../utilities/authMiddleware");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Account management routes
router.get("/",
  authMiddleware.checkJWTToken,
  utilities.handleErrors(accountController.buildManagement)
);

// Account update routes
router.get("/update/:account_id",
  authMiddleware.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdate)
);
router.post("/update",
  authMiddleware.checkJWTToken,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Password update route
router.post("/update-password",
  authMiddleware.checkJWTToken,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Logout route
router.get("/logout",
  utilities.handleErrors(accountController.logout)
);

module.exports = router;