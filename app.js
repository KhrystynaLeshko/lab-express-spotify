require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
// Route to index(home page)
app.get("/", (req, res) => {
  console.log("this is a home page");
  res.render("index");
});

// Route to artist-search
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Route to albums page
app.get("/albums/:artistId", (req, res) => {
  // .getArtistAlbums() code goes here
  console.log("this is albums search page");
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("The received data from the API for albums: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", data.body);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

// Route to tracks page
app.get("/albums/tracks/:albumID", (req, res) => {
  console.log("this is tracks page");
  const albumID = req.params.albumID;
  console.log(albumID);
  // .getAlbumTracks() code goes here
  spotifyApi
    .getAlbumTracks(albumID, { limit: 5, offset: 1 })
    .then((data) => {
      console.log("The received data from the API for tracks: ", data.body);
      res.render("tracks", data.body);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
