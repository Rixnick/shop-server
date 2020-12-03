import mongoose from "mongoose";

const villageSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const Village = mongoose.model("Village", villageSchema);

export default Village;
