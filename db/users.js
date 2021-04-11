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

var records2 = [
    { id: 1, username: 'jack', password: 'secret', displayname: 'Jack', team: 2, emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayname: 'Jill', team: 2, emails: [ { value: 'jill@example.com' } ] }
  , { id: 3, username: 'TrevorFrench', password: 'swirecc', displayname: 'Trevor French', team: 1, emails: [ { value: 'tfrench@swirecc.com' } ] }
];

exports.findById = function(id, cb) {
  pool.query("SELECT * FROM users;", (error, results) => {
    if (error) {
      throw error
    }
	console.log(results.rows)
	var records = results.rows
  process.nextTick(function() {
	var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
  })/*delete these two*/
}

exports.findByUsername = function(username, cb) {
        pool.query("SELECT * FROM users;", (error, results) => {
    if (error) {
      throw error
    }
	console.log(results.rows)
	var records = results.rows
  process.nextTick(function() {
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
    })/*delete these two*/
}

//------------------------------------------------------------------------------
//----------------------DELIVERS THE PROJECT CREATION FORM ---------------------
//------------------------------------------------------------------------------
exports.createProject2 = function(req, res) {
	var team = req.user.team
       pool.query("SELECT * FROM users WHERE team =" + team + ";", (error, results) => {
    if (error) {
      throw error
    }
	console.log(results.rows)
	var records = results.rows
	
	process.nextTick(function() {
	const team_id = req.user.team
		console.log("REQ: " + req.user.team)
	
	pool.query("SELECT * FROM CATEGORIES WHERE team_id =" + team_id, (error, results) => {
    if (error) {
      throw error
    }
	
	let categoryVar = "<select name='category' id='category' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' pattern=[^'\x22]+>"
	let testNull = [];
	results.rows.forEach(element => categoryVar += "<option>" + element.category + "</option>");
	results.rows.forEach(element => testNull.push(element.category))
	categoryVar += '</select>';
	/*If this is a new user which hasn't created any categories yet, direct them to the documentation explaining what categories are and how to create them*/
	if (testNull.length == 0) { categoryVar = "<a href='./documentation#createCategories'>It looks like you haven't created any categories yet. Learn more here!</a>"};
	/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
    var userSelect= "<select id='responsible' name='responsible' style='padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'>";
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      userSelect += "<option value='" + record.id + "'>" + "<a href='#'>" + record.displayname + "</a></option>";

    }
	userSelect += "</select></div></div>";
	
	pool.query("SELECT * FROM customers WHERE team_id =" + team_id, (error, results) => {
		if (error) {
		  throw error
		}
	
	/*----------------------------------------------*/
	let customerVar = "<select name='customer' id='customer' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' pattern=[^'\x22]+>"
	let testNull2 = [];
	results.rows.forEach(element => customerVar += "<option>" + element.customer + "</option>");
	results.rows.forEach(element => testNull2.push(element.customer))
	customerVar += '</select>';
	/*If this is a new user which hasn't created any categories yet, direct them to the documentation explaining what categories are and how to create them*/
	if (testNull2.length == 0) { customerVar = "<a href='./documentation#createCategories'>It looks like you haven't created any customers yet. Learn more here!</a>"};
	/*----------------------------------------------------------------------------------------------------------------------------------------------------*/

	/*----------------------------------------------*/
	
	var customerInput = "<div class='row'><div class='col-25'><label for='customer'>Customer:</label></div>\
		<div class='col-75'>" + customerVar + "</select></div></div>";
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
	var projectFrame =  javascriptvar + "<div class='projectCreate'>\
						<p><h2 class='title'>Project Creation Form</h2></p>\
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
						<input type='submit' value='Create Project' class='blueButton'>\
						</form></div>";
	res.render("dashboard.ejs", {statusMessage: projectFrame})
	});
	});


})
    })
}

//------------------------------------------------------------------------------
//----------------------DELIVERS TEAM PROJECT CREATION FORM --------------------
//------------------------------------------------------------------------------
exports.createTeamProject = function(req, res) {
	var team = req.body.pt_id;
       pool.query("SELECT * FROM users INNER JOIN join_table ON users.id = join_table.user_id WHERE pt_id =" + team + ";", (error, results) => {
    if (error) {
      throw error
    }

	var records = results.rows
	
	process.nextTick(function() {
	const team_id = req.body.pt_id;

	pool.query("SELECT * FROM CATEGORIES WHERE pt_id =" + team_id, (error, results) => {
    if (error) {
      throw error
    }
	
	let categoryVar = "<select name='category' id='category' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' pattern=[^'\x22]+>"
	let testNull = [];
	results.rows.forEach(element => categoryVar += "<option>" + element.category + "</option>");
	results.rows.forEach(element => testNull.push(element.category))
	categoryVar += '</select>';
	/*If this is a new user which hasn't created any categories yet, direct them to the documentation explaining what categories are and how to create them*/
	if (testNull.length == 0) { categoryVar = "<a href='./documentation#createCategories'>It looks like you haven't created any categories yet. Learn more here!</a>"};
	/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
    var userSelect= "<select id='responsible' name='responsible' style='padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'>";
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      userSelect += "<option value='" + record.id + "'>" + "<a href='#'>" + record.displayname + "</a></option>";

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
	var projectFrame =  javascriptvar + "<div class='projectCreate'>\
						<p><h2 class='title'>Team Project Creation Form</h2></p>\
						<form action='/postTeamProject' method='post' id='description'>\
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
						<input type='text' name='pro_team_id' id='pro_team_id' value=" + team_id + " hidden >\
						<input type='submit' value='Create Project' class='blueButton'>\
						</form></div>";
	res.render("dashboard.ejs", {statusMessage: projectFrame})
	});


})
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
	const user = request.user.displayname;
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

//------------------------------------------------------------------------------
//---------------------------CREATES NEW TEAM PROJECT---------------------------
//------------------------------------------------------------------------------
exports.postTeamProject = (request, response) => {
	const titlestring = request.body.title
	const descriptionstring = request.body.description
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	var title2 = titlestring.replace(/'/gi,"''");
	var title = title2.replace(/\"/gi,"''");
	const statusSQL = request.body.statusSQL
	const responsible = request.body.responsible
	const duedate = request.body.duedate
	const user = request.user.displayname;
	const customer = request.body.customer;
	const category = request.body.category;
	const pt_id = request.body.pro_team_id;
	console.log("DESCRIPTION STRING: " + descriptionstring)
	console.log("DESCRIPTION 2: " + description2)
	console.log("DESCRIPTION: " + description)
	const sql = "INSERT INTO projects(title, description, status, responsible, duedate, created_by, customer, category, pt_id) VALUES ('" + title + "', '" + description + "', '" + statusSQL + "', '" + responsible + "', '" + duedate + "', '" + user + "', '" + customer + "', '" + category + "'," + pt_id + " )";
	pool.query(sql, (error, results) => {
	  if (error) {
		throw error;
	  }
	exports.createProject2(request, response)
})
}