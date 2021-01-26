import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      desc: {
            type: String,
            required: true,
      },
      locate: {
            type: String,
            required: true,
      },
      contact: {
            type: String,
            required: true,
      },
      logo: {
            type: String,
            required: true,
      },
      products: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Product",
            },
      ],
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const Store = mongoose.model("Store", storeSchema);

export default Store;
