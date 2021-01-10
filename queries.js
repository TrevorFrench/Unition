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
	  results.rows.forEach(element => tableText += '<tr><td><form id="projectform" action="/openProject" method="post"><input type=text name=ticketID value=' + element.project_id + ' id=' + element.project_id + ' hidden>' + '<input type="submit" value="' + element.title + '"></form></td><td>' + element.project_id + '</td><td>' + element.status + '</td><td>' + element.responsible + '</td><td>' + element.duedate + '</td><td>' + element.description + '</td></tr>');
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
	var projectText = 'Project listed below';
	results.rows.forEach(element => projectText += 'TITLE: ' + element.title + 'DESCRIPTION: ' + element.description);
    response.render("dashboard.ejs", {statusMessage: projectText})
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
}