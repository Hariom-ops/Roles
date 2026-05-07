import Bike from "../models/bike.js";

// ➕ Create Bike (Seller)
export const createBike = async (req, res) => {
  try {
    const { name, brand, pricePerDay, location, image } = req.body;

    const bike = await Bike.create({
      name,
      brand,
      pricePerDay,
      location,
      image,
      seller: req.user._id,
    });

    res.status(201).json(bike);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📄 Get All Bikes (Public)
export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find().populate("seller", "name email");
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📄 Get Seller Bikes
export const getSellerBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({ seller: req.user._id });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✏️ Update Bike
export const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ msg: "Bike not found" });

    if (bike.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const updated = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ❌ Delete Bike
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ msg: "Bike not found" });

    if (bike.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await bike.deleteOne();

    res.json({ msg: "Bike removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};