import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    forWho,
    trending,
    rating,
    image,
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      forWho,
      trending,
      rating,
      image,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(`Error in [createProduct] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error in [updateProduct] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error in [deleteProduct] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(`Error in [getAllProducts] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error in [getProductById] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
