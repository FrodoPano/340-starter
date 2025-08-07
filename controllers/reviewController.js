const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

/* ***************************
 *  Process adding a review
 * ************************** */
async function addReview(req, res) {
  const { inv_id, review_text, rating } = req.body;
  const account_id = res.locals.accountData.account_id;

  // Validate input
  if (!review_text || !rating || rating < 1 || rating > 5) {
    req.flash("error", "Invalid review data. Rating must be 1-5.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  try {
    // Check if user already reviewed this vehicle
    const alreadyReviewed = await reviewModel.checkExistingReview(inv_id, account_id);
    if (alreadyReviewed) {
      req.flash("error", "You have already reviewed this vehicle.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // Add review to database
    await reviewModel.addReview(inv_id, account_id, review_text, rating);
    req.flash("notice", "Review submitted successfully!");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    req.flash("error", "Failed to submit review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = { addReview };