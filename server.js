const express = require('express'); // easier to work with that the HTTP module.
const path = require('path'); // works with diretories and file paths
var bodyParser = require("body-parser");
const app = express(); // instantiate the module into a variable
const fileUpload = require('express-fileupload');
const db = require('./queries')

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

app.listen(app.get("port"), function () { // listens on the port and displays a message to the console
	console.log("Now listening for connection on port: " + app.get("port"));
});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.post('/dashboard', function(req, res){
	db.selectAll
	res.render('dashboard.ejs', {statusMessage: "Error. Please double check to make sure you spelled your ticker correctly and make sure that you did not include any spaces."}));
};
