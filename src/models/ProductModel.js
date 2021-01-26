import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
            trim: true,
      },
      description: {
            type: String,
            required: true,
            trim: true,
      },
      price: {
            type: Number,
            required: true,
      },
      stockqty: {
        type: Number,
        required: true,
  },
      imageUrl: {
            type: String,
            required: true,
      },
      brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
      },
      category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
      },
      detail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Detail",
      },
      tags: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Tag",
            },
      ],
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
      },
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
