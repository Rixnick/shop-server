import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
            type: String,
            required: true,
    },
    email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
    },
    password: {
            type: String,
            required: true,
            trim: true,
    },
    resetPasswordToken: {
            type: String,
    },
    resetPasswordTokenExpiry: {
            type: Number,
    },
    brands: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Brand",
            },
    ],
    categories: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Category",
            },
      ],
    banners: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Banner",
            },
    ],
    products: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Product",
            },
    ],
    carts: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Cart",
            },
    ],
    orders: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Order",
            },
    ],
    cards: [
            {
                  id: String,
                  cardInfo: {
                        id: String,
                        expiration_month: Number,
                        expiration_year: Number,
                        brand: String,
                        last_digits: String
                  },
            },
    ],
    contact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact",
    },
    profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
    },
    currentAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CurrentAddress",
    },
    hometownAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HometownAddress",
    },
    bankAccounts: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Bank",
            },
    ],
    createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
    },
});

const User = mongoose.model("User", userSchema);

export default User;
