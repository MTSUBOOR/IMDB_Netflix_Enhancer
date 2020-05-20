# IMDB_Netflix_Enhancer
Chrome extension that automatically adds IDMB ratings to Netflix movies and TV-shows, with 0 extra clicks

Netflix is the largest video streaming service in the world, and yet its default "video appraisal method" is terrible.
Netflix used to give an objective star-based rating, aggregated from it's users input. Now it just tries to guess what 
you like. This is why I made the IMDB Netflix Augmenter. It adds IMDB rating data directly in Netflix's DOM, in the
appropriate spots, so you don't have to waste your energy with even a single extra click.

To make it, first I spent a lot of time inspecting Netflix's html, and seeing where they may have stored data I can use
in a database search to extract ratings. However, it turns out (as far as I was able to tell) that the only place where
the name and year of a Netflix video is in sections of the DOM that are initially hidden, until the user tries to access
them. So I decided I would use a Mutation Observer to detect when a user opens a section of the DOM that was previosuly
hidden, and if it has the info I need, I made made a HTTPRequest to the OMDB API (it's pretty much a wrapper on top of
multiple movie databases), and then add it to the info page of the movie/tv-show

This was a really fun project to work on! I had never used a RESTful API, or manipulated the DOM before. I learned alot
about javascript and about how websites are structured, and this project inspired me to learn jQuery! I didn't actually
use it in this project, but since jQuery is great for manipulating the DOM, and I enjoyed doing that, I decided to give
it a whirl, and I ended up using it in the making of this website!

There's lots I still want to do to improve the chrome extension, such as making rating display overtop of all thumbnails
as soon as Netflix loads, and fixing a few minor bugs, for which I've figured out the cause but not resolved yet.
It should be on the chrome store soon (I've submitted it for review), and I hope you enjoy it.

Note: 
There is one pesky bug left to solve. I know the cause, and it doesn't affect the core functionality, but it does make the
user experience a little less convenient. You need to scroll a little bit after expanding the thumbnail to see the scores
(with the exception of the first of the first movie/tv-show in a given row, which may provide a hint as to how to solve it).
Again, it's not a significant bug, you only need to scroll like 1 line, but still I want to make my application as perfect as
it can be.
