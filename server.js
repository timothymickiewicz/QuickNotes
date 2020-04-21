// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
let file_content = fs.readFileSync("db.json");
let notes = JSON.parse(file_content)
const uuid = require("uuid");
const CFonts = require("cfonts");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Creating routes to the assets for live server connection
app.use(express.static(__dirname + "/assets/css"));
app.use(express.static(__dirname + "/assets/js"));
app.use(express.static(__dirname));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sends the user to the the index and notes pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "notes.html")));

// Greeting user in the terminal
CFonts.say("Welcome to QuickNotes!", {
    font: "tiny",
    align: "center",
    colors: ["system"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 2,
    space: true,
    maxLength: "22",
    gradient: "red,blue",
    independentGradient: true,
    transitionGradient: false,
    env: "node"
});

// Displays all notes
app.get("/api/notes", (req, res) => res.json(notes));
  
// Create new note
app.post("/api/notes", (req, res) => {
    let note = req.body; 
    let id = uuid.v4(); 
    note.id = `${id}`;
    notes.push(note);
    let contentSendBack = JSON.stringify(notes);
    fs.writeFile("db.json", contentSendBack, (err) => {
        if (err) throw err;
    });
    return res.json(note);
});

// Delete note
app.delete("/api/notes:id", (req, res) => {
    let jsonData = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    // Getting the id that is sent with the request
    let noteID = (req.originalUrl.replace(/\?.*$/, "")).split(":")[1];
    // Matching the requested id with the id from the correct index of the JSON object, then pushing remaining notes into a new array to send back to the JSON file and send back to create the notes list again
    for (let i=0; i<jsonData.length; i++) {
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
app.listen(PORT, () => console.log("Listening on PORT " + PORT));