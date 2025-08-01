const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: req.flash('message') || null,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Check if email already exists
  const emailExists = await accountModel.checkExistingEmail(account_email);
  if (emailExists) {
    req.flash("notice", "Email already exists. Please log in or use different email.");
    return res.status(400).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    });
  }

  // Hash password before registering
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    message: req.flash('message') || null
  });
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    errors: null,
    message: req.flash('message') || null
  });
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  
  if (updateResult) {
    // Get updated account data
    const accountData = await accountModel.getAccountById(account_id);
    
    // Update JWT token with new data
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    
    req.flash("notice", "Account updated successfully");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed");
    res.redirect(`/account/update/${account_id}`);
  }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  
  // Hash the new password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing your password change");
    return res.redirect(`/account/update/${account_id}`);
  }
  
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  
  if (updateResult) {
    req.flash("notice", "Password updated successfully");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the password update failed");
    res.redirect(`/account/update/${account_id}`);
  }
}

/* ****************************************
*  Process logout request
* *************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt");
  res.redirect("/");
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdate, updateAccount, updatePassword, logout };