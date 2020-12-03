import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
      bankName: {
            type: String,
            required: true,
      },
      accountName: {
            type: String,
            required: true,
      },
      accountNo: {
            type: String,
            maxlength: 25,
            required: true,
      },
      qrcodeUrl: {
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

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;
