const jwt = require("jsonwebtoken");
require("dotenv").config();

// Check JWT token
function checkJWTToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect("/account/login");
    }
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        res.locals.loggedin = true;
        res.locals.accountData = decoded;
        next();
    } catch (error) {
        return res.redirect("/account/login");
    }
}

// Check account type (Employee or Admin)
function checkAccountType(req, res, next) {
    if (req.user.account_type === "Employee" || req.user.account_type === "Admin") {
        next();
    } else {
        req.flash("notice", "Access restricted to employees and administrators");
        res.redirect("/account/login");
    }
}

module.exports = { checkJWTToken, checkAccountType };