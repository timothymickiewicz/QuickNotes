// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var file_content = fs.readFileSync("db.json");
var notes = JSON.parse(file_content)
var uuid = require('uuid');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Creating routes to the assets for live server connection
app.use(express.static(__dirname + '/assets/css'));
app.use(express.static(__dirname + '/assets/js'));
app.use(express.static(__dirname));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sends the user to the the index and notes pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "notes.html")));

// Displays all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});
  
// Create new note
app.post("/api/notes", function(req, res) {
    var note = req.body; 
    var id = uuid.v4(); 
    note.id = `${id}`;
    notes.push(note);
    var contentSendBack = JSON.stringify(notes);
    fs.writeFile("db.json", contentSendBack, (err) => {
        if (err) throw err;
    });
    res.json(note);
});

// Delete note
app.delete("/api/notes:id", function(req, res) {
    let jsonData = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    // Getting the id that is sent with the request
    let noteID = (req.originalUrl.replace(/\?.*$/, '')).split(':')[1];
    // Matching the requested id with the id from the correct index of the JSON object, then pushing remaining notes into a new array to send back to the JSON file and send back to create the notes list again
    for (var i=0;i<jsonData.length;i++) {
        if (jsonData[i].id === noteID) {
            notes = []
            jsonData.splice(i, 1);
            for (i=0;i<jsonData.length;i++) {
                notes.push(jsonData[i]);
            }
        }
    }
    fs.writeFileSync("db.json", JSON.stringify(notes));
    return res.json(notes);
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});