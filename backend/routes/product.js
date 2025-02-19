const express = require("express");
const mongoose = require('mongoose');
const { check, validationResult } = require("express-validator");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const Shop = require("../models/Shop");

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product (Only shop owners)
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
    try {
        const { name, description, price, sizeType, standardSize, customSize, clothType, cottonType, images } = req.body;
        // const shopId = mongoose.Types.ObjectId(req.body.shop);
        const shopId = mongoose.Types.ObjectId.createFromHexString(req.body.shop);
        const shop = await Shop.findById(shopId);
        // Check if the shop exists & belongs to the user
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        if (shop.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to add products to this shop" });
        }
        
        // Create Product
        const product = new Product({
            name,
            description,
            price,
            sizeType,
            standardSize,
            customSize,
            clothType,
            cottonType,
            images,
            shop: shopId,  // Assign Shop
            owner: req.user.id,  // Assign Owner
        });
        
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get("/", async (req, res) => {
    try {
        const { shopId, owner } = req.query;
        
        let query = {};
        if (shopId) query.shop = shopId;
        if (owner) query.owner = owner;
        
        const products = await Product.find(query)
            .populate("shop", "name")
            .populate("owner", "name email");
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product details by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id)
            .populate("owner", "name email") // Populate owner details
            .populate("shop", "name location"); // Populate shop details
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product details (Only owner)
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, sizeType, standardSize, customSize, clothType, cottonType, images } = req.body;
        
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Ensure the user is the shop owner who created the product
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this product" });
        }
        
        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.sizeType = sizeType || product.sizeType;
        product.standardSize = standardSize || product.standardSize;
        product.customSize = customSize || product.customSize;
        product.clothType = clothType || product.clothType;
        product.cottonType = cottonType || product.cottonType;
        product.images = images || product.images;
        
        await product.save();
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (Only owner)
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Ensure the user is the shop owner who created the product
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }
        
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
