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

//------------------------------------------------------------------------------
//--------------------------------GENERIC QUERIES-------------------------------
//------------------------------------------------------------------------------
//-These queries exist temporarily for reference and will ultimately be deleted-
const getUsers = (request, response) => {
  pool.query("DELETE from comments where comment_id = 131;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const selectCategories = (request, response) => {
  pool.query("SELECT * FROM CATEGORIES", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM c', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser2 = (request, response) => {
  const { name, email } = request.body

  pool.query("ALTER TABLE projects ADD COLUMN category TEXT;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}
//------------------------------------------------------------------------------
//---------------------------DELETES SELECTED CATEGORY--------------------------
//------------------------------------------------------------------------------
const deleteCategory = (request, response) => {
  const category_id = parseInt(request.body.category_id)
  console.log(category_id)
  console.log(request.body.category_id)
  pool.query('DELETE FROM categories WHERE category_id = $1', [category_id], (error, results) => {
    if (error) {
      throw error
    }
    deliverCategories(request, response)
  })
}

//------------------------------------------------------------------------------
//----------------------------ADDS SPECIFIED CATEGORY---------------------------
//------------------------------------------------------------------------------
const addCategory = (request, response) => {
  const namestring = request.body.category_name
  var name2 = namestring.replace(/'/gi,"''");
  var name = name2.replace(/\"/gi,"''");
  const descriptionstring = request.body.category_description
  var description2 = descriptionstring.replace(/'/gi,"''");
  var description = description2.replace(/\"/gi,"''");
  const team = request.body.team_id
  pool.query("INSERT INTO categories (category, description, team_id) VALUES ('" + name + "', '" + description + "', '" + team + "')", (error, results) => {
    if (error) {
      throw error
    }
    deliverCategories(request, response)
  })
}

//------------------------------------------------------------------------------
//------------------------------SELECTS ALL PROJECTS----------------------------
//------------------------------------------------------------------------------
const selectAll = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects ORDER BY project_id DESC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = 
	  "<table class='styled-table'>\
		<tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  results.rows.forEach(element => tableText += 
										"<tr><td>\
												<form id='projectform' action='/openProject' method='post'>\
													<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>"
													+ "<input type='submit' class='projectTitle' value='" + element.title + "'>\
												</form>\
											</td>\
											<td>" + element.project_id + "</td>\
											<td>" + element.status + "</td>\
											<td>" + element.responsible + "</td>\
											<td>" + element.duedate + "</td>\
											<td>" + element.description + "</td>\
										</tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//-------------------------SELECTS ALL PROJECTS FOR EXCEL-----------------------
//------------------------------------------------------------------------------
const selectExcel = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description, TO_CHAR(created_date, 'MM/DD/YYYY') AS created_date, customer, category FROM projects ORDER BY project_id DESC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = 
	  "<table class='styled-table'>\
		<tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th><th>Created Date</th><th>Customer</th><th>Category</th></tr>";
	  results.rows.forEach(element => tableText += 
										"<tr><td>" + element.title + "</td>\
											<td>" + element.project_id + "</td>\
											<td>" + element.status + "</td>\
											<td>" + element.responsible + "</td>\
											<td>" + element.duedate + "</td>\
											<td>" + element.description + "</td>\
											<td>" + element.created_date + "</td>\
											<td>" + element.customer + "</td>\
											<td>" + element.category + "</td>\
										</tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//-----------------------------SELECTS OPEN PROJECTS----------------------------
//------------------------------------------------------------------------------
const selectOpen = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects WHERE status = 'Open' ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "<table class='styled-table'><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' class='projectTitle' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//--------------------------SELECTS IN-PROCESS PROJECTS-------------------------
//------------------------------------------------------------------------------
const selectInprocess = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects WHERE status = 'In-process' ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "<table class='styled-table'><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' class='projectTitle' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//---------------SELECTS IN-PROCESS & OPEN PROJECTS (MY PROJECTS)---------------
//------------------------------------------------------------------------------
const selectMyProjects = function(req, res) {
	const user = req.user.displayname;
	console.log("USER: " + user);
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects WHERE (status = 'In-process' AND responsible = '" + user + "') OR (status = 'Open' AND responsible = '" + user + "') ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "<table class='styled-table'><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  var titlestring
	  results.rows.forEach(element =>



	  tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit'  class='projectTitle' value='" + element.title.replace(/'/gi,"''") + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//---------------------------DELIVERS THE TABLES VIEW---------------------------
//------------------------------------------------------------------------------
const deliverTables = function(req, res) {
	  var tableText = "<table class='styled-table'><tbody>\
	<tr><th>TABLE LIST</th><th>Description</th>\
	<tr><td><form action='/categories' method='post'><input type='submit' name='delivercategories' value='Categories' class='projectTitle'></form></td><td>Returns a table containing all categories.</td></tr>\
	</tbody></table>";
	res.render("dashboard.ejs", {statusMessage: tableText})
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE CATEGORIES VIEW-------------------------
//------------------------------------------------------------------------------
const deliverCategories = function(req, res) {
  const team_id = req.user.team;
  const sql = "SELECT * FROM CATEGORIES WHERE team_id =" + team_id;
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "	<table class='styled-table'><tbody>\
	<tr><th>Category</th><th>Description</th><th>Action</th></tr>";
	  results.rows.forEach(element => tableText += "<tr><td>" + element.category + "</td><td>" + element.description + "</td></td><td><form action='/deleteCategory' method='post'><input type='text' id='category_id' name='category_id' value='" + element.category_id + "' hidden><input type='submit' name='deletecategory' value='DELETE' class='projectTitle'></form></td></tr>");
	tableText += "<tr><td><form action='/addCategory' method='POST'><input type='text' name='category_name' id='category_name'></td><td><input type='text' name='category_description' id='category_description'><input type='text' name='team_id' id='team_id' value='" + team_id + "' hidden></td><td><input type='submit'></td></tr></tbody></table>";
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//-------------------------------GETS PROJECT BY ID-----------------------------
//------------------------------------------------------------------------------
const getProject = (request, response) => {
  const id = parseInt(request.body.ticketID)
	console.log(request.body)
  pool.query("SELECT projects.project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, projects.description AS description, comments.description AS commentdescription, TO_CHAR(comments.created_date, 'MM/DD/YYYY') AS commentcreateddate, comments.created_by AS commentcreatedby FROM projects LEFT JOIN comments ON projects.project_id = comments.project_id WHERE projects.project_id =" + id, (error, results) => {
    if (error) {
      throw error
    }
	var projectText = '';
	projectText += "<div class='projectDiv'><form action='/updateProject' method='post' style='white-space:pre-line;'><input type='text' name='title' id='title' value='" + results.rows[0].title + "' hidden><h2 class='title'>" + results.rows[0].title + "</h2><div class='row'><div class='col-25'><label for='statusSQL'><b>STATUS:</b></label></div> <div class='col-75'><select id='statusSQL' name='statusSQL' style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;'><option value='Open'>Open</option><option value='In-process'>In-process</option><option value='Closed'>Closed</option></select></div></div><br><b>DUE DATE:</b> <input type='text' name='duedate' id='duedate' value='" + results.rows[0].duedate + "'hidden>" + results.rows[0].duedate + "<br><br><b>RESPONSIBLE:</b> <input type='text' name='responsible' id='responsible' value='" + results.rows[0].responsible + "' hidden>" + results.rows[0].responsible + "<br><br><b>PROJECT ID:</b> <input type='text' name='project_id' id='project_id' value='" + results.rows[0].project_id + "' hidden>" + results.rows[0].project_id + "<br><br><b>DESCRIPTION:</b> <input type='text' name='description' id=description value='" + results.rows[0].description + "' hidden>" + results.rows[0].description + "<br><br><input type='submit' value='Update Project' class='blueButton'></form></div>\
	<br><br>\
	<div class='projectDiv'>\
	<form action='/addComment' method='post' id='commentDescription' style='white-space:pre-line;'>\
	<label for='commentDescription'>Comments:</label>\
	<br><br>\
	<textarea style='width: 100%;padding: 12px;border: 1px solid #ccc;border-radius: 4px; resize: vertical;' name='commentDescription' id='commentDescription' form='commentDescription' Placeholder='Describe your comment here...'></textarea>\
	<input type='text' name='project_id' id='project_id' value='" + results.rows[0].project_id + "' hidden><br><br><input type='submit' value='Add Comment' class='redButton'></input></form></div>";
    if(results.rows[0].commentdescription != null) {results.rows.forEach(element => projectText += "<br><br><div class='commentDiv'><b>" + element.commentcreatedby + "</b> (" + element.commentcreateddate + ")<br>" + element.commentdescription + "</div>");}
  
	response.render("dashboard.ejs", {statusMessage: projectText})
  })
}

//------------------------------------------------------------------------------
//--------------------------------UPDATES PROJECT-------------------------------
//------------------------------------------------------------------------------
const updateProject = (request, response) => {
	const title = request.body.title
	const description = request.body.description
	const statusSQL = request.body.statusSQL
	const responsible = request.body.responsible
	const duedate = request.body.duedate
	const id = parseInt(request.body.project_id)
	console.log("TITLE: " + title)
	const sql = "UPDATE projects SET status = '" + statusSQL + "' WHERE project_id = " + id;
	pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	response.render("dashboard.ejs", {statusMessage: "Successfully updated project: "})
})
}

//------------------------------------------------------------------------------
//----------------DELIVERS THE PROJECT CREATION FORM (UNUSED)---------------
//------------------------------------------------------------------------------
const createProject = (request, response) => {
	var projectFrame = "<p><i>*Please do not use quotation marks or apostrophes in the form.</i></p><form action='/postProject' method='post' id='description'> <label for='title'>Title:</label><br><br><input type='text' name='title' id='title' pattern=[^'\x22]+><br><br><label for='statusSQL'>Status:</label><br><br><select id='statusSQL' name='statusSQL'><option value='Open'>Open</option><option value='In-process'>In-process</option><option value='Closed'>Closed</option></select><br><br><label for='responsible'>Responsible:</label><br><br><input type='text' name='responsible' id='responsible' pattern=[^'\x22]+><br><br><label for='duedate'>Due Date:</label><br><br><input type='date' name='duedate' id='duedate' pattern=[^'\x22]+><br><br><label for='description'>Description:</label><br><br><textarea style='width:450px; height:100px;' name='description' id='description' form='description' Placeholder='Describe your project here...'></textarea><br><br><input type='submit' value='Create Project'></form>";
	response.render("dashboard.ejs", {statusMessage: projectFrame})
}

//------------------------------------------------------------------------------
//---------------------------ADDS COMMENT TO PROJECT----------------------------
//------------------------------------------------------------------------------
const plusComment = (request, response) => {
	const descriptionstring = request.body.commentDescription
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	const user = request.user.displayname;
	const project_id = request.body.project_id
	console.log("DESCRIPTION STRING: " + descriptionstring)
	console.log("DESCRIPTION 2: " + description2)
	console.log("DESCRIPTION: " + description)
	const sql = "INSERT INTO comments(created_by, description, project_id) VALUES ('" + user + "', '" + description + "', '" + project_id + "' )";
	pool.query(sql, (error, results) => {
	  if (error) {
		throw error;
	  }
	response.render("dashboard.ejs", {statusMessage: "Successfully added comment: "})
})
}

//------------------------------------------------------------------------------
//---------------------------------RENDER CHARTS--------------------------------
//------------------------------------------------------------------------------
const selectCharts = (request, response) => {
	const sql = "SELECT DISTINCT\
				CONCAT(date_part('year', created_date), '-', date_part('month', created_date)) AS PROJECT_MONTH,\
				COUNT(DISTINCT project_id) AS PROJECT_COUNT\
				FROM\
				   projects\
				GROUP BY\
				   date_part('year', created_date),\
				   date_part('month', created_date)\
				ORDER BY\
				   PROJECT_MONTH;"
	pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  let dataArray = [];
	  let labelArray = [];
	  results.rows.forEach(element => labelArray.push("'" + element.project_month + "'"));
	  var texts= "labels: [" + labelArray + "],\
        datasets: [{\
            label: '# of Projects',\
            data: " 
		results.rows.forEach(element => dataArray.push(element.project_count));
		texts+= "[" + dataArray + "]";
	  console.log(results.rows);
	response.render("charts.ejs", {statusMessage: texts})
})
}

const deliverLogin = (request, response) => {
	const sql = "SELECT MAX(team) from users;"
	pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var maxNumber = parseInt(results.rows[0].max) + 1
	  console.log(maxNumber)
	  response.render("login.ejs", {statusMessage: maxNumber})
})
}

//------------------------------------------------------------------------------
//----------------------------------CREATE USER---------------------------------
//------------------------------------------------------------------------------
const createUser = (request, response) => {
	const usernamestring = request.body.username
	var username2 = usernamestring.replace(/'/gi,"''");
	var username = username2.replace(/\"/gi,"''");
	
	const passwordstring = request.body.password
	var password2 = passwordstring.replace(/'/gi,"''");
	var password = password2.replace(/\"/gi,"''");
	
	const displaynamestring = request.body.displayname
	var displayname2 = displaynamestring.replace(/'/gi,"''");
	var displayname = displayname2.replace(/\"/gi,"''");
	
	const emailstring = request.body.emails
	var email2 = emailstring.replace(/'/gi,"''");
	var email = email2.replace(/\"/gi,"''");
	
	var team = request.body.team_id;
	
	console.log("DESCRIPTION STRING: " + team)
  pool.query("INSERT INTO users (displayname, emails, password, team, username) VALUES ('" + displayname + "', '" + email + "', '" + password + "'," + team + ", '" + username +"')", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//------------------------------------------------------------------------------
//--------------------------------EXPORT MODULES--------------------------------
//------------------------------------------------------------------------------
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  selectAll,
  selectOpen,
  getProject,
  createProject,
  updateProject,
  selectInprocess,
  selectMyProjects,
  plusComment,
  selectCharts,
  selectExcel,
  deliverTables,
  selectCategories,
  addCategory,
  deleteCategory,
  deliverCategories,
  deliverLogin,
  createUser
}