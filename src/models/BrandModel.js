import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      logo: {
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

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
