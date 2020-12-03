import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      imageUrl: {
        type: String,
  },
      products: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Product",
            },
      ],
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

const Category = mongoose.model("Category", categorySchema);

export default Category;
