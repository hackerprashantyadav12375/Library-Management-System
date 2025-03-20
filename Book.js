const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String, enum: ["Available", "Borrowed"], default: "Available" },
    issueDate: { type: Date },  // Store issue date
    returnDate: { type: Date }  // Store return date
});

module.exports = mongoose.model("Book", bookSchema);
