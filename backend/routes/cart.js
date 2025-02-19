const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth"); // Middleware for authentication
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private (Customer)
 */
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price shop");

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", items: [], totalPrice: 0 });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private (Customer)
 */
router.post(
  "/",
  auth,
  [
    check("productId", "Product ID is required").not().isEmpty(),
    check("quantity", "Quantity must be at least 1").isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      let cart = await Cart.findOne({ user: req.user.id });

      if (!cart) {
        cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });
      }

      const existingItem = cart.items.find((item) => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/cart
 * @desc    Update item quantity in cart
 * @access  Private (Customer)
 */
router.put(
  "/",
  auth,
  [
    check("productId", "Product ID is required").not().isEmpty(),
    check("quantity", "Quantity must be at least 1").isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ user: req.user.id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find((item) => item.product.toString() === productId);

      if (!item) {
        return res.status(404).json({ message: "Product not in cart" });
      }

      item.quantity = quantity;
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove item from cart
 * @access  Private (Customer)
 */
router.delete("/:productId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private (Customer)
 */
router.delete("/", auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
