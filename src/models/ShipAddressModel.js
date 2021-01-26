import mongoose from "mongoose";

const shipAddressSchema = new mongoose.Schema({
        fullname: {
                type: String,
                required: true,
        },
        address: {
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
        country: {
            type: String,
            required: true
        },
        contact: {
                type: String,
                required: true,
        },
        postcode: {
                type: String,
                required: true,
        },
        createdAt: {
                type: Date,
                required: true,
                default: Date.now(),
        },
});

const ShipAddress = mongoose.model("ShipAddress", shipAddressSchema);

export default ShipAddress;
