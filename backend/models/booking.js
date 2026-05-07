import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },

    startDate: Date,
    endDate: Date,
    totalPrice: Number,

    // 🔥 NEW FIELDS
    paymentId: String,
    orderId: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);