const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// 📌 Get all books (SHOW IN DASHBOARD)
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.render("dashboard", { books }); // Send books to dashboard.ejs
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Add a New Book
router.post("/add", async (req, res) => {
    try {
        const newBook = new Book({ title: req.body.title, author: req.body.author });
        await newBook.save();
        res.redirect("/books"); // Redirect back to dashboard
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Delete a Book
router.get("/delete/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect("/books");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Borrow a Book (Change Status)
router.get("/borrow/:id", async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, { status: "Borrowed" });
        res.redirect("/books");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Return a Book (Change Status)
router.get("/return/:id", async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, { status: "Available", issueDate: null, returnDate: null });
        res.redirect("/books");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/borrow/:id", async (req, res) => {
  try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).send("Book not found");

      // Redirect user to payment page before confirming borrow
      res.render("payment", { book });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
// dates
router.get("/borrow/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send("Book not found");

        res.render("payment", { book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Handle Payment & Issue Date
// Borrow a book
router.get("/borrow/:id", async (req, res) => {
    try {
        const bookId = req.params.id;
        const currentDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(currentDate.getDate() + 14); // Set return date to 14 days from now

        await Book.findByIdAndUpdate(bookId, {
            status: "Borrowed",
            issueDate: currentDate,
            returnDate: returnDate
        });

        res.redirect("/dashboard"); // Redirect to the dashboard after borrowing
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Return a book
router.get("/return/:id", async (req, res) => {
    try {
        const bookId = req.params.id;

        await Book.findByIdAndUpdate(bookId, {
            status: "Available",
            issueDate: null,
            returnDate: null
        });

        res.redirect("/dashboard"); // Redirect to the dashboard after returning
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 
// 📌 Borrow a Book (Redirect to Payment Page)
router.get("/borrow/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send("Book not found");

        // Render the payment page
        res.render("payment", { book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Handle updating the issue or return date of a book
router.post('/books/update-date/:id', async (req, res) => {
    try {
        const { issueDate, returnDate } = req.body;
        const updateData = {};

        if (issueDate) updateData.issueDate = issueDate;
        if (returnDate) updateData.returnDate = returnDate;

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.json({ success: true, book: updatedBook });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});





module.exports = router;
