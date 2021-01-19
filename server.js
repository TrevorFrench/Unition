//-----------------------------------------------------------------
//---------------------------ACTION LIST---------------------------
//-----------------------------------------------------------------
/* - Create a "filter" page
   - Develop "Status" table and feed into a drop-down on projects
   - Make a new landing page for successful database connections
   - Update the admin query/call
   - Format the project creation screen 
   - Build out Graphs page with Charts.js
   - Build a "Comments" table
   - Add comment every time an update is made to a project
   - Protect the Admin page
   - Create an external script for functions
   - Order tables by due date
   - If column has NOT NULL, make form element required
   - Error handling
   - Create a public forms directory
   - Get rid of index.html           
   - Make menus drop onclick for phones
   - Update testTest nameing conventions
   - Be able to navigate to projects directly with a URL
   - Display limit on description in the table
   - Make admin page with an open box for SQL
   - Search box for Ticket ID on home page (all pages?)                       
   - Default Responsible box to current user/ create search box
*/

//-----------------------------------------------------------------
//----------------------ENVIRONMENT VARIABLES----------------------
//-----------------------------------------------------------------
const express = require('express');                                 // easier to work with than the HTTP module.
const path = require('path');                                       // works with diretories and file paths
var bodyParser = require("body-parser");                            // middleware
const app = express();                                              // instantiate the module into a variable
const db2 = require('./queries')                                    // reference queries.js to interact with postgreSQL database
var passport = require('passport');									// login framework
var Strategy = require('passport-local').Strategy;					// method which is used within the login framework
var db = require('./db');											// folder which contains database files

//-----------------------------------------------------------------
//------------------------ENVIRONMENT SETUP------------------------
//-----------------------------------------------------------------
app.use(bodyParser.json());                                         // not sure exactly what this is used for
app.set('views', __dirname + '/public/views');                      // sets filepath for view rendering
app.set('view engine', 'ejs');                                      // sets the view engine to 'ejs'

app.use(require('morgan')('combined'));                             // Use application-level middleware for common functionality, including
app.use(bodyParser.urlencoded({ extended: true }));                 // logging, parsing, and session handling.

app.use(require('express-session')
	({  secret: 'keyboard cat', 
		resave: false, 
		saveUninitialized: true, 
		cookie: { maxAge: 60 * 60 * 1000 }							// 1 hour cookie
	})
);

app.set("port", (process.env.PORT || 5000));                        // sets the port to 5000
app.use(express.static(path.join(__dirname, '')));                  // this allows js and css files to be linked to the HTML

app.listen(app.get("port"), function () {                           // listens on the port and displays a message to the console
	console.log("Now listening on port: " + app.get("port"));
});

//-----------------------------------------------------------------
//--------------------------LOGIN MODULES--------------------------
//-----------------------------------------------------------------

passport.use(new Strategy(											// Configure the local strategy for use by Passport.
	function(username, password, cb) {								
	  db.users.findByUsername(username, function(err, user) {		// The local strategy require a `verify` function which receives the credentials
	    if (err) { return cb(err); }								// (`username` and `password`) submitted by the user.  The function must verify
		if (!user) { return cb(null, false); }						// that the password is correct and then invoke `cb` with a user object, which
		if (user.password != password) { return cb(null, false); }	// will be set at `req.user` in route handlers after authentication.
		return cb(null, user);
	  });
	}
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {							// In order to restore authentication state across HTTP requests, Passport needs
	cb(null, user.id);												// to serialize users into and deserialize users out of the session.  The
});																	// typical implementation of this is as simple as supplying the user ID when
																	// serializing, and querying the user record by ID from the database when
passport.deserializeUser(function(id, cb) {							// deserializing.
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

app.use(passport.initialize());										// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.session());
 
//-----------------------------------------------------------------
//-----------------------FUNCTIONAL QUERIES------------------------
//-----------------------------------------------------------------

app.post('/openProjects', 											// select only projects where status = 'Open'
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectOpen
	)

app.post('/inprocessProjects', 										// select only projects where status = 'In-process'
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectInprocess
	)

app.post('/allProjects', 											// select every project that has been created
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectAll
	)

app.post('/openProject', 											// displays individual project information when selected from a table of projects
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.getProject
	)

app.post('/createProject', 											// renders a form for project creation
	require('connect-ensure-login').ensureLoggedIn(), 
	db.users.createProject2
	)
	
app.post('/postProject', 											// posts project from previous form to the database
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.postProject
	)
	
app.post('/updateProject', 											// allows users to change attributes of a project (currently only allows status to be changed
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.updateProject
	)
	
app.post('/myProjects', 												// My projects?
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectMyProjects
	)

//-----------------------------------------------------------------
//-----------------------------ROUTES------------------------------
//-----------------------------------------------------------------
app.post('/adminPage', 												// renders a page which is used for administration
	require('connect-ensure-login').ensureLoggedIn(), 
	(req, res) => 
		res.render("dashboard.ejs", 
			{statusMessage: 										// form that executes the users query when submitted
				"<form action='/users' method='post'>\
				<input type='submit' value='PSQL CHANGES'>\
				</form>"
			})
	); 

app.get('/', 														// when the root directory loads, send the index.html file to the client
	(req, res) =>
		res.sendFile(
			path.join(__dirname, 'index.html')
		)
	);
	
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

//-----------------------------------------------------------------
//-------------------------GENERIC QUERIES-------------------------
//-----------------------------------------------------------------
/*  These queries exist temporarily for reference and will 
	ultimately be deleted                                        */
app.get('/users', db2.getUsers)
app.get('/users/:id', db2.getUserById)
app.post('/users', db2.createUser)
app.put('/users/:id', db2.updateUser)
app.delete('/users/:id', db2.deleteUser)	
/*app.post('/createProject', require('connect-ensure-login').ensureLoggedIn(), db2.createProject)*/