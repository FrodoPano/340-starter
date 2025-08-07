const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const authMiddleware = require("../utilities/authMiddleware");

// POST route to add a review (protected)
router.post(
  "/add",
  authMiddleware.checkJWTToken, // Only logged-in users can post
  utilities.handleErrors(reviewController.addReview)
);

module.exports = router;