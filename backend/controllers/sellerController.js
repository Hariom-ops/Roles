import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

// 📊 Seller Dashboard Stats
export const getSellerDashboard = async (req, res) => {
  try {
    const totalBikes = await Bike.countDocuments({
      seller: req.user._id,
    });

    const bikes = await Bike.find({ seller: req.user._id });

    const bikeIds = bikes.map((b) => b._id);

    const totalBookings = await Booking.countDocuments({
      bike: { $in: bikeIds },
    });

    const bookings = await Booking.find({
      bike: { $in: bikeIds },
    });

    const totalRevenue = bookings.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.json({
      totalBikes,
      totalBookings,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📄 Get Seller Profile
export const getSellerProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📦 Get Seller Booking History (Detailed)
export const getSellerBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "bike",
        match: { seller: req.user._id },
      })
      .populate("user", "name email");

    const filtered = bookings.filter((b) => b.bike !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔄 Toggle Bike Availability
export const toggleBikeAvailability = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ msg: "Bike not found" });

    if (bike.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    bike.available = !bike.available;
    await bike.save();

    res.json({
      msg: "Bike availability updated",
      available: bike.available,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};