const http = require('http');
const fs = require('fs');

/* ============================ SERVER DATA ============================ */
let artists = JSON.parse(fs.readFileSync('./seeds/artists.json'));
let albums = JSON.parse(fs.readFileSync('./seeds/albums.json'));
let songs = JSON.parse(fs.readFileSync('./seeds/songs.json'));

let nextArtistId = 2;
let nextAlbumId = 2;
let nextSongId = 2;

// returns an artistId for a new artist
function getNewArtistId() {
  const newArtistId = nextArtistId;
  nextArtistId++;
  return newArtistId;
}

// returns an albumId for a new album
function getNewAlbumId() {
  const newAlbumId = nextAlbumId;
  nextAlbumId++;
  return newAlbumId;
}

// returns an songId for a new song
function getNewSongId() {
  const newSongId = nextSongId;
  nextSongId++;
  return newSongId;
}

/* ======================= PROCESS SERVER REQUESTS ======================= */
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => { // finished assembling the entire request body
    // Parsing the body of the request depending on the "Content-Type" header
    if (reqBody) {
      switch (req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ========================== ROUTE HANDLERS ========================== */

    // Your code here
    if(req.method === "GET" && req.url === "/artists"){
      let output = [];
      for(let obj in artists){
        output.push(artists[obj]);
      }
      const resBody = JSON.stringify(output);
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      return res.end(resBody);
    }
    // artists/:artistID
    if(req.method === "GET" && req.url.startsWith('/artists/')){
      const urlParts = req.url.split('/'); "['/', 'artists', '1']"
      const artistID = urlParts[2]; 
      if(urlParts.length === 3){
        let selected_artist = artists[artistID]; 

        res.statusCode = 200;
        res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify(selected_artist));
      }
    }
    // /artists
    if(req.method === "POST" && req.url === "/artists"){
      let artistId = getNewArtistId();
      const {name} = req.body;
      let artist = {name, artistId};
      artists[artistId] = artist; 

      const resBody = JSON.stringify(artist);
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      return res.end(resBody);
    }

    //edit specificed artists by artist ID, 
    if((req.method === "PUT" || req.method === "PATCH") && req.url.startsWith('/artists/')){
      
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write("Endpoint not found");
    return res.end();
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));