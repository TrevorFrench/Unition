/*hacky nonsense because my db connection broke*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0' // Also did this: npm config set strict-ssl=false and added ssl=true to queries.js //should probably be able to fix this now
//------------------------------------------------------------------------------
//---------------------------------ACTION LIST----------------------------------
//------------------------------------------------------------------------------
/* - Create a "filter" page
   - Develop "Status" table and feed into a drop-down on projects
   - Make a new landing page for successful database connections
   - Update the admin query/call
   - Add comment every time an update is made to a project
   - Create an external script for functions
   - Order tables by due date
   - If column has NOT NULL, make form element required         
   - Be able to navigate to projects directly with a URL
   - Display limit on description in the table
   - Search box for Ticket ID on home page (all pages?)                       
   - Comment and close option on projects
   - Create a hidden option on projects so that sensitive projects don't show up in lists
   - Form creation wizard
   - Admin option to change image
   - Put all queries into users.js or vice versa?
   - Bug where apostrophes are not escaped in values of inputs
   - Foreign Key for Categories (does foreign key make sense if I allow users to delete categories?
   - Change posts to gets wherever it is possible
   - if error render error page for sql queries
   - hide team, auto incrmenet, allow user to change team on profile page, lookup to make sure team exists for team change
   - first time user creates a project no category is available (link to documentation?)
   - handle apostrophes in table list rendering (replace with a non-impactful chracter maybe)
   - create an API
   - can I delete inline functions?
   - delete unused login files
   - create campaign functionality
   - ERROR HANDLING (model after create user error and expand on that no throw errors (maybe option to report errors/automatically report errors))
   - make sure there are valid redirects (no response.anything)
   - filtering by displayname which isn't unique (FIXED but still need to change responsible to INT4 and get rid of to-number function in joins)
   - excel page is a vulnerability
   - log user creation and last login
   - Calendar view
   - Bar at top of teams page to filter by category/team mate/calendar view/project management view
   - Switch category relationship to user to user_id from team_id
   - Comments redirect to get project by id
   - maybe turn index into customizable dashboard and make actual index the landing page
   - Default responsible to user on individual projects
   - form table which allows users to add column/drop column for inputs
   - premium is a form creator/public forms
   - admin page will have individual options and team options (only able to see admin options for a team if you are the owner/administrator)
   - dashboard view (titles under status headings) calendar view overdue view
   - delete inline styles
   - Exclude closed projects on teams view
   - Filter on teams view would be the same function except add "where category/etc. = " into sql queries
   - Create team as role id 1, join team as role id 2. Give admin role functionality.
   - Build a teams app
   - Build out a support/feedback table
   - foreign key constraints/make sure workflow accomodates foreign keys (updating in the correct order)
   - two hidden routes
   - Forms tab should include all teams forms as well
   - function that pulls forms out of browser, checks if user is part of requested team if it is an internal user, otherwise renders
   - set recurring projects in the admin table
   - on ticket update, make value of status drop-down defauilted to true value rather than open
   - passport serializes ids based on position not id number we can return values in order but will break if an ID is ever removed
   - make documentation text color variable
   - get rid of responsible on project creation form (individual)
   - internal server error when you hit  home after cookie times out
   - add an feature that allows you to "highlight" a project
   - create projects functionality which allows tasks to be assigned to projects
   - Recurring projects
   - Bug when cookie expires and user tries to navigate to the home page
   - Allow the user to make a customized home page
   - either manually escape apostrophes in titles on tables or make the link something different
   - normalize announcements table and add options such as color and style
   - Recurring Projects
   - Testimonials and customers on the landing page
   - Create a feedback/bug page and feed the feedback/bugs to admin page
   - admin page could have a marketing email tool
   - map and track clicks
   - Tab titles on login page
   - Teams filter on charts/projects
   - Move projects filters to a single page
   - Priorities and colors for projects
   - Option to email on comments
   - Move Gantt Chart to bottom of graphs
   - Let user choose the home screen image (change every refresh)
   - Make teams function a premium feature and then give it away for free
		This will allow user feedback and gain potential evangelists as the
		teams function might encourage invites
   - Performance review functionality
   - CRM?
   - Align projects with overarching goals/competencies
   - 1 Month free premium when friend signs up with your link
   - Roll Database keys and create github secrets
   - Custom forms for enterprise
   - list teams forms on forms tab
   - Track unique landing page views
   - Redirect back to teams page after team project creation
   - unition board alternating colors on lighttheme needs to be fixed
   - Join Team/Create Team/Display Team ID to admins
   - Redo libraries so that functions look more like 'campaigns.add'
   - mass update projects with filters
   - Custom email for support
   -config vars in heroku for database credentialing
*/

