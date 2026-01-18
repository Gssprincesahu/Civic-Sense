
import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    imagePublicId: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    zipCode: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    coordinates: {
        type: {
            lat: Number,
            lng: Number
        },
        required: false,
    },
}, {
    timestamps: true
});

const Data = mongoose.model("Data", dataSchema);

export default Data;