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

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', team: 2, emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', team: 2, emails: [ { value: 'jill@example.com' } ] }
  , { id: 3, username: 'TrevorFrench', password: 'swirecc', displayName: 'Trevor French', team: 1, emails: [ { value: 'tfrench@swirecc.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}

//------------------------------------------------------------------------------
//----------------------DELIVERS THE PROJECT CREATION FORM ---------------------
//------------------------------------------------------------------------------
exports.createProject2 = function(req, res) {

	
	process.nextTick(function() {
		
	pool.query("SELECT * FROM CATEGORIES", (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
	
	let categoryVar = "<select name='category' id='category' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' pattern=[^'\x22]+>"
	
	results.rows.forEach(element => categoryVar += "<option>" + element.category + "</option>");
	categoryVar += '</select>';
	
    var userSelect= "<select id='responsible' name='responsible' style='padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'>";
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      userSelect += "<option value='" + record.displayName + "'>" + "<a href='#'>" + record.displayName + "</a></option>";

    }
	userSelect += "</select></div></div>";
	var customerInput = "<div class='row'><div class='col-25'><label for='customer'>Customer:</label></div>\
		<div class='col-75'><select id='customer' name='customer' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'>\
		<option value='FSOP'><b>FSOP</b></option>\
		<option value='FSOP - Sales'>FSOP - Sales</option>\
		<option value='FSOP - Service'>FSOP - Service</option>\
		<option value='FSOP - Customer Care'>FSOP - Customer Care</option>\
		<option value='PRGM'><b>PRGM</b></option>\
		<option value='PRGM - FSOP'>PRGM - FSOP</option>\
		<option value='S&P'><b>S&P</b></option>\
		<option value='S&P - Pricing'>S&P - Pricing</option>\
		<option value='S&P - Insights'>S&P - Insights</option>\
		<option value='S&P - Commercial Marketing'>S&P - Commercial Marketing</option>\
		<option value='Swire Coca-Cola, USA'><b>Swire Coca-Cola, USA</b></option>\
		<option value='Consumer'><b>Consumer</b></option>\
		</select></div></div>";
	var javascriptvar = "<script>\
                      function myFunction() {\
                               var input, filter, ul, li, a, i;\
                               input = document.getElementById('mySearch');\
                               filter = input.value.toUpperCase();\
                               ul = document.getElementById('responsible');\
                               li = ul.getElementsByTagName('option');\
							   ul.style.display = 'inline';\
                               for (i = 0; i < li.length; i++) {\
                                   a = li[i].getElementsByTagName('a')[0];\
                                   if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {\
                                     li[i].style.display = '';\
									 li[i].selected = true;\
                                   } else {\
                                     li[i].style.display = 'none';\
									 li[i].selected = false;\
                                   }\
                               }\
                            }\
                     </script>"
	var stylevar = " #responsible {\
                       width: 100%;\
                       font-size: 18px;\
                       padding: 11px;\
                       border: 1px solid #ddd;\
                    }\
                    #responsible {\
                      list-style-type: none;\
                      padding: 0;\
                      margin: 0;\
                      display: none;\
                    }\
                    #responsible li a {\
                      padding: 12px;\
                      text-decoration: none;\
                      color: black;\
                    }\
                    #responsible li i {\
                      display: none;\
                    }\
                    #responsible li a:hover {\
                      background-color: #eee;\
                    }"
	var searchBar = "<input type='text' id='mySearch' style=' width:50%; padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' onkeyup='myFunction()' placeholder='Search..' title='Type in a category'>"
	var projectFrame =  javascriptvar + "<div style='width:80%; margin-left:10%; background-color:#f7f7f7; padding:10px;'\
						<p><h2 style='text-align:center;'>Project Creation Form</h2></p>\
						<form action='/postProject' method='post' id='description'>\
						  <div class='row'><div class='col-25'><label for='title'>Title:</label></div>\
						<div class='col-75'><input type='text' name='title' id='title' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' required></div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='statusSQL'>Status:</label></div>\
						<div class='col-75'><select id='statusSQL' name='statusSQL' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'>\
						   <option value='Open'>Open</option>\
						   <option value='In-process'>In-process</option>\
						   <option value='Closed'>Closed</option>\
						</select></div></div>\
						<br><br>" + customerInput + "<br><br>\
						<div class='row'><div class='col-25'><label for='category'>Category:</label></div>\
						<div class='col-75'>" + categoryVar + "</div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='responsible'>Responsible:</label></div><div class='col-75'>" + searchBar + userSelect + "<br><br>\
						<div class='row'><div class='col-25'><label for='duedate'>Due Date:</label></div>\
						<div class='col-75'><input type='date' name='duedate' id='duedate' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' pattern=[^'\x22]+ required></div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='description'>Description:</label></div>\
						<div class='col-75'><textarea style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' name='description' id='description' form='description' Placeholder='Describe your project here...' required></textarea></div></div>\
						<br><br>\
						<input type='submit' value='Create Project'>\
						</form></div>";
	res.render("dashboard.ejs", {statusMessage: projectFrame})
	});


})

}

//------------------------------------------------------------------------------
//-----------------------------CREATES NEW PROJECT------------------------------
//------------------------------------------------------------------------------
exports.postProject = (request, response) => {
	const titlestring = request.body.title
	const descriptionstring = request.body.description
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	var title2 = titlestring.replace(/'/gi,"''");
	var title = title2.replace(/\"/gi,"''");
	const statusSQL = request.body.statusSQL
	const responsible = request.body.responsible
	const duedate = request.body.duedate
	const user = request.user.displayName;
	const customer = request.body.customer;
	const category = request.body.category;
	console.log("DESCRIPTION STRING: " + descriptionstring)
	console.log("DESCRIPTION 2: " + description2)
	console.log("DESCRIPTION: " + description)
	const sql = "INSERT INTO projects(title, description, status, responsible, duedate, created_by, customer, category) VALUES ('" + title + "', '" + description + "', '" + statusSQL + "', '" + responsible + "', '" + duedate + "', '" + user + "', '" + customer + "', '" + category + "' )";
	pool.query(sql, (error, results) => {
	  if (error) {
		throw error;
	  }
	exports.createProject2(request, response)
})
}