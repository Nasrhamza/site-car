// Articles blog / actualités SEO.
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  coverImage: String,
  content: String,
  excerpt: String,
  category: String,
  tags: [String],
  author: String,
  readingTime: Number,
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
