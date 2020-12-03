import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
      type: {
            type: String,
            required: true,
      },
      contactNo: {
            type: String,
            required: true,
      },
      conditionEmail1: {
            type: String,
            required: true,
      },
      conditionEmail2: {
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

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
