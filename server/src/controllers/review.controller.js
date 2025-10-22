const {
  addReview,
  getReviewsForBook,
  getBookRatings,
} = require("../models/review.model");

// postReview function
async function postReview(req, res) {
  try {
    const { bookId, rating, reviewText } = req.body; // get from body
    const userId = req.user.id; // comes from JWT middleware

    // check if bookId and rating is not available
    if (!bookId || !rating) {
      return res.status(400).json({ error: "bookId and rating are required" });
    }

    const review = await addReview({ userId, bookId, rating, reviewText });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// get book reviews function
async function getBookReviews(req, res) {
  try {
    const { id } = req.params;
    const reviews = await getReviewsForBook(id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// listing books with review
async function listBookWithRatings(req, res) {
  try {
    const book = await getBookRatings();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// exporting modules
module.exports = { postReview, getBookReviews, listBookWithRatings };