//------------------------------------------------------------------------------
//-----------------------------ENVIRONMENT VARIABLES----------------------------
//------------------------------------------------------------------------------
const express = require('express');                                 			// easier to work with than the HTTP module.
const path = require('path');                                       			// works with diretories and file paths
var bodyParser = require("body-parser");                            			// middleware
const app = express();                                              			// instantiate the module into a variable
const db2 = require('./queries')                                    			// reference queries.js to interact with postgreSQL database
var passport = require('passport');												// login framework
var Strategy = require('passport-local').Strategy;								// method which is used within the login framework
var db = require('./db');														// folder which contains database files
var theme = require('./theme')													// reference the theme.js file which contains theme change references
const ip = require("ip")														// ip package for loggin a users ip address
require('dotenv').config();


//------------------------------------------------------------------------------
//-------------------------------ENVIRONMENT SETUP------------------------------
//------------------------------------------------------------------------------
app.use(bodyParser.json());                                         			// not sure exactly what this is used for
app.set('views', __dirname + '/public/views');                      			// sets filepath for view rendering
app.set('view engine', 'ejs');                                      			// sets the view engine to 'ejs'
app.use(require('morgan')('combined'));                             			// Use application-level middleware for common functionality, including
app.use(bodyParser.urlencoded({ extended: true }));                 			// logging, parsing, and session handling.

//------------------------------------------------------------------------------
//---------------------------INITIALIZE DB CONNECTION---------------------------
//------------------------------------------------------------------------------
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'xdlepbswgkuwsn',
  host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
  database: 'd216rqdgnn6371',
  password: '43fc7fd35e724f6a212661eb4fd3ae514003079f9d3a56a56b2d96eb959dbaeb',
  port: 5432,
  ssl: true,
})

var pg = require('pg')
  , session = require('express-session')
  , pgSession = require('connect-pg-simple')(session);

app.use(session({
		  store: new pgSession({
			pool : pool,                										// Connection pool
		  }),
		secret: 'keyboard cat', 
		resave: false, 
		saveUninitialized: true, 
		cookie: { maxAge: 60 * 60 * 1000 }										// 1 hour cookie
	})
);

app.set("port", (process.env.PORT || 5000));                        			// sets the port to 5000
app.use(express.static(path.join(__dirname, '')));                  			// this allows js and css files to be linked to the HTML

app.listen(app.get("port"), function () {                           			// listens on the port and displays a message to the console
	console.log("Now listening on port: " + app.get("port"));
});

//------------------------------------------------------------------------------
//---------------------------------LOGIN MODULES--------------------------------
//------------------------------------------------------------------------------
passport.use(new Strategy(														// Configure the local strategy for use by Passport.
	function(username, password, cb) {								
	  db.users.findByUsername(username, function(err, user) {					// The local strategy require a `verify` function which receives the credentials
	    if (err) { return cb(err); }											// (`username` and `password`) submitted by the user.  The function must verify
		if (!user) { return cb(null, false); }									// that the password is correct and then invoke `cb` with a user object, which
		if (user.password != password) { return cb(null, false); }				// will be set at `req.user` in route handlers after authentication.
		return cb(null, user);
	  });
	}
));

