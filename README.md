# liri-node-app
Assignment to practice working with Node.js

This program is a simple string parser to work with three APIs and work with various Node packages.

The program works as follows:

node liri.js [command] [option]
  
The commands are:

1)  movie-this:  This will take the optional string and search for it in OMDB to return:
   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
   
   If no string to search is entered, it will default to "Mr. Nobody."

2)  spotify-this-song:  This will take the optional string and search for it in Spotify to return:
   * Artist
   * Album
   * Preview URL
   
   If no string to search is entered, it will default to "The Sign" by Ace of Base.

3)  my-tweets:  This will gather the tweets for Mike Milligan on Twitter and give their timestamp.

4)  do-what-it-says:  This will read the file, random.txt, and parse it for a command and an option.  In this case, the command is "spotify-this-song."

Node packages used:

* moment (to handle the time information from Twitter)
* node-spotify-api (to get information from Spotify)
* request (to do the AJAX request from OMDB)
* twitter (to get information from Twitter

This exercise could be improved by using the inquirer package to manage input such as to provide a radio list of commands and if the movie or Spotify choices are made, to ask for an argument or to search for the default.
