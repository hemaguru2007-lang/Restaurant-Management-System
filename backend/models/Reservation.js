const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    tableNumber: {
        type: Number,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    guests: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

});

module.exports =
    mongoose.model("Reservation", reservationSchema);