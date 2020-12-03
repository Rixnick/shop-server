import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
      firstname: {
            type: String,
            required: true,
      },
      lastname: {
            type: String,
            required: true,
      },
      birthdate: {
            type: Date,
            required: true,
      },
      age: {
            type: Number,
      },
      gender: {
            type: String,
            required: true,
      },
      mentalStatus: {
            type: String,
            required: true,
      },
      profileImage: {
            type: String,
            required: true,
      },
      coverImage: {
            type: String,
            required: true,
      },
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
      },
      createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
      },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
