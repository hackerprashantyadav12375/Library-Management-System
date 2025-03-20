const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
    session({
        secret: "library-secret",
        resave: false,
        saveUninitialized: true,
    })
);

// Routes
app.use("/books", require("./routes/books"));
app.use("/payment", require("./routes/payment"));

// Login Page
app.get("/", (req, res) => res.render("index", { error: null }));

// Redirect dashboard to books list
app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/");
    res.redirect("/books");
});

// Login Authentication
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        req.session.user = username;
        return res.redirect("/dashboard");
    }

    res.render("index", { error: "Invalid Credentials" });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
