const pool = require("../database/");

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO reviews (inv_id, account_id, review_text, rating)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    return await pool.query(sql, [inv_id, account_id, review_text, rating]);
  } catch (error) {
    console.error("Add review error:", error);
    return error.message;
  }
}

/* ***************************
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("Get reviews error:", error);
    return [];
  }
}

/* ***************************
 *  Check if user already reviewed a vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = `
      SELECT * FROM reviews
      WHERE inv_id = $1 AND account_id = $2`;
    const result = await pool.query(sql, [inv_id, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Check review error:", error);
    return false;
  }
}

module.exports = { addReview, getReviewsByInventoryId, checkExistingReview };