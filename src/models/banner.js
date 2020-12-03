import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      title: {
            type: String,
            required: true,
      },
      description: {
            type: String,
            required: true,
      },
      imageUrl: {
            type: String,
            required: true,
      },
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

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
