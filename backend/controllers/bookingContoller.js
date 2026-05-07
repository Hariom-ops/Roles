import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
export const verifyPayment = async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			bookingId, // 👈 IMPORTANT
		} = req.body;

		const sign = razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		const booking = await Booking.findById(bookingId);

		if (!booking) {
			return res.status(404).json({ msg: "Booking not found" });
		}

		if (expectedSign === razorpay_signature) {
			booking.paymentId = razorpay_payment_id;
			booking.orderId = razorpay_order_id;
			booking.paymentStatus = "paid";
			booking.status = "confirmed";

			await booking.save();

			res.json({ success: true });
		} else {
			booking.paymentStatus = "failed";
			await booking.save();

			res.status(400).json({ success: false });
		}
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

// 💰 Create Payment Order
export const createOrder = async (req, res) => {
	try {
		const { amount } = req.body;

		const options = {
			amount: amount * 100, // paise
			currency: "INR",
			receipt: "order_rcptid_" + Date.now(),
		};

		const order = await razorpay.orders.create(options);

		res.json(order);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};
// 📅 Create Booking (User)
export const createBooking = async (req, res) => {
	try {
		const { bikeId, startDate, endDate } = req.body;

		const bike = await Bike.findById(bikeId);

		const days =
			(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

		const totalPrice = days * bike.pricePerDay;

		const booking = await Booking.create({
			user: req.user._id,
			bike: bikeId,
			startDate,
			endDate,
			totalPrice,
			paymentStatus: "pending",
		});

		res.status(201).json(booking);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

// 📄 User Bookings
export const getUserBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user._id }).populate(
			"bike",
		);
		res.json(bookings);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

// 📄 Seller Bookings
export const getSellerBookings = async (req, res) => {
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

// ❌ Cancel Booking
export const cancelBooking = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id);

		if (!booking) return res.status(404).json({ msg: "Booking not found" });

		if (booking.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ msg: "Unauthorized" });
		}

		booking.status = "cancelled";
		await booking.save();

		res.json({ msg: "Booking cancelled" });
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};
