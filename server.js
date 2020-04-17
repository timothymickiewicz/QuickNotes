// Dependencies
var express = require("express");
var path = require("path");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Notes object
let notes = [
    // {
    //   name: "someone",
    //   info: "info"
    // }
];

// Sends the user to the the index and notes pages
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
  
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

// Displays all notes
app.get("/api/notes", function(req, res) {
    res.json(notes);
});
  
// Create new note
app.post("/api/notes", function(req, res) {
    var note = req.body; 
    console.log(note);
    notes.push(note);
    res.json(note);
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});