passport.serializeUser(function(user, cb) {										// Configure Passport authenticated session persistence.
	cb(null, user.id);															// In order to restore authentication state across HTTP requests, Passport needs
});																				// to serialize users into and deserialize users out of the session.  The

passport.deserializeUser(function(id, cb) {										// typical implementation of this is as simple as supplying the user ID when
	db.users.findById(id, function (err, user) {								// serializing, and querying the user record by ID from the database when
		if (err) { return cb(err); }											// deserializing.
		cb(null, user);
	});
});

app.use(passport.initialize());													// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.session());

//------------------------------------------------------------------------------
//----------------------------------STRIPE API----------------------------------
//------------------------------------------------------------------------------
const stripe = require('stripe')(/*process.env.STRIPE_KEY*/process.env.STRIPE_TEST_KEY);

// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.post("/create-customer-portal-session", async (req, res) => {
	
	const returnUrl = 'https://www.unition.app/profile';
	const customerId = req.user.stripe_id;
	
	console.log(customerId);
	
	const portalSession = await stripe.billingPortal.sessions.create({
	  customer: customerId,
	  return_url: returnUrl,
	});

	res.redirect(portalSession.url);
})

app.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;
  const priceId = '{{PRICE_ID}}';

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: 'price_1JBXPxKqakUFqghQxDCrHnwj',
          quantity: 1,
        },
      ],
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
	  
      success_url: 'https://unition.app/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/canceled.html',
    });
	console.log("session ID: " + session.id + " USER_ID: " + req.user.id);
	
	const sql = "INSERT INTO stripe (native_id, checkout_session_id) VALUES (" + req.user.id + ", '" + session.id + "');";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		console.log("SUCCESSFULLY UPDATED TABLE")
	});
	
    return res.redirect(303, session.url);
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    basicPrice: process.env.BASIC_PRICE_ID,
    proPrice: process.env.PRO_PRICE_ID,
  });
});

app.post('/customer-portal', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { sessionId } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = process.env.DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

// Webhook handler for asynchronous events.
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
		console.log("Session: " + data.object.id);
		console.log("Customer: " + data.object.customer);
		
			const sqlInsert = "UPDATE stripe SET stripe_id = '" + data.object.customer + "', subscription_end =  CURRENT_DATE + INTERVAL '33 days' WHERE checkout_session_id = '" +  data.object.id + "';"
			pool.query(sqlInsert, (error, results) => {
				if (error) {
					console.log(error)
				}
				
				const sqlSelect = "SELECT * from stripe WHERE stripe_id = '" + data.object.customer + "';"
				pool.query(sqlSelect, (error, results) => {
				if (error) {
					console.log(error)
				}
				console.log(results.rows)
				console.log(results.rows[0].native_id)
				const sqlUpdate = "UPDATE users SET stripe_id = '" + data.object.customer + "' WHERE id = " + results.rows[0].native_id + ";"
				pool.query(sqlUpdate, (error, results) => {
				if (error) {
					console.log(error)
				}
				
				
				});
				
				});
			});
			
			
        break;
      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
		 console.log(data.object.customer);
		 const sql2 = "UPDATE stripe SET subscription_end =  CURRENT_DATE + INTERVAL '33 days' WHERE stripe_id = '" +  data.object.customer + "';"
			pool.query(sql2, (error, results) => {
				if (error) {
					console.log(error)
				}
			});
        break;
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
		case 'customer.subscription.deleted':
		
		break;
      default:
      // Unhandled event type
    }

  res.sendStatus(200);
});

//------------------------------------------------------------------------------
//------------------------------FUNCTIONAL QUERIES------------------------------
//------------------------------------------------------------------------------
app.post('/openProjects', 														// select only projects where status = 'Open'
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectOpen
	)
	
app.post('/openCharts', 														// renders the charts view
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectCharts
	)
	
app.post('/filterCharts', 														// renders the filtered charts view
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.filterCharts
	)

app.post('/inprocessProjects', 													// select only projects where status = 'In-process'
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectInprocess
	)

