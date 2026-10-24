import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    emoji: String,
    rating: { type: Number, default: 4.5 },
    etaMin: Number,
    deliveryFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);
