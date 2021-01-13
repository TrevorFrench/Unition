//---------------------------------------
//---------ENVIRONMENT VARIABLES---------
//---------------------------------------
const express = require('express');                                                                   // easier to work with than the HTTP module.
const path = require('path');                                                                         // works with diretories and file paths
var bodyParser = require("body-parser");                                                              // middleware
const app = express();                                                                                // instantiate the module into a variable
const db2 = require('./queries')                                                                       // reference queries.js to interact with postgreSQL database

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60 * 60 * 1000 } /* 1 hour */ }));


//---------------------------------------
//-----------ENVIRONMENT SETUP-----------
//---------------------------------------
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
app.get('/users', db2.getUsers)
app.get('/users/:id', db2.getUserById)
app.post('/users', db2.createUser)
app.put('/users/:id', db2.updateUser)
app.delete('/users/:id', db2.deleteUser)

//---------------------------------------
//----------FUNCTIONAL QUERIES-----------
//---------------------------------------
app.post('/allProjects', db2.selectAll)                                                                // select every project that has been created
app.post('/openProjects', db2.selectOpen)                                                              // select only projects where status = 'Open'
app.post('/inprocessProjects', db2.selectInprocess)                                                    // select only projects where status = 'In-process'

app.post('/openProject', db2.getProject)                                                               // displays individual project information when selected from a table of projects

app.post('/createProject', db2.createProject)	                                                       // renders a form for project creation
app.post('/postProject', db2.postProject)                                                              // posts project from previous form to the database
app.post('/updateProject', db2.updateProject)                                                          // allows users to change attributes of a project (currently only allows status to be changed

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
	 
//---------------------------------------
//-------------LOGIN MODULES-------------
//---------------------------------------
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });