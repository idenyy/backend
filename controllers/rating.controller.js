import Product from "../models/product.model.js";
import Rating from "../models/rating.model.js";

export const addOrUpdateRating = async (req, res) => {
  const { productId, userId, rating } = req.body;

  try {
    let userRating = await Rating.findOne({ productId, userId });

    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = new Rating({ productId, userId, rating });
      await userRating.save();
    }

    const ratings = await Rating.find({ productId });
    const globalRating =
      ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

    const product = await Product.findByIdAndUpdate(
      productId,
      { rating: globalRating },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Rating updated", globalRating: product.rating });
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error });
  }
};

export const getProductRating = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const ratings = await Rating.find({ productId });
    res.status(200).json({ globalRating: product.rating, ratings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};
