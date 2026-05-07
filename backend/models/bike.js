import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  name: String,
  brand: String,
  pricePerDay: Number,
  location: String,
  image: String,
  available: { type: Boolean, default: true },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Bike", bikeSchema);