const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Shop = require("../models/Shop");
const auth = require("../middleware/auth"); // ✅ Use existing auth middleware

// @route   POST /api/shops
// @desc    Create a new shop (Only for shop owners)
// @access  Private
router.post(
    "/",
    auth,
    [
      check("name", "Shop name is required").not().isEmpty(),
      check("address", "Address is required").not().isEmpty(),
      check("location", "Location is required").not().isEmpty(),
      check("phone", "Phone number is required").not().isEmpty(),
    ],
    async (req, res) => {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        // Only allow shop owners to create shops
        if (req.user.role !== "shop_owner") {
          return res.status(403).json({ message: "Access denied" });
        }
  
        const { name, address, location, phone, description } = req.body;
  
        const shop = new Shop({
          owner: req.user.id,
          name,
          address,
          location,
          phone,
          description,
        });
  
        await shop.save();
        res.status(201).json({ message: "Shop created successfully", shop });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  
  /**
   * @route   GET /api/shops
   * @desc    Get all shops
   * @access  Public
   */
  router.get("/", async (req, res) => {
    try {
      const shops = await Shop.find().populate("owner", "name email");
      res.json(shops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  /**
   * @route   GET /api/shops/:id
   * @desc    Get shop details by ID
   * @access  Public
   */
  router.get("/:id", async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id).populate("owner", "name email");
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  /**
   * @route   PUT /api/shops/:id
   * @desc    Update shop details (Only owner)
   * @access  Private
   */
  router.put("/:id", auth, async (req, res) => {
    try {
      let shop = await Shop.findById(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      // Only owner can update
      if (shop.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: "Shop updated successfully", updatedShop });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  /**
   * @route   DELETE /api/shops/:id
   * @desc    Delete a shop (Only owner)
   * @access  Private
   */
  router.delete("/:id", auth, async (req, res) => {
    try {
      let shop = await Shop.findById(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      // Only owner can delete
      if (shop.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      await Shop.findByIdAndDelete(req.params.id);
      res.json({ message: "Shop deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
