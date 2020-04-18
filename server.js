// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var file_content = fs.readFileSync("db.json");
var content = JSON.parse(file_content)
var uuid = require('uuid');
var newData = [];

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;
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
    return res.json(content);
});
  
// Create new note
app.post("/api/notes", function(req, res) {
    var note = req.body; 
    var id = uuid.v4(); 
    note.id = `${id}`;
    content.push(note);
    var contentSendBack = JSON.stringify(content);
    fs.writeFile("db.json", contentSendBack, (err) => {
        if (err) throw err;
        console.log(`${note} written to file`);
    });
    res.json(note);
});

// Delete note
app.delete("/api/notes:id", function(req, res) {
    let jsonData = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    let noteID = (req.originalUrl.replace(/\?.*$/, '')).split(':')[1];
    for (var i=0;i<jsonData.length;i++) {
        if (jsonData[i].id === noteID) {
            jsonData.splice(i, 1);
            newData.push(JSON.stringify(jsonData));
        }
    }
    fs.writeFileSync("db.json", newData);
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});