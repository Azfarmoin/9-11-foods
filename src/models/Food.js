import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    emoji: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.models.Food || mongoose.model("Food", FoodSchema);
