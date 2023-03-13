# yelp-camp
[See it hosted here](https://yelp-camp-d1uk.onrender.com/)<br>
This was the final, full-stack project of my online web development course. It's inspired by Yelp (hence the name) and has quite a few features.<br>
It uses Node.js, Express and MongoDB for storage.
### Functionality: 
- You can create an account.(If you want to try it out, you can use a fake e-mail address, there is no confirmation process)
- Sign in.
- Create campgrounds. 
- Rate campgrounds. 
- Upload pictures of campgrounds to Cloudinary.
- View added campgrounds using Mapbox.
### Bugfixes that I have added to the project after finishing the course: 
- One user can add only one rating to a single campground. 
- Users can't rate their own campgrounds.
- Limited the number of pictures users can upload to campgrounds. (If limit is reached upload is disabled with a message shown.)
- Deleting images from cloudinary when deleting a campground.
- Fixed an issue with pictures bugging out from the image carousel in the campground show page.
- The "Created xy days ago" block in the bottom of the campground card on the campground show page
shows real data (added an actual counting script)
- Made the show page responsive.
- Created a grid for the campgrounds page instead of a simple list.

