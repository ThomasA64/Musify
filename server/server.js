const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyricsFinder");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlendcoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "560be18774c949d18a483c954297ae79",
    clientSecret: "37c1a6713502425fbcab3585bdbccb83",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "560be18774c949d18a483c954297ae79",
    clientSecret: "37c1a6713502425fbcab3585bdbccb83",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Found";
  res.json({ lyrics });
});

app.listen(3001);
console.log("app listening on port 3001");
