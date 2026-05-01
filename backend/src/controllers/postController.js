// CRUD simple du blog.
import Post from "../models/Post.js";

export async function getPosts(req, res) {
  const items = await Post.find({ published: true }).sort({ createdAt: -1 });
  res.json(items);
}

export async function getPostBySlug(req, res) {
  const item = await Post.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: "Article introuvable" });
  res.json(item);
}
