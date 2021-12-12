const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            // Hardcoded USER ID, should be modified accordingly
            author: '618e87e83e39bc8d4fdf1d3c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium quaerat minima dolorum aliquid. Error, odit rem. Natus impedit nulla quod. Sit nostrum vitae reprehenderit mollitia excepturi unde repellat asperiores accusantium.',
            price,
            geometry: { type: 'Point', 
            coordinates: [ cities[random1000].longitude, 
                           cities[random1000].latitude 
                        ]
               },
            images:  [
                {
                  url: 'https://res.cloudinary.com/dslbg37ro/image/upload/v1638019708/YelpCamp/s9m2e9ly0mabmphadvlo.jpg',
                  filename: 'YelpCamp/s9m2e9ly0mabmphadvlo'
                },
                {
                  url: 'https://res.cloudinary.com/dslbg37ro/image/upload/v1638019710/YelpCamp/tlzidxufqqrzebqxybx9.jpg',
                  filename: 'YelpCamp/tlzidxufqqrzebqxybx9'
                },
                {
                  url: 'https://res.cloudinary.com/dslbg37ro/image/upload/v1638019712/YelpCamp/jd33eu3bv89ejrplwni7.jpg',
                  filename: 'YelpCamp/jd33eu3bv89ejrplwni7'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
}) 