app.post('/allProjects', 														// select every project that has been created
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectAll
	)

app.post('/openProject', 														// displays individual project information when selected from a table of projects
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.getProject
	)

app.post('/createProject', 														// renders a form for project creation
	require('connect-ensure-login').ensureLoggedIn(), 
	db.users.createProject2
	)

app.post('/createTeamProject', 													// renders a form for team project creation
	require('connect-ensure-login').ensureLoggedIn(), 
	db.users.createTeamProject
	)
	
app.post('/postProject', 														// posts project from previous form to the database
	require('connect-ensure-login').ensureLoggedIn(), 
	db.users.postProject
	)
	
app.post('/postTeamProject', 													// posts team project from previous form to the database
	require('connect-ensure-login').ensureLoggedIn(), 
	db.users.postTeamProject
	)
	
app.post('/updateProject', 														// allows users to change attributes of a project (currently only allows status to be changed
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.updateProject
	)
	
app.post('/updateProjectTeam', 													// Close project from scrum board and redirect back to team page
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.updateProjectTeam
	)
	
app.get('/myProjects', 															// My projects selects all 'Open' and 'In-process' projects assigned to the current user
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.selectMyProjects
	)
	
app.post('/addComment', 														// Adds a comment to current project
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.plusComment
	)
	
app.get('/adminPage',															// renders the 'tables' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverTables
	)

app.post('/categories',															// renders the 'categories' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverCategories
	)
	
app.post('/customers',															// renders the 'customers' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverCustomers
	)
	
app.post('/teamCategories',														// renders the 'team categories' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverTeamCategories
	)
	
app.post('/teamCustomers',														// renders the 'team customers' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverTeamCustomers
	)
	
app.post('/teamAnnouncements',													// renders the 'team announcements' view
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deliverTeamAnnouncements
	)
	
app.post('/deleteAnnouncement',													// deletes a team announcement
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteAnnouncement
	)

app.post('/addAnnouncement',													// adds a team announcement
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addAnnouncement
	)

app.post('/deleteCategory',														// deletes the selected category
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteCategory
	)

app.post('/deleteTeamCategory',													// deletes the selected team category
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteTeamCategory
	)

app.post('/addCategory',														// adds the specified category
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addCategory
	)
	
app.post('/addTeamCategory',													// adds the specified team category
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addTeamCategory
	)

app.post('/deleteCustomer',														// deletes the selected customer
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteCustomer
	)
	
app.post('/deleteTeamCustomer',													// deletes the selected team customer
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteTeamCustomer
	)
	
app.post('/deleteCampaign',														// deletes the selected campaign
	require('connect-ensure-login').ensureLoggedIn(),
	db2.deleteCampaign
	)

app.post('/addCustomer',														// adds the specified customer
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addCustomer
	)
	
app.post('/addTeamCustomer',													// adds the specified team customer
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addTeamCustomer
	)

app.post('/addCampaign',														// adds the specified campaign
	require('connect-ensure-login').ensureLoggedIn(),
	db2.addCampaign
	)

app.post('/addUser', 											    			// creates a new user
	db2.createUser
	)

app.post('/defaultDark', 														// defaultDark theme change
	require('connect-ensure-login').ensureLoggedIn(),
	theme.defaultDark
	)
	
app.post('/lightTheme', 														// light theme change
	require('connect-ensure-login').ensureLoggedIn(),
	theme.lightTheme
	)
	
app.post('/dashboardTheme', 													// dashboard theme change
	require('connect-ensure-login').ensureLoggedIn(),
	theme.dashboardTheme
	)

app.get('/Excel', 																// select every project that has been created for Excel scraping
	db2.selectExcel
	)

//------------------------------------------------------------------------------
//------------------------------------ROUTES------------------------------------
//------------------------------------------------------------------------------
app.get('/admin', 																// renders a page which is used for administration
	require('connect-ensure-login').ensureLoggedIn(), 
	db2.consoleCharts
	); 

