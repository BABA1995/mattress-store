const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, unique: true },
    plan: { type: String, enum: ["Silver", "Gold", "Platinum", "Diamond"], required: true },
    price: { type: Number, required: true },
    visibilityRadius: { type: Number, required: true }, // km
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
