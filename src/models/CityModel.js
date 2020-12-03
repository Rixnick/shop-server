import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      villages: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Village",
            },
      ],
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const District = mongoose.model("District", districtSchema);

export default District;
