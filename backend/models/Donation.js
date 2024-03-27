const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Donation = mongoose.model(
    'Donation',
    new Schema({
        name: {
            type: String,
            required: true
        },
        images: {
            type: Array
        },
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        brand: {
            type: Boolean
        },
        available: {
            type: Boolean
        },
        user: Object,
        adopter: Object
    },
        { timestamps: true }
    ),
);

module.exports = Donation