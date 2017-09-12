// Requite the key information
var keys = require("./keys.js");

// Set up Spotify and Twitter requires
var Spotify = require('node-spotify-api');
var Twitter = require("twitter");

// Require moment for managing the bizarre date format of Twitter
var moment = require("moment");

// Require request in order to make calls to OMDB
var request = require("request");

// Require fs in order to do file mamipulation
var fs = require("fs");

// Set up Twitter "client" and Spotify "spotify" references
var client = new Twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
	id: keys.spotifyKeys.client_id,
	secret: keys.spotifyKeys.client_secret
   });

// Which command are we running?
var command = process.argv[2];

// Any arguments?

var titleName = process.argv[3];							// Title is the fourth item in the input, possibly undefined

if (process.argv.length === 3) {							// If the input array is precisely 3 items long...
	if (command === "spotify-this-song") {						// Then if we're Spotifying...
		titleName = "The+Sign%20artist:Ace+of+Base";				// Search for The Sign by Ace of Base.
	}
		else if (command === "movie-this") {						// Unless we're OMDBing...
			titleName = "Mr.+Nobody";								// Then search for Mr. Nobody
		}
}
	else if (process.argv.length > 3) {							// But if the input array is longer than 3...
		for (var i = 4; i < process.argv.length; i++) {				// Then for each item in the input array beyond the 3rd
			titleName = titleName + "+" + process.argv[i];			// Add that to the search title
		}
	}


// Encapsulated function to show tweets
function showTweets() {
	client.get('statuses/user_timeline', function(error, tweets, response) {
		if (!error) {
			for (var i = 0; (i < tweets.length) && (i < 20); i++)
			console.log(tweets[i].text + " (" + moment(tweets[i].created_at, "ddd MMM D HH:mm:ss ZZ YYYY").format("MMMM D, YYYY; h:mm a") + ")");
		}
			else {
				console.log(error);
			}
	});
}


// Encapsulated function to show song information from Spotify
function goSpotify() {
	spotify.request("https://api.spotify.com/v1/search?q=track:"+titleName+"&type=track&market=US")
		.then(function(data) {
			console.log (data.tracks.items[0].name + " is by " +			// The song...
				data.tracks.items[0].artists[0].name + " on the " +			// Is by...
				data.tracks.items[0].album.name + " album");				// on the album
			console.log("Wanna sample?  Try going to " + data.tracks.items[0].preview_url);		// Show preview URL
		})
		.catch(function(err) {
			console.error('Error occurred: ' + err); 
		});
}


// Encapsulated function to show movie information from OMDB
function findMovie() {
	var queryURL = "http://www.omdbapi.com/?t="+titleName+"&y=&plot=short&apikey=40e9cece";
	
	  // Then run a request to the OMDB API with the movie specified
	  request(queryURL, function(error, response, body) {
  
		  // If the request is successful (i.e. if the response status code is 200)
		  if (!error && response.statusCode === 200) {
			  if (JSON.parse(body).Error === "Movie not found!") {
				  console.log("I'm sorry...what movie?");
			  }
				  else {
					  // Parse the body of the site and recover just the imdbRating
					  console.log("Information regarding " + JSON.parse(body).Title + ":");
					  console.log("It came out in " + JSON.parse(body).Year);
					  console.log("The IMDB rating is: " + JSON.parse(body).Ratings[0].Value);
					  console.log("The Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
					  console.log("The country of origin is: " + JSON.parse(body).Country);
					  console.log("The language is: " + JSON.parse(body).Language);
					  console.log("The plot is: " + JSON.parse(body).Plot);
					  console.log("The main actors are: " + JSON.parse(body).Actors);
				  }
		  }	
	  });
}


// Encapsulated function to grab the song information from a file and run it through goSpotify
function fromFile() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		
		// If the code experiences any errors it will log the error to the console.
		if (err) {
			return console.log(err);
		}
		
		// Otherwise, split the entry to get a command and a title
		var dataArr = data.split(",");

		// And then activate the appropriate function...for this case, goSpotify but can handle other commands
		switch (dataArr[0]) {
			case "my-tweets":
		
				showTweets();
				break;
			
			case "spotify-this-song":
		
				titleName = dataArr[1];
				goSpotify();
				break;
			
			case "movie-this":

				titleName = dataArr[1];
				findMovie();
				break;
		}
	});
}

// The actions
switch (command) {
	case "my-tweets":

		showTweets();
		break;
	
	case "spotify-this-song":

		goSpotify();
		break;
	
	case "movie-this":

		findMovie();
		break;
	
	case "do-what-it-says":

		fromFile();
		break;
}