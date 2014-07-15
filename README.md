# Altrove

## Our team

The [TotesProfesh](http://totesprofe.sh) team at GovHack 2014 featured:

- [Jonny Scholes](https://github.com/joshgillies)

- [Josh Gillies](https://github.com/jonnyscholes)

- [Matt McKellar-Spence](https://github.com/MattMS)


## Skills

With our broad range of skills, interests, and talents, we were
able to work on different areas of the app concurrently.
Our overlapping knowledge makes joining all the components easier too.

Jonny focused his talent for design and user experience.
Being a skilled developer also allows him to navigate the technical
limitations of design choices.

Matt spends his time in the massive server and database world.
He plans models and creates APIs that expose the data efficiently.

Josh is a jack-of-all-trades, optimizing the connection between the user
and server.
His passion for JavaScript and Node.js is the glue that holds everything
together.


## Conception

Having various friends studying history and other subjects at UTAS
provided us with many opinions on the strengths and weaknesses of the
current Trove homepage.

The general opinion is that although it contains an amazing amount of
information, it is difficult for new users to find what they are looking
for.


## Agile development

We all have experience with the Agile methodology of project management,
which we used to plan and execute our ideas effectively.


### Trello

We made extensive use of [Trello](https://trello.com/) for planning and
managing tasks.

Ideas from users and ourselves were captured in story form.
"As a {user} I want {desired feature} so that {improvement gained}".

We also used cards for storing notes and even our expenses over the
weekend.


## Previous research

We each had a look over the current Trove homepage to learn how it is used.
We studied what their API provided and, just as importantly, what it
lacked.


## Development tools

The general preference of the team was to use a NoSQL database to store and process data.
We all have experience with Redis, CouchDB/PouchDB, and LevelDB.

We settled on the CouchDB/PouchDB combination because of the simplicity of storing data via JSON documents and it's incredibly flexible RESTful interface.

We managed our code in local Git repos and pushed to GitHub, where we could
pull each others changes from.


## Main goals

It was essential to preserve the existing functionality of the site,
suitable for experienced users, but the home page needed to be welcoming
to new users too.


### Dynamic background

The massive amount of data, particularly pictures, is not exposed on the
home page.
We thought that Trove was not selling itself as well as it could.

Displaying a background of random images from Trove gives new users some
insight into what they can discover.


### Autocomplete

The most requested feature from users was autocomplete suggestions based
on past searches of other users.

Trove currently provides a page that lists recent searches, so we knew
the information was available, but it was not in a form that was very
useful to users.


### Saved searches

Another feature requested by many users was the ability to remember
their previous searches.


### Advanced search

Use of the existing advanced search form revealed it contained broken
controls.

Because we wanted to expose the advanced search to power users, we
needed to find the problems and then attempt to fix them in our form.


## Our progress

### Friday

To ensure that we could collect as many search terms as possible, one
of the first steps was building a web scraper that would grab all the
searches from the recent searches page and store it in a database.

We managed to build this quickly, and start collecting data, but we
worked late into the night setting it up as an automatic process.


### Saturday

Matt got the random pictures API delivering pictures.

Jonny was able to implement the design and store previous searches in
the browser.

At the end of the day, we were all confident that we had a working
product that we could deliver as is.

This was great because it allowed us to focus on refining the features
we had implemented and experiment with some of the future ideas.


### Sunday

We left this documentation and the video until Sunday afternoon.


## Future goals

During our planning meetings and also during development, we had many
ideas of interesting features that we wanted to implement.

To ensure we were able to deliver a working product at the end of the
weekend, we were forced to primarily focus on the essential features.


### Timeline

One of our first ideas was to have a timeline at the bottom of the
screen that could be used to display and navigate records on a
particular theme.


### Mobile and tablet support

The page was designed to be used on standard desktop sizes (wider than
1300 pixels).

Unfortunately the design does not currently scale down to suit the
smaller screens on mobiles, tablets or netbooks.


### Hide features

We were so impressed at how the images in the background looked that we
felt it would be really cool if users could hide the other controls and
just view the images.


## API

### /autocomplete?query=Tas

	{
		"results": [
			"Hackers in Tasmania",
			"This day in Tassie"
		]
	}


### /random/pictures.json

Returns an array of images thumbnails and links to the records on Trove.

	[
		{
			i: 'http://example.com/thumbnail1.jpg',
			l: 'http://trove.nla.gov.au/work/1234'
		},
		{
			i: 'http://example.com/thumbnail2.jpg',
			l: 'http://trove.nla.gov.au/work/5678'
		}
	]
