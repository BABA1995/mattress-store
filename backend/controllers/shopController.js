const Shop = require('../models/Shop');
const mongoose = require("mongoose");

// Get shop by owner ID
const getShopByOwnerId = async (req, res) => {
    try {
        const { ownerId } = req.params;

                // Convert ownerId to ObjectId
        const objectId = new mongoose.Types.ObjectId(ownerId);

        const shop = await Shop.findOne({ owner: objectId });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.status(200).json(shop);
    } catch (error) {
        console.error('Error fetching shop by ownerId:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getShopByOwnerId };
    