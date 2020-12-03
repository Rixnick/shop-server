import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
      cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
      },
      totalPrice: {
            type: Number,
            required: true,
      },
      payWith: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bank",
      },
      shipper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      },
      reciever: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      },
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const CheckOut = mongoose.model("CheckOut", checkoutSchema);

export default CheckOut;
