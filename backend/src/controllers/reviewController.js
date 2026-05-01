// Avis clients modérés.
import Review from "../models/Review.js";

export async function createReview(req, res) {
  const review = await Review.create(req.body);
  res.status(201).json(review);
}

export async function getApprovedReviews(req, res) {
  const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(20);
  res.json(reviews);
}
