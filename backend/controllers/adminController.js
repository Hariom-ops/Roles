import User from "../models/User.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

// 👥 Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🚫 Ban User / Seller
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ msg: "User status updated", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🏍️ Get All Bikes
export const getAllBikesAdmin = async (req, res) => {
  try {
    const bikes = await Bike.find().populate("seller", "name email");
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ❌ Delete Any Bike
export const deleteBikeAdmin = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ msg: "Bike not found" });

    await bike.deleteOne();

    res.json({ msg: "Bike deleted by admin" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📦 Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("bike");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};