import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
      },
      items: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "OrderItem",
            }
      ],
    //   ships: [
    //         {
    //               type: mongoose.Schema.Types.ObjectId,
    //               ref: "shipAddress",
    //         },
    //   ],
    //   paymentMethod: {
    //         type: String,
    //         required: true,
    //   },
    //   itemsPrice: {
    //         type: Number,
    //         required: true,
    //   },
    //   shipPrice: {
    //         type: Number,
    //         required: true,
    //   },
    //   taxPrice: {
    //         type: Number,
    //         required: true,
    //   },
    //   totalPrice: {
    //         type: String,
    //         required: true,
    //   },
    //   isPaid: {
    //         type: Boolean,
    //         default: false,
    //   },
    //   paidAt: {
    //         type: Date,
    //         default: false,
    //   },
    //   isDelivered: {
    //         type: Boolean,
    //         default: false,
    //   },
    //   deliveredAt:{
    //       type: Date
    //   }, 
    //   createdAt: {
    //         type: Date,
    //         required: true,
    //         default: Date.now(),
    //   },
}, { timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;