app.get('/', 																	// when the root directory loads, send the landing.html file to the client
	(req, res) => 																// does this function even do anything?
		res.sendFile(
			path.join(__dirname, 'landing.html')
		)
	);

app.get('/home', 
	require('connect-ensure-login').ensureLoggedIn(),							// when the root directory loads, send the main.html file to the client
	db2.homeView
	);

app.get('/login',																// Delivers the login screen
	db2.deliverLogin
	)
	
app.get('/landing',																// Delivers the landing page
		(request, response) => {
			var visitor_ip = ip.address();										// makes the visitors ip address a variable
				const sqltracking = "INSERT INTO views(\
							page\
							, ipaddress\
							) VALUES (\
							'landing'\
							, '" + visitor_ip + "'\
							);";
			pool.query(sqltracking, (error, results) => {						// Submits landing page view to database with ip address recorded
				if (error) {
					throw error;
				}
				response.sendFile('index3.html' , { root : __dirname});			// redirects to the landing page
			});
		}
	)
  
app.post('/login', 																// Posts the login credentials
  passport.authenticate('local', { failureRedirect: '/login' }),				// Tests credentials, if credentials fail the login screen is rendered again
  function(req, res) {
    res.redirect('/home');														// Home screen is delivered if credentials are tested successfully
  });
  
app.get('/logout',																// logs the current user out and delivers the home screen
  function(req, res){
    req.logout();
    res.redirect('/login');
  });

app.get('/profile',																// renders the 'profile' for the current user
  require('connect-ensure-login').ensureLoggedIn(),
  db2.profileView
);
  
app.get('/projects',															// renders the 'projects' view
  require('connect-ensure-login').ensureLoggedIn(),
  db2. projectsView
);
  
app.get('/documentation',														// renders the 'documentation' view
  require('connect-ensure-login').ensureLoggedIn(),
  db2.documentationView
);
  
app.get('/campaigns',											    			// renders the 'campaigns' view
  require('connect-ensure-login').ensureLoggedIn(),
    db2.deliverCampaigns
  );
  
app.get('/teams',											        			// renders the temporary 'teams' view
  require('connect-ensure-login').ensureLoggedIn(),
  db2.teamsView
);
  
app.get('/teams2',											        			// renders the 'teams' view
  require('connect-ensure-login').ensureLoggedIn(),
    db2.teams2
  );
  
app.post('/deliverTeam',														// delivers team view by id
  require('connect-ensure-login').ensureLoggedIn(),
    db2.deliverTeams
  );
  
app.post('/deliverJoinTeam',													// delivers the join team view
  require('connect-ensure-login').ensureLoggedIn(),
    db2.deliverJoinTeam
  );
  
app.post('/deliverCreateTeam',													// delivers the create team view
  require('connect-ensure-login').ensureLoggedIn(),
    db2.deliverCreateTeam
  );
  
app.post('/joinTeam',															// user joins a team
  require('connect-ensure-login').ensureLoggedIn(),
    db2.joinTeam
  );
  
app.post('/createTeam',															// user creates a team
  require('connect-ensure-login').ensureLoggedIn(),
    db2.createTeam
  );
  
app.post('/updateCampaign',														// updates a campaign
  require('connect-ensure-login').ensureLoggedIn(),
    db2.updateCampaign
  );
  
app.post('/updatePercentage',													// updates project percentage
  require('connect-ensure-login').ensureLoggedIn(),
    db2.updatePercentage
  );
  
app.get('/forms',												    			// renders the 'forms' view
  require('connect-ensure-login').ensureLoggedIn(),
  db2.formsView
);

//------------------------------------------------------------------------------
//--------------------------------GENERIC QUERIES-------------------------------
//------------------------------------------------------------------------------
/*  These queries exist temporarily for reference and will 
	ultimately be deleted                                        */
app.get('/users', db2.createUser)
app.get('/users/:id', db2.getUserById)
app.post('/admin', db2.admin)
/*app.post('/createProject', require('connect-ensure-login').ensureLoggedIn(), db2.createProject)*/