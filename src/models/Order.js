import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [{ food: mongoose.Schema.Types.ObjectId, name: String, price: Number, qty: Number }],
    address: { type: String, required: true },
    payment: { type: String, enum: ["card", "cash", "wallet"], default: "card" },
    total: Number,
    status: {
      type: String,
      enum: ["placed", "preparing", "picked_up", "on_the_way", "delivered"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
