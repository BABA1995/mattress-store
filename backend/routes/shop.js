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
      check("lat", "Latitude is required").isFloat(),
      check("lng", "Longitude is required").isFloat(),
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
  
        const { name, address, lat, lng, phone, description } = req.body;
  
        const shop = new Shop({
          owner: req.user.id,
          name,
          address,
          location: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // Longitude first!
          },
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
 * @route   GET /api/shops/nearby
 * @desc    Get nearby shops based on customer location
 * @access  Public
 */
   router.get("/nearby", async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng || !radius) {
            return res.status(400).json({ message: "Latitude, longitude, and radius are required" });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const searchRadius = parseInt(radius); // Radius in meters

        const nearbyShops = await Shop.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distance",
                    spherical: true,
                    maxDistance: searchRadius, // Search within given radius (meters)
                },
            },
        ]);

        res.json(nearbyShops);
    } catch (error) {
        console.error("Error fetching nearby shops:", error);
        res.status(500).json({ message: "Server error" });
    }
});

  
  /**
   * @route   GET /api/shops/:id
   * @desc    Get shop details by ID
   * @access  Public
   */
/**
 * @route   GET /api/shops/:id
 * @desc    Get shop details by ID, including owner and products
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id).populate("owner", "name email");
  
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      // Fetch products related to this shop
      const products = await Product.find({ shop: req.params.id });
  
      res.json({ shop, products }); // Returning both shop details and products
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  /**
 * @route   GET /api/shops/my-shop
 * @desc    Get shop details of logged-in shop owner
 * @access  Private (Only for shop owners)
 */
router.get("/my-shop", auth, async (req, res) => {
    try {
      // Check if the logged-in user is a shop owner
      if (req.user.role !== "shop_owner") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      // Find shop by owner ID
      const shop = await Shop.findOne({ owner: req.user.id });
  
      if (!shop) {
        return res.status(404).json({ message: "No shop found for this owner" });
      }
  
      // Fetch products linked to the shop
      const products = await Product.find({ shop: shop._id });
  
      res.json({ shop, products });
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
