if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const local_auth = require('passport-local')
const session = require('express-session');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const mongoSanitize = require('express-mongo-sanitize');



const dbUrl = process.env.DB_URL || 'mongodb+srv://endeavor:endeavor@cluster0.wenlh.mongodb.net/cloudify?retryWrites=true&w=majority';
mongoose.connect(dbUrl)
//const dbUrl = process.env.DB_URL ;
//mongoose.connect("mongodb://mongo:27017/Cloudify")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
})
const app = express();

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
//////////////////////////////////////////////
passport.use(new local_auth(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', userRoutes);
app.use('/games', gameRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})