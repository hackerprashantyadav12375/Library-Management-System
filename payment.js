const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/confirm", async (req, res) => {
    try {
        const { bookId, paymentMethod } = req.body;
        await Book.findByIdAndUpdate(bookId, { status: "Borrowed" });

        res.render("dashboard", { message: "Payment Successful! Book Borrowed." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
