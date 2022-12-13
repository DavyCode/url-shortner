require('dotenv').config()      

const express = require("express");
const app = express();
var _invert = require('lodash.invert');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

var DB = {};
var host = "rave.ly/"

app.get("/", (request, response) => {
  response.send("Hello World");
});

function findLongUrl(longUrl) {
  var short = DB[longUrl]
  return short;
}

function findShortUrl(shortUrl) {
  var inverseDB = _invert(DB)
  var short = inverseDB[`${host}${shortUrl}`]
  return short;
}

function generateShortUrl(longUrl) {
  return `${host}${longUrl.substring(4,8)}`
}

// accept user input
app.post("/short", (request, response) => {
  // get input from body
  var longUrl = request.body.url;

  // check if url exist in mem
  var short = findLongUrl(longUrl)

  if (short) {
    return response.send({ data: short})
  }

  // generate short url
  var shortUrl = generateShortUrl(longUrl)

  // save to DB
  DB[longUrl] = shortUrl;

  response.send({ data: shortUrl })
});

app.get("/rave.ly/:id", (request, response) => {
  var shortUrl = request.params.id;
  console.log({ shortUrl: request.params })

  // check if url exist in mem
  var short = findShortUrl(shortUrl)

  if (!short) {
    return response.status(404).send("This url does not exist in our DB")
  }

  response.send(short)
});

app.get("/db", (request, response) => {
  response.send(DB)
});

app.listen(PORT, () => {
  console.log(`[SERVER] Listen on the port ${PORT}....`);
});