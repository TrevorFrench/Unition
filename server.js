//---------------------------------------
//---------ENVIRONMENT VARIABLES---------
//---------------------------------------
const express = require('express');                                                                   // easier to work with than the HTTP module.
const path = require('path');                                                                         // works with diretories and file paths
var bodyParser = require("body-parser");                                                              // middleware
const app = express();                                                                                // instantiate the module into a variable
const db = require('./queries')                                                                       // reference queries.js to interact with postgreSQL database

//---------------------------------------
//-------------LOGIN MODULES-------------
//---------------------------------------
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
  
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
//---------------------------------------
//-----------ENVIRONMENT SETUP-----------
//---------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.set("port", (process.env.PORT || 5000));                                                          // sets the port to 5000
app.use(express.static(path.join(__dirname, '')));                                                    // this allows js and css files to be linked to the HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));                         // when the root directory loads, send the index.html file to the client

app.post('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));                        // maybe not necessary - but handles a post request for home page

app.listen(app.get("port"), function () {                                                             // listens on the port and displays a message to the console
	console.log("Now listening for connection on port: " + app.get("port"));
});

//---------------------------------------
//------------GENERIC QUERIES------------
//---------------------------------------
/*  These queries exist temporarily for
    reference and will ultimately be 
    deleted                            */
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

//---------------------------------------
//----------FUNCTIONAL QUERIES-----------
//---------------------------------------
app.post('/allProjects', db.selectAll)                                                                // select every project that has been created
app.post('/openProjects', db.selectOpen)                                                              // select only projects where status = 'Open'
app.post('/inprocessProjects', db.selectInprocess)                                                    // select only projects where status = 'In-process'

app.post('/openProject', db.getProject)                                                               // displays individual project information when selected from a table of projects

app.post('/createProject', db.createProject)	                                                      // renders a form for project creation
app.post('/postProject', db.postProject)                                                              // posts project from previous form to the database
app.post('/updateProject', db.updateProject)                                                          // allows users to change attributes of a project (currently only allows status to be changed

app.post('/adminPage', (req, res) => 
	res.render("dashboard.ejs", 
		{statusMessage: 
			"<form action='/users' method='post'><input type='submit' value='PSQL CHANGES'></form>"   // renders a page which is used for administration
		})); 

//---------------------------------------
//--------------ACTION LIST--------------
//---------------------------------------
/* - Escape apostrophes/quotaion marks in
     SQL queries
   - Create a "filter" page
   - Develop "User" table and let it feed
     into a drop-down on projects
   - Develop "Status" table and let it 
     feed into a drop-down on projects
   - Create login functionality that 
     links to the User table
   - Make a new landing page for 
     successful database connections
   - Update the admin query/call
   - Format the project creation screen 
   - Build out Graphs page with Charts.js
   - Build a "Comments" table
   - Create functionality that adds a 
     comment every time an update is made 
	 to a project
   - Protect the Admin page
   - Create an external script for 
     functions
   - Order tables by due date
   - Description box to text area
   - If a column has a NOT NULL restraint,
     make the form element required     */