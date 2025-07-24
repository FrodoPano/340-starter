const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // First name validation
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name.")
      .isAlpha()
      .withMessage("First name must contain only letters."),

    // Last name validation
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name.")
      .isAlpha()
      .withMessage("Last name must contain only letters."),

    // Email validation
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
    }),

    // Password validation
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters with at least one lowercase, one uppercase, one number, and one special character."
      ),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification name must be alphanumeric with no spaces")
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
    });
  }
  next();
};


module.exports = validate;