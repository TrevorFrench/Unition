/*var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
app.listen('3000');
console.log('working on 3000');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));*/

const express = require('express'); // easier to work with that the HTTP module.
const path = require('path'); // works with diretories and file paths
var bodyParser = require("body-parser");
const app = express(); // instantiate the module into a variable
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
//app.use(fileUpload());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.set("port", (process.env.PORT || 5000)); // sets the port to 5000


app.use(express.static(path.join(__dirname, ''))); // this allows js and css files to be linked to the HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html'))); // when the root directory loads, sendthe index.html file to the client

app.post('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/.well-known/brave-rewards-verification.txt', (req, res) => res.sendFile(path.join(__dirname, '.well-known/brave-rewards-verification.txt')));

app.listen(app.get("port"), function () { // listens on the port and displays a message to the console
	console.log("Now listening for connection on port: " + app.get("port"));
});

app.post("/contact", function(req, res) {
	if(req.body){
			let keys = Object.keys(req.body);
			var transporter = nodemailer.createTransport({
  				service: 'gmail',
  				auth: {
    			user: 'trevorf96@gmail.com',
    			pass: 'ozbsbndwilnqstiy'
  						}
					});

			//var i = req.body[keys[2]];
			res.redirect('back');
            
            console.log('req.body keys 0: ' + req.body[keys[0]]);
            console.log('req.body keys: ' + req.body[keys]);

var mailOptions = {
  from: req.body[keys[0]],
  to: '9103915219@vtext.com,',
  subject: req.body.subject + 'REF: ' + req.body.reference,
  text: 'From: ' + req.body.name + '(' + req.body.email + ')' + req.body.message
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


	}
});