const express = require("express");
const Subscription = require("../models/Subscription");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/subscriptions
// @desc    Create a new subscription for a shop
// @access  Private (Only shop owners)
router.post("/", auth, async (req, res) => {
    try {
        const { shopId, plan, price, visibilityRadius, endDate } = req.body;

        // Check if the shop already has a subscription
        let existingSubscription = await Subscription.findOne({ shop: shopId });
        if (existingSubscription) {
            return res.status(400).json({ message: "Subscription already exists for this shop" });
        }

        const newSubscription = new Subscription({
            shop: shopId,
            plan,
            price,
            visibilityRadius,
            endDate
        });

        await newSubscription.save();
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/subscriptions/:shopId
// @desc    Get subscription details of a shop
// @access  Public
router.get("/:shopId", async (req, res) => {
    try {
        const { shopId } = req.params;
        const subscription = await Subscription.findOne({ shop: shopId });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.json(subscription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/subscriptions/:shopId
// @desc    Update a shop's subscription
// @access  Private (Only shop owners)
router.put("/:shopId", auth, async (req, res) => {
    try {
        const { plan, price, visibilityRadius, endDate } = req.body;
        const { shopId } = req.params;

        let subscription = await Subscription.findOneAndUpdate(
            { shop: shopId },
            { plan, price, visibilityRadius, endDate },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.json(subscription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
