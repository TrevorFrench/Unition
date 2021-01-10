const Pool = require('pg').Pool
const pool = new Pool({
  user: 'xdlepbswgkuwsn',
  host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
  database: 'd216rqdgnn6371',
  password: '43fc7fd35e724f6a212661eb4fd3ae514003079f9d3a56a56b2d96eb959dbaeb',
  port: 5432,
})
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

  pool.query("INSERT INTO projects(description, duedate, responsible, status, title) VALUES ('This is a test project with no action items.','2022-01-01', 'Trevor French', 'Open', 'Test Project')", (error, results) => {
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

const selectAll = function(req, res) {
  const sql = 'SELECT * FROM projects ORDER BY project_id ASC';
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = '<table><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>';
	  results.rows.forEach(element => tableText += '<tr><td>' + element.title + '</td><td>' + element.project_id + '</td><td>' + element.status + '</td><td>' + element.responsible + '</td><td>' + element.duedate + '</td><td>' + element.description + '</td></tr>');
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

const selectOpen = function(req, res) {
  const sql = "SELECT project_id, title, status, responsible, duedate, description FROM projects WHERE status = 'Open' ORDER BY project_id ASC";
  pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	  var tableText = '<table><tr><th>TITLE</th><th>PROJECT ID</th><th>STATUS</th><th>RESPONSIBLE</th><th>DUE DATE</th><th>DESCRIPTION</th></tr>';
	  results.rows.forEach(element => tableText += "<tr><td><form id='projectform' action='/openProject' method='post'><input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>" + "<input type='submit' value='" + element.title + "'></form></td><td>" + element.project_id + "</td><td>" + element.status + "</td><td>" + element.responsible + "</td><td>" + element.duedate + "</td><td>" + element.description + "</td></tr>");
	tableText += '</table>';
	res.render("dashboard.ejs", {statusMessage: tableText})
})
};

const getProject = (request, response) => {
  const id = parseInt(request.body.ticketID)
	console.log(request.body)
  pool.query('SELECT * FROM projects WHERE project_id =' + id, (error, results) => {
    if (error) {
      throw error
    }
	var projectText = 'Project listed below<br><br>';
	results.rows.forEach(element => projectText += "<form action='/updateProject' method='post'> <b>TITLE:</b> <input type='text' name='title' id='title' value='" + element.title + "' hidden>" + element.title + "<br><br><b>STATUS:</b> <input type='text' id='statusSQL' name='statusSQL' value='" + element.status + "'><br><br><b>DUE DATE:</b> <input type='text' name='duedate' id='duedate' value='" + element.duedate + "'hidden>" + element.duedate + "<br><br><b>RESPONSIBLE:</b> <input type='text' name='responsible' id='responsible' value='" + element.responsible + "' hidden>" + element.responsible + "<br><br><b>PROJECT ID:</b> <input type='text' name='project_id' id='project_id' value='" + element.project_id + "' hidden>" + element.project_id + "<br><br><b>DESCRIPTION:</b> <input type='text' name='description' id=description value='" + element.description + "' hidden>" + element.description + "<input type='submit' value='Update Project'></form>");
    response.render("dashboard.ejs", {statusMessage: projectText})
  })
}

const updateProject = (request, response) => {
	const title = request.body.title
	const description = request.body.description
	const statusSQL = request.body.statusSQL
	const responsible = request.body.responsible
	const duedate = request.body.duedate
	const id = parseInt(request.body.project_id)
	console.log("TITLE: " + title)
	const sql = "UPDATE projects SET status =" + statusSQL + " WHERE project_id =" + id;
	pool.query(sql, (error, results) => {
	  if (error) {
		  throw error;
	  }
	response.render("dashboard.ejs", {statusMessage: "Successfully updated project: "})
})
}

const createProject = (request, response) => {
	var projectFrame = "<form action='/postProject' method='post'> <label for='title'>Title:</label> <input type='text' name='title' id='title'><br><label for='description'>Description:</label><input type='text' name='description' id='description'><br><label for='statusSQL'>Status:</label><input type='text' name='statusSQL' id='statusSQL'><br><label for='responsible'>Responsible:</label><input type='text' name='responsible' id='responsible'><br><label for='duedate'>Due Date:</label><input type='date' name='duedate' id='duedate'><input type='submit' value='Create Project'></form>";
	response.render("dashboard.ejs", {statusMessage: projectFrame})
}

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
}