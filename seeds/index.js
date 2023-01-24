const Campground = require('../models/campground'); //Model
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
/* ---------------<--MONGO DB CONNECTION -->-------------------------*/
const mongoose = require('mongoose');
mongoose.set('strictQuery', true); //Ensure this code comes before Mongoose connection below

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp') //, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO DB CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("OH NO: MONGO DB ENCOUNTERED ERROR:");
        console.log(err);
    })
/* ---------------<--MONGO DB CONNECTION -->-------------------------*/

const rand = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 10;
        const camp = new Campground({
            author: '63bcd17ede397c8f0a2de249',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
                type: "Point"
            },
            title: `${rand(descriptors)}, ${rand(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dtahy6q9i/image/upload/v1673616397/YelpCamp/fuukpl8mjscubcghb6vi.jpg',
                    filename: 'YelpCamp/fuukpl8mjscubcghb6vi',
                },
                {
                    url: 'https://res.cloudinary.com/dtahy6q9i/image/upload/v1673616399/YelpCamp/djwie7ddkjn4jbwsktd4.jpg',
                    filename: 'YelpCamp/djwie7ddkjn4jbwsktd4',
                }
            ],
            // image: 'https://images.unsplash.com/photo-1504111592-def582de71ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=812&q=80',
            description: "The very description that would describe what this is about",
            price: price

        })
        await camp.save();
    }

}
seedDB()
    .then(() => {
        mongoose.connection.close(); //closes db connection
    })