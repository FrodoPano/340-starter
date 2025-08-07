CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  inv_id INTEGER NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
  account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);