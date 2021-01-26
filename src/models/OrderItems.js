import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
      product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
      },
      qualtity: {
            type: Number,
            required: true,
      },
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      },
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;