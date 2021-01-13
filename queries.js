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
})

//------------------------------------------------------------------------------
//--------------------------------GENERIC QUERIES-------------------------------
//------------------------------------------------------------------------------
//-These queries exist temporarily for reference and will ultimately be deleted-
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query("ALTER TABLE projects ALTER COLUMN created_date SET DEFAULT now();", (error, results) => {
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

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

//------------------------------------------------------------------------------
//------------------------------SELECTS ALL PROJECTS----------------------------
//------------------------------------------------------------------------------
const selectAll = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "<table class='styled-table'><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
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
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
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
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//--------------------------SELECTS IN-PROCESS PROJECTS TEST-------------------------
//------------------------------------------------------------------------------
const selectTest = function(req, res) {
	const user = req.user.displayName;
	console.log("USER: " + user);
  const sql = "SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects WHERE (status = 'In-process' AND responsible = '" + user + "') OR (status = 'Open' AND responsible = '" + user + "') ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = "<table class='styled-table'><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>";
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

//------------------------------------------------------------------------------
//-------------------------------GETS PROJECT BY ID-----------------------------
//------------------------------------------------------------------------------
const getProject = (request, response) => {
  const id = parseInt(request.body.ticketID)
	console.log(request.body)
  pool.query("SELECT project_id, title, status, responsible, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate, description FROM projects WHERE project_id =" + id, (error, results) => {
    if (error) {
      throw error
    }
	var projectText = '<br><br>';
	results.rows.forEach(element => projectText += "<form action='/updateProject' method='post'> <b>TITLE:</b> <input type='text' name='title' id='title' value='" + element.title + "' hidden>" + element.title + "<br><br><b>STATUS:</b> <select id='statusSQL' name='statusSQL'><option value='Open'>Open</option><option value='In-process'>In-process</option><option value='Closed'>Closed</option></select><br><br><b>DUE DATE:</b> <input type='text' name='duedate' id='duedate' value='" + element.duedate + "'hidden>" + element.duedate + "<br><br><b>RESPONSIBLE:</b> <input type='text' name='responsible' id='responsible' value='" + element.responsible + "' hidden>" + element.responsible + "<br><br><b>PROJECT ID:</b> <input type='text' name='project_id' id='project_id' value='" + element.project_id + "' hidden>" + element.project_id + "<br><br><b>DESCRIPTION:</b> <input type='text' name='description' id=description value='" + element.description + "' hidden>" + element.description + "<br><br><input type='submit' value='Update Project'></form>");
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
//----------------DELIVERS THE PROJECT CREATION FORM (NO QUERIES)---------------
//------------------------------------------------------------------------------
const createProject = (request, response) => {
	var projectFrame = "<p><i>*Please do not use quotation marks or apostrophes in the form.</i></p><form action='/postProject' method='post' id='description'> <label for='title'>Title:</label><br><br><input type='text' name='title' id='title' pattern=[^'\x22]+><br><br><label for='statusSQL'>Status:</label><br><br><select id='statusSQL' name='statusSQL'><option value='Open'>Open</option><option value='In-process'>In-process</option><option value='Closed'>Closed</option></select><br><br><label for='responsible'>Responsible:</label><br><br><input type='text' name='responsible' id='responsible' pattern=[^'\x22]+><br><br><label for='duedate'>Due Date:</label><br><br><input type='date' name='duedate' id='duedate' pattern=[^'\x22]+><br><br><label for='description'>Description:</label><br><br><input type='text' style='width:300px; height:300px;' name='description' id='description' pattern=[^'\x22]+><br><br><input type='submit' value='Create Project'></form>";
	response.render("dashboard.ejs", {statusMessage: projectFrame})
}

//------------------------------------------------------------------------------
//-----------------------------CREATES NEW PROJECT------------------------------
//------------------------------------------------------------------------------
const postProject = (request, response) => {
	const title = request.body.title
	const description = request.body.description
	const statusSQL = request.body.statusSQL
	const responsible = request.body.responsible
	const duedate = request.body.duedate
	console.log("TITLE: " + title)
	const sql = "INSERT INTO projects(title, description, status, responsible, duedate) VALUES ('" + title + "', '" + description + "', '" + statusSQL + "', '" + responsible + "', '" + duedate + "')";
	pool.query(sql, (error, results) => {
	  if (error) {
		throw error;
	  }
	response.render("dashboard.ejs", {statusMessage: "Successfully created project: "})
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
  deleteUser,
  selectAll,
  selectOpen,
  getProject,
  createProject,
  postProject,
  updateProject,
  selectInprocess,
  selectTest,
}