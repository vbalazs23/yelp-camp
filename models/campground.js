const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_200');
});

ImageSchema.virtual('carousel').get(function () {
    return this.url.replace('/upload', '/upload/w_640,h_480,c_fill');
 });

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
],
    time : { type : Number, default: Date.now() }
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...`;
 });

 CampgroundSchema.virtual('sinceCreated').get(function () {
    if (Date.now() - this.time <= 86400000) {
        return "Created less than a day ago"
    
    } else if (Date.now() - this.time > 86400000 && Date.now() - this.time <= 172800000) {
        return  "Created 1 day ago"
    } else {
        const date = Date.now() - this.time
        return `Created ${Math.floor(date / 86400000)} days ago`
    }
 });

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);