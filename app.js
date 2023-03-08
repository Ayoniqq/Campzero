// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }

require("dotenv").config();

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const PORT = process.env.PORT || 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const expressError = require("./utils/expressError");
// const expressError = require('./utils/expressError');
// const { campgroundJoiSchema, reviewJoiSchema } = require('./joiSchema');
const Review = require("./models/review");
const campgroundsRoute = require("./routes/campgrounds");
const reviewsRoute = require("./routes/reviews");
const userRoute = require("./routes/users");

const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");
//const helmet = require('helmet');

const dbUrlLocal = "mongodb://127.0.0.1:27017/campzero"; //"mongodb://mongo:fBABCwJ61pTi5YJetAYX@containers-us-west-87.railway.app:6142" //'mongodb://127.0.0.1:27017/campzero';
const dbUrl = process.env.DB_URL || dbUrlLocal;

const multer = require("multer");
const upload = multer();

app.use(multer().array());

//const dotenv = require('dotenv');

//const isLoggedIn = require('middleware');

// const Campground = require('./models/campground'); //Model

/* ---------------<--MONGO DB CONNECTION -->-------------------------*/
const mongoose = require("mongoose");
const Joi = require("joi");
const { findById } = require("./models/campground");
const { Store } = require("express-session");
mongoose.set("strictQuery", true); //Ensure this code comes before Mongoose connection below

//mongoose.connect('mongodb://127.0.0.1:27017/campzero') //, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose
  .connect(dbUrlLocal)
  .then(() => {
    console.log("MONGO DB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("OH NO: MONGO DB ENCOUNTERED ERROR:");
    console.log(err);
  });
/* ---------------<--MONGO DB CONNECTION -->-------------------------*/

app.engine("ejs", ejsMate); //FOR EJS-MATE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

//STORE SESSION IN MONGO
app.use(
  session({
    secret: "mySecret",
    store: MongoStore.create({ mongoUrl: dbUrlLocal }),
    resave: true,
    saveUninitialized: false,
  })
);

//app.use(helmet());

const scriptSrcUrls = [
  "https://getbootstrap.com/",
  "https://cdn.jsdelivr.net",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: [],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", "blob:"],
//         childSrc: ["blob:"],
//         objectSrc: [],
//         imgSrc: [
//             "'self'",
//             "blob:",
//             "data:",
//             "https://res.cloudinary.com/dtahy6q9i/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//             "https://images.unsplash.com/",
//             "https://images.unsplash.com",
//         ],
//         fontSrc: ["'self'", ...fontSrcUrls],
//     },
// })
// );

const secret = process.env.SECRET || "mySecret";

const store = new MongoStore({
  mongoUrl: dbUrlLocal,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("STORE SESSION ERROR", e);
});

//FOR SESSION
const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: true,
  saveUninitialized: true,
  cookies: {
    httpOnly: true,
    //secure: true, //Use this when it is hosted online but diable when on localhost
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//FLASH&USER GLOBAL MIDDLEWARE
app.use((req, res, next) => {
  //console.log('NEW SESSION:', req.session);
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "johndoe@getMaxListeners.com",
    username: "johndoe99",
  });
  const newUser = await User.register(user, "jonny1234");
  res.send(newUser);
});

//ERROR HANDLER
app.all("*", (req, res, next) => {
  next(new expressError("PAGE NOT FOUND", 404));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "OOPS, SOMETHING WENT WRONG";
  res.status(status).render("error", { err });
  //res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT: ${PORT}`);
});
