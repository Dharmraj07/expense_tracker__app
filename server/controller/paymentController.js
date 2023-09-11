const { verifyToken } = require("../middlewares/authenticateUser");

const Razorpay = require("razorpay");
const User = require("../models/userModel");

require("dotenv").config();

const instance = new Razorpay({
  key_id: process.env.raz_keyid,
  key_secret: process.env.raz_secret,
});

async function createPayment(req, res) {
  const { amount } = req.body;

//   const userId = req.user.id;
  const userId=req.authData.id;


  try {
    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    });

    // const user = await User.findByPk(userId);
    const user=await User.findOne({ _id: userId});

    user.isPremium = true;
    await user.save();

    res.status(201).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Payment failed",
    });
  }
}

module.exports = createPayment;