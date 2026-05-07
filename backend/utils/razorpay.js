import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";

// 🔥 FORCE LOAD ENV (works in ES modules)
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// 🔍 DEBUG
console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("❌ RAZORPAY_KEY_ID missing in .env");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;