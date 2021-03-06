import mongoose from "mongoose";

const currentAddressSchema = new mongoose.Schema({
      address1: {
            type: String,
            required: true,
      },
      address2: {
            type: String,
            required: true,
      },
      village: {
            type: String,
            required: true,
      },
      city: {
            type: String,
            required: true,
      },
      province: {
            type: String,
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

const CurrentAddress = mongoose.model("CurrentAddress", currentAddressSchema);

export default CurrentAddress;
