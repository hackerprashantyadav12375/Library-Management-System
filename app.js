require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

require('./config/passport')(passport);

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session & Flash Messages
app.use(session({
    secret: 'librarySecret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/users', require('./routes/users'));
app.use('/transactions', require('./routes/transactions'));
app.use('/reports', require('./routes/reports'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
