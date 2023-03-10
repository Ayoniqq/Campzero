const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

/* ---------------<--MONGO DB CONNECTION -->-------------------------*/
const mongoose = require("mongoose");
const DB_URL = process.env.MONGOURI || "mongodb://127.0.0.1:27017/campzero";
mongoose.set("strictQuery", true); //Ensure this code comes before Mongoose connection below

//mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp') //, { useNewUrlParser: true, useUnifiedTopology: true })
const connectDB = async () => {
  await mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MONGO DB CONNECTION OPEN");
    })
    .catch((err) => {
      console.log("OH NO: MONGO DB ENCOUNTERED ERROR:");
      console.log(err);
      //process.exit(1);
    });
};
/* ---------------<--MONGO DB CONNECTION -->-------------------------*/

module.exports = connectDB;
