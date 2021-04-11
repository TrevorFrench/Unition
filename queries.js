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
//--------------------------------ADMINISTRATION--------------------------------
//------------------------------------------------------------------------------
const admin = (request, response) => {
	const sql = "ALTER TABLE categories ADD COLUMN pt_id int4;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows);
	});
}

//------------------------------------------------------------------------------
//--------------------------------GENERIC QUERIES-------------------------------
//------------------------------------------------------------------------------
//-These queries exist temporarily for reference and will ultimately be deleted-
const getUserById = (request, response) => {
	const id = parseInt(request.params.id);
	const sql = "SELECT * FROM c";
	pool.query(sql, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows);
	});
}

//------------------------------------------------------------------------------
//---------------------------DELETES SELECTED CATEGORY--------------------------
//------------------------------------------------------------------------------
const deleteCategory = (request, response) => {
	const category_id = parseInt(request.body.category_id);
	const sql = "DELETE FROM categories WHERE category_id = $1";
	pool.query(sql, [category_id], (error, results) => {
		if (error) {
		  throw error
		}
		deliverCategories(request, response);
	});
}

//------------------------------------------------------------------------------
//----------------------------ADDS SPECIFIED CATEGORY---------------------------
//------------------------------------------------------------------------------
const addCategory = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const namestring = request.body.category_name;
	var name2 = namestring.replace(/'/gi,"''");
	var name = name2.replace(/\"/gi,"''");
	const descriptionstring = request.body.category_description;
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const team = request.body.team_id;
	const sql = "INSERT INTO categories\
					(category\
						, description\
						, team_id\
					)\
				VALUES\
					('" + name + "'\
						,'" + description + "'\
						,'" + team + "'\
					);";
	
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		deliverCategories(request, response);
	});
}

//------------------------------------------------------------------------------
//------------------------------SELECTS ALL PROJECTS----------------------------
//------------------------------------------------------------------------------
const selectAll = function(req, res) {
	const user = req.user.id;
	const sql = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, id\
					, displayname \
				FROM projects \
					INNER JOIN users \
					ON id = TO_NUMBER(responsible, '99G999D9S') \
					WHERE (responsible = '" + user + "') \
				ORDER BY project_id DESC;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'>\
						<tr><th>TITLE</th><th>ID</th>\
							<th>STATUS</th>\
							<th>RESPONSIBLE</th>\
							<th>DUE DATE</th>\
							<th>DESCRIPTION</th>\
						</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' \
							value='" + element.title + "'>\
					</form>\
				</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
			</tr>"
		);
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//-------------------------SELECTS ALL PROJECTS FOR EXCEL-----------------------
//------------------------------------------------------------------------------
const selectExcel = function(req, res) {
	const sql = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, TO_CHAR(created_date, 'MM/DD/YYYY') AS created_date\
					, customer\
					, category \
				FROM projects \
				ORDER BY project_id DESC;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'>\
						<tr><th>TITLE</th>\
							<th>ID</th><th>STATUS</th>\
							<th>RESPONSIBLE</th>\
							<th>DUE DATE</th>\
							<th>DESCRIPTION</th>\
							<th>Created Date</th>\
							<th>Customer</th>\
							<th>Category</th>\
						</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.title + "</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.responsible + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
				<td>" + element.created_date + "</td>\
				<td>" + element.customer + "</td>\
				<td>" + element.category + "</td>\
			</tr>"
		);
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//-----------------------------SELECTS OPEN PROJECTS----------------------------
//------------------------------------------------------------------------------
const selectOpen = function(req, res) {
	const user = req.user.id;
	const sql = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, id\
					, displayname \
				FROM projects \
					INNER JOIN users \
					ON id = TO_NUMBER(responsible, '99G999D9S') \
					WHERE (status = 'Open' \
						AND responsible = '" + user + "') \
				ORDER BY project_id ASC;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'>\
						<tr><th>TITLE</th>\
							<th>ID</th>\
							<th>STATUS</th>\
							<th>RESPONSIBLE</th>\
							<th>DUE DATE</th>\
							<th>DESCRIPTION</th>\
						</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' \
						value='" + element.title + "'>\
					</form>\
				</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
			</tr>"
		);
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//--------------------------SELECTS IN-PROCESS PROJECTS-------------------------
//------------------------------------------------------------------------------
const selectInprocess = function(req, res) {
	const user = req.user.id;
	const sql = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, id\
					, displayname \
				FROM projects \
					INNER JOIN users \
					ON id = TO_NUMBER(responsible, '99G999D9S') \
					WHERE (status = 'In-process' \
						AND responsible = '" + user + "') \
				ORDER BY project_id ASC;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'>\
				<tr><th>TITLE</th>\
					<th>ID</th>\
					<th>STATUS</th>\
					<th>RESPONSIBLE</th>\
					<th>DUE DATE</th>\
					<th>DESCRIPTION</th>\
				</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' \
							value='" + element.title + "'>\
					</form>\
				</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
			</tr>"
		);
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//---------------SELECTS IN-PROCESS & OPEN PROJECTS (MY PROJECTS)---------------
//------------------------------------------------------------------------------
const selectMyProjects = function(req, res) {
	const user = req.user.id;
	const sql = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, id\
					, displayname \
				FROM projects \
					INNER JOIN users \
					ON id = TO_NUMBER(responsible, '99G999D9S') \
					WHERE (status = 'In-process' \
						AND responsible = '" + user + "') \
					OR (status = 'Open' \
						AND responsible = '" + user + "') \
				ORDER BY project_id ASC;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'>\
			<tr><th>TITLE</th>\
				<th>ID</th>\
				<th>STATUS</th>\
				<th>RESPONSIBLE</th>\
				<th>DUE DATE</th>\
				<th>DESCRIPTION</th>\
			</tr>";
		results.rows.forEach(element =>
			tableText += "<tr>\
				<td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit'  class='projectTitle' \
							value='" + element.title.replace(/'/gi,"''") + "'>\
					</form>\
				</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
			</tr>");
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//---------------------------DELIVERS THE TABLES VIEW---------------------------
//------------------------------------------------------------------------------
const deliverTables = function(req, res) {
	var tableText = "<table class='styled-table'><tbody>\
			<tr><th>TABLE LIST</th><th>Description</th></tr>\
			<tr><td>\
					<form action='/categories' method='post'>\
						<input type='submit' name='delivercategories' \
							value='Categories' class='projectTitle'>\
					</form>\
				</td>\
				<td>Returns a table containing all categories.</td>\
			</tr>\
		</tbody></table>";
	res.render("dashboard.ejs", {statusMessage: tableText});
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
		var tableText = "<table class='styled-table'><tbody>\
			<tr><th>Category</th>\
				<th>Description</th>\
				<th>Action</th>\
			</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.category + "</td>\
				<td>" + element.description + "</td>\
				<td><form action='/deleteCategory' method='post'>\
						<input type='text' id='category_id' name='category_id' \
							value='" + element.category_id + "' hidden>\
						<input type='submit' name='deletecategory' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += "<tr>\
			<td><form action='/addCategory' method='POST'>\
				<input type='text' name='category_name' id='category_name' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
			</td>\
			<td><input type='text' name='category_description' \
			id='category_description' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
				<input type='text' name='team_id' id='team_id' \
				value='" + team_id + "' hidden>\
			</td>\
			<td><input type='submit' class='redButton'></td>\
		</tr></tbody></table>";
		res.render("dashboard.ejs", {statusMessage: tableText});
	});
};

//------------------------------------------------------------------------------
//-------------------------------GETS PROJECT BY ID-----------------------------
//------------------------------------------------------------------------------
const getProject = (request, response) => {
	const id = parseInt(request.body.ticketID);
	const sql = "SELECT projects.project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, projects.description AS description\
					, comments.description AS commentdescription\
					, TO_CHAR(comments.created_date, 'MM/DD/YYYY') \
						AS commentcreateddate\
					, comments.created_by AS commentcreatedby\
					, users.id\
					, displayname \
				FROM projects \
					INNER JOIN users \
						ON id = TO_NUMBER(responsible, '99G999D9S') \
					LEFT JOIN comments \
						ON projects.project_id = comments.project_id \
					WHERE projects.project_id =" + id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		var projectText = '';
		projectText += "<div class='projectDiv'>\
			<form action='/updateProject' method='post' \
				style='white-space:pre-line;'>\
				<input type='text' name='title' id='title' \
					value='" + results.rows[0].title + "' hidden>\
				<h2 class='title'>" + results.rows[0].title + "</h2>\
				<div class='row'>\
					<div class='col-25'>\
						<label for='statusSQL'><b>STATUS:</b></label>\
					</div>\
					<div class='col-75'>\
						<select id='statusSQL' name='statusSQL' \
							style='width: 100%;padding: 12px;\
							border: 1px solid #ccc;border-radius: 4px; \
							resize: vertical;'>\
							<option value='Open'>Open</option>\
							<option value='In-process'>In-process</option>\
							<option value='Closed'>Closed</option>\
						</select>\
					</div>\
				</div>\
				<br><b>DUE DATE:</b>\
					<input type='text' name='duedate' id='duedate' \
						value='" + results.rows[0].duedate + "'hidden>\
						" + results.rows[0].duedate + "\
				<br><br><b>RESPONSIBLE:</b>\
					<input type='text' name='responsible' id='responsible' \
						value='" + results.rows[0].responsible + "' hidden>\
						" + results.rows[0].displayname + "\
				<br><br><b>PROJECT ID:</b>\
					<input type='text' name='project_id' id='project_id' \
						value='" + results.rows[0].project_id + "' hidden>\
						" + results.rows[0].project_id + "\
				<br><br><b>DESCRIPTION:</b>\
					<input type='text' name='description' id=description \
						value='" + results.rows[0].description + "' hidden>\
						" + results.rows[0].description + "\
				<br><br>\
					<input type='submit' value='Update Project' class='blueButton'>\
			</form>\
			</div>\
			<br><br>\
			<div class='projectDiv'>\
				<form action='/addComment' method='post' id='commentDescription' \
					style='white-space:pre-line;'>\
					<label for='commentDescription'>Comments:</label>\
					<br><br>\
					<textarea \
						style='width: 100%;padding: 12px;border: 1px solid #ccc;\
						border-radius: 4px; resize: vertical;' \
						name='commentDescription' id='commentDescription' \
						form='commentDescription' \
						Placeholder='Describe your comment here...'>\
					</textarea>\
					<input type='text' name='project_id' id='project_id' \
						value='" + results.rows[0].project_id + "' hidden>\
					<br><br>\
					<input type='submit' value='Add Comment' class='redButton'>\
					</input>\
				</form>\
			</div>";
		if(results.rows[0].commentdescription != null) {
			results.rows.forEach(element => 
				projectText += "<br><br>\
					<div class='commentDiv'>\
						<b>" + element.commentcreatedby + "</b> \
						(" + element.commentcreateddate + ")\
						<br>" + element.commentdescription + "\
					</div>"
			);
		}
		response.render("dashboard.ejs", {statusMessage: projectText});
	});
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
	const sql = "UPDATE projects \
					SET status = '" + statusSQL + "' \
					WHERE project_id = " + id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var successMessage = "Successfully updated project: ";
		response.render("dashboard.ejs", {statusMessage: successMessage});
	});
}

//------------------------------------------------------------------------------
//----------------DELIVERS THE PROJECT CREATION FORM (UNUSED)---------------
//------------------------------------------------------------------------------
const createProject = (request, response) => {
	var projectFrame = "<p><i>\
			*Please do not use quotation marks or apostrophes in the form.\
		</i></p>\
		<form action='/postProject' method='post' id='description'>\
			<label for='title'>Title:</label><br><br>\
				<input type='text' name='title' id='title' \
					pattern=[^'\x22]+><br><br>\
			<label for='statusSQL'>Status:</label><br><br>\
				<select id='statusSQL' name='statusSQL'>\
					<option value='Open'>Open</option>\
					<option value='In-process'>In-process</option>\
					<option value='Closed'>Closed</option>\
				</select>\
			<br><br>\
			<label for='responsible'>Responsible:</label><br><br>\
				<input type='text' name='responsible' id='responsible' \
					pattern=[^'\x22]+><br><br>\
			<label for='duedate'>Due Date:</label><br><br>\
				<input type='date' name='duedate' id='duedate' \
					pattern=[^'\x22]+>\
			<br><br>\
			<label for='description'>Description:</label><br><br>\
				<textarea style='width:450px; height:100px;' \
					name='description' id='description' form='description' \
					Placeholder='Describe your project here...'>\
				</textarea>\
			<br><br>\
			<input type='submit' value='Create Project'>\
		</form>";
	response.render("dashboard.ejs", {statusMessage: projectFrame});
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
	const sql = "INSERT INTO comments(\
					created_by\
					, description\
					, project_id\
					) VALUES (\
					'" + user + "'\
					, '" + description + "'\
					, '" + project_id + "' \
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var successMessage = "Successfully added comment: ";
		response.render("dashboard.ejs", {statusMessage: successMessage});
	});
}

//------------------------------------------------------------------------------
//---------------------------------RENDER CHARTS--------------------------------
//------------------------------------------------------------------------------
const selectCharts = (request, response) => {
	const user = request.user.id;
	const sql = "SELECT DISTINCT\
					CONCAT(date_part('year', created_date)\
						, '-'\
						, date_part('month', created_date)) \
					AS PROJECT_MONTH\
					, COUNT(DISTINCT project_id) AS PROJECT_COUNT\
				FROM projects \
				WHERE (responsible = '" + user + "')\
					GROUP BY date_part('year', created_date)\
					, date_part('month', created_date)\
				ORDER BY PROJECT_MONTH;";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		let dataArray = [];
		let labelArray = [];
		results.rows.forEach(element => 
			labelArray.push("'" + element.project_month + "'")
		);
		var texts= "labels: [" + labelArray + "],\
					datasets: [{\
					label: '# of Projects',\
					data: " 
		results.rows.forEach(element => 
			dataArray.push(element.project_count)
		);
		
		let googleArray = [];
		results.rows.forEach(element =>
			googleArray.push("['" + element.project_month + "' ," + parseInt(element.project_count) + "]")
		);
		texts+= "[" + dataArray + "]";
		console.log(googleArray);
		const sql2 = "SELECT category, COUNT(category) AS CATEGORY_COUNT FROM projects WHERE (responsible = '" + user + "') GROUP BY category ORDER BY category_COUNT DESC;";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			
			let categoryArray = [];
			results.rows.forEach(element =>
					categoryArray.push("['" + element.category + "', " + parseInt(element.category_count) + "]")
				);
			console.log(categoryArray)
			const sql3 = "SELECT customer, COUNT(customer) AS CUSTOMER_COUNT FROM projects WHERE (responsible = '" + user + "') GROUP BY customer ORDER BY CUSTOMER_COUNT DESC;";
			pool.query(sql3, (error, results) => {
				if (error) {
					throw error;
				}
				let customerArray = [];
				results.rows.forEach(element =>
						customerArray.push("['" + element.customer + "', " + parseInt(element.customer_count) + "]")
					);
				console.log(customerArray)
				
				response.render("charts.ejs", {statusMessage: googleArray, categoryData: categoryArray, customerData: customerArray});
			});
		});
	});
}

//------------------------------------------------------------------------------
//-----------------------------DELIVER LOGIN SCREEN-----------------------------
//------------------------------------------------------------------------------
const deliverLogin = (request, response) => {
	const sql = "SELECT MAX(team) from users;"
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var maxNumber = parseInt(results.rows[0].max) + 1;
		response.render("login.ejs", {statusMessage: maxNumber});
	});
}

//------------------------------------------------------------------------------
//-------------------------DELIVER LOGIN SUCCESS SCREEN-------------------------
//------------------------------------------------------------------------------
const deliverLoginSuccess = (request, response) => {
	const sql = "SELECT MAX(team) from users;"
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var maxNumber = parseInt(results.rows[0].max) + 1;
		response.render("loginSuccess.ejs", {
			statusMessage: maxNumber, successMessage: "SUCCESS"
			}
		);
	});
}

//------------------------------------------------------------------------------
//-----------------------------DELIVER TEAMS 2 VIEW-----------------------------
//------------------------------------------------------------------------------
const teams2 = (request, response) => {
	const user = request.user.id;
	const sql = "SELECT pt_id\
					, user_id\
					, join_table.pt_role_id\
					, users.displayname AS displayname\
					, pro_team_name\
					, pt_role_name \
				FROM join_table \
				INNER JOIN users \
					ON users.id = join_table.user_id \
				INNER JOIN pro_team \
					ON pro_team_id = pt_id \
				INNER JOIN pro_team_roles \
					ON pro_team_roles.pt_role_id = join_table.pt_role_id \
				WHERE user_id =" + user + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'><tbody>\
			<tr><th>TEAM</th>\
				<th>USER</th>\
				<th>ROLE</th>\
				<th>ACTION</th>\
			</tr>";
		var teamsVar = "";
		results.rows.forEach(element =>
			tableText += "<tr>\
				<td>" + element.pro_team_name + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.pt_role_name + "</td>\
				<td><form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='View Team' class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += '</table>';
		results.rows.forEach(element =>
			teamsVar += "<li>" + element.pro_team_name + "</li>"
		);
		if (results.rows[0] == null) {
			tableText = "NO TEAMS YET =(";
			teamsVar = "CREATE A TEAM";
			};
		response.render("teams.ejs", {
			statusMessage: tableText, teamsList: teamsVar
			}
		);
	});
}

//------------------------------------------------------------------------------
//-----------------------------DELIVER TEAMS BY ID------------------------------
//------------------------------------------------------------------------------
const deliverTeams = (request, response) => {
	const sql = "SELECT pro_team_name\
					, displayname \
				FROM pro_team \
				INNER JOIN join_table \
					ON pro_team_id = pt_id \
				INNER JOIN users \
					ON users.id = join_table.user_id \
				WHERE pro_team_id =" + request.body.teamid + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var title = "<div class='nextRow'> <h3>" + results.rows[0].pro_team_name + "</h3>Announcements:</div>"
		var usersText = "<table class='styled-table'><tbody><tr><th>Users</th></tr>";
		var teamsVar = results.rows[0].pro_team_name;
		results.rows.forEach(element => 
			usersText += "<tr><td>" + element.displayname + "</td></tr>"
		);
		usersText += "</tbody></table>";
		const sql2 = "SELECT * FROM projects \
						WHERE pt_id =" + request.body.teamid + ";";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			var projectsText = "<table class='styled-table'><tbody>\
				<tr><th>Projects</th></tr>";
			var myProjects = "<table class='styled-table'><tbody>\
				<tr><th>Projects Assigned to Me</th></tr>";
			results.rows.forEach(element => 
				projectsText += "<tr><td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit'  class='projectTitle' \
							value='" + element.title.replace(/'/gi,"''") + "'>\
					</form></td></tr>"				
			);
			
			let sqlResults = results.rows;		
			let mineProjects = [];
			for (let i = 0; i < sqlResults.length; i++) {
				if (parseInt(sqlResults[i].responsible) == request.user.id) {
					mineProjects.push(sqlResults[i]);
				}
			}
			console.log(mineProjects);
			
			mineProjects.forEach(element => myProjects += "<tr><td>" + element.title + "</td></tr>");
			myProjects += "</table>"
			console.log(myProjects)
			projectsText += "</table>";
			var buttons = "<form action='/createTeamProject' method='post'>\
					<input type='text' name='pt_id' id='pt_id'value=" + request.body.teamid + " hidden>\
					<input class='redButton' type='submit' style='width:250px;' value='Create Team Project'>\
			</form>"
			var tableText = buttons + title + "<table><tr><td style='vertical-align: baseline;'>" + projectsText + "</td><td style='vertical-align: baseline;'>" + myProjects + "</td></tr></table><br>" + usersText;
			response.render("teams.ejs", {
				statusMessage: tableText, teamsList: teamsVar
				}
			);
		});
	});
}

//------------------------------------------------------------------------------
//----------------------------------CREATE USER---------------------------------
//------------------------------------------------------------------------------
const createUser = (request, response) => {

	//--------This sequence processes apostrophes/quotes--------
	const usernamestring = request.body.username
	var username2 = usernamestring.replace(/'/gi,"''");
	var username = username2.replace(/\"/gi,"''");
	//----------------------------------------------------------

	//--------This sequence processes apostrophes/quotes--------
	const passwordstring = request.body.password
	var password2 = passwordstring.replace(/'/gi,"''");
	var password = password2.replace(/\"/gi,"''");
	//----------------------------------------------------------

	//--------This sequence processes apostrophes/quotes--------
	const displaynamestring = request.body.displayname
	var displayname2 = displaynamestring.replace(/'/gi,"''");
	var displayname = displayname2.replace(/\"/gi,"''");
	//----------------------------------------------------------

	//--------This sequence processes apostrophes/quotes--------
	const emailstring = request.body.emails
	var email2 = emailstring.replace(/'/gi,"''");
	var email = email2.replace(/\"/gi,"''");
	//----------------------------------------------------------

	var team = request.body.team_id;
	const sql = "INSERT INTO users (\
					displayname\
					, emails\
					, password\
					, team\
					, username\
					) VALUES ('\
						" + displayname + "'\
						, '" + email + "'\
						, '" + password + "'\
						," + team + "\
						, '" + username +"'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			response.status(201).send(
				'There was an error. Username may already exist.' + error
			);
		}
		deliverLoginSuccess(request, response);
	});
}

//------------------------------------------------------------------------------
//------------------------------USER JOINS A TEAM-------------------------------
//------------------------------------------------------------------------------
const joinTeam = function(req, res) {
	const sql = "SELECT * from pro_team WHERE pro_team_id = " + req.body.team_id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		let sqlID = [];
		results.rows.forEach(element => sqlID.push(element.pro_team_id));
		let sqlName = [];
		results.rows.forEach(element => sqlName.push(element.pro_team_name));
		//MAKE SURE TEAM ID EXISTS	 	
		if (sqlID[0] != null) {
			console.log("ID EXISTS")
			//IF IT DOES EXIST, CHECK TO MAKE SURE TEAM NAME MATCHES
			if (req.body.team_name == results.rows[0].pro_team_name) {
				console.log("TEAM NAME MATCHES")									
					//MAKE SURE USER ISN'T ALREADY PART OF THE TEAM
					const sql2 = "SELECT * FROM join_table WHERE user_id =" + req.user.id + " AND pt_id=" + req.body.team_id + ";";
					pool.query(sql2, (error, results) => {
						if (error) {
							throw error;
						}
						if (results.rows[0] != null) {
							//DO NOT JOIN TEAM
							res.render("dashboard.ejs", {statusMessage: "FAILURE (0): You are already part of this team! Navigate to the 'Teams' tab to interact with your teammates."});
							console.log("USER ALREADY EXISTS")
						} else {
						console.log("USER IS NOT ALREADY PART OF THE TEAM")
						
						//JOIN TEAM
						const sql3 = "INSERT INTO join_table(pt_id, user_id, pt_role_id) VALUES (" + req.body.team_id + ", " + req.user.id + ", " + 1 + ");";
						pool.query(sql3, (error, results) => {
							if (error) {
								throw error;
							}
							console.log("SUCCESSFULLY ADDED USER TO TEAM")
							res.render("dashboard.ejs", {statusMessage: "You have been added to the team successfully. Navigate to the 'Teams' tab to start collaborating!"});
							});
						}
					});
										
			} else {
				var tableText = "";
				//DO NOT JOIN TEAM
				console.log("FAILURE1: NAME DOES NOT EXIST")
				res.render("dashboard.ejs", {statusMessage: "FAILURE (1): TEAM NAME DOES NOT MATCH ID. Please double-check your spelling and try again."});
			}

		} else {
			//DO NOT JOIN TEAM
			console.log("FAILURE2: TEAM ID DOES NOT EXIST")
			res.render("dashboard.ejs", {statusMessage: "FAILURE (2): TEAM ID DOES NOT EXIST"});
			}							 
	});
};

//------------------------------------------------------------------------------
//-----------------------USER CREATES A TEAM AND JOINS IT-----------------------
//------------------------------------------------------------------------------
const createTeam = function(req, res) {
	const sql = "SELECT * from pro_team WHERE pro_team_name = '" + req.body.team_name + "';";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		let sqlID = [];
		results.rows.forEach(element => sqlID.push(element.pro_team_id));
		let sqlName = [];
		results.rows.forEach(element => sqlName.push(element.pro_team_name));
		//MAKE SURE TEAM ID DOES NOT EXIST	 	
		if (sqlID[0] == null) {
			console.log("NAME DOES NOT EXIST")								
				//**LEFT OFF HERE * HANDLE SQLi for these functions		//CREATE TEAM (IN THE PRO_TEAM TABLE AND THEN PULL THE PRO_TEAM_ID AND ADD IT TO THE JOIN_TABLE
						const sql2 = "INSERT INTO pro_team(pro_team_name) VALUES ('" + req.body.team_name + "') RETURNING pro_team_id;";
						pool.query(sql2, (error, results) => {
							if (error) {
								throw error;
							}
							console.log("TESTING RETURNING: " + results.rows[0].pro_team_id)
							const sql3 = "INSERT INTO join_table(pt_id, pt_role_id, user_id) VALUES (" + results.rows[0].pro_team_id + ", " + 1 + ", " + req.user.id + ");";
							pool.query(sql3, (error, results) => {
								if (error) {
									throw error;
								}
							console.log("SUCCESSFULLY ADDED USER TO TEAM")
							res.render("dashboard.ejs", {statusMessage: "You have created the team successfully. Navigate to the 'Teams' tab to start collaborating!"});
							});
						
					});
										


		} else {
			//DO NOT JOIN TEAM
			console.log("FAILURE2: TEAM NAME ALREADY EXISTS")
			res.render("dashboard.ejs", {statusMessage: "FAILURE (2): TEAM NAME ALREADY EXISTS"});
			}							 
	});
};

//------------------------------------------------------------------------------
//------------------------DELIVERS THE CREATE TEAM VIEW-------------------------
//------------------------------------------------------------------------------
const deliverCreateTeam = function(req, res) {
	var tableText = "<form action='/createTeam' method='POST'>\
			<input type='text' name='user_id' id='user_id' value=" + req.user.id + " hidden>\
			<label for='team_name'>Team Name:</label><br><br>\
			<input type='text' name='team_name' id='team_name'>\
			<input class='redButton' type='submit' style='width:250px;' value='Create Team'>\
		</form>";
	res.render("dashboard.ejs", {statusMessage: tableText});
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE JOIN TEAM VIEW--------------------------
//------------------------------------------------------------------------------
const deliverJoinTeam = function(req, res) {
	var tableText = "<form action='/joinTeam' method='POST'>\
			<input type='text' name='user_id' id='user_id' value=" + req.user.id + " hidden>\
			<label for='team_name'>Team Name:</label><br><br>\
			<input type='text' name='team_name' id='team_name'>\
			<label for='team_id'>Team ID:</label><br><br>\
			<input type='number' name='team_id' id='team_id'>\
			<input class='redButton' type='submit' style='width:250px;' value='Join Team'>\
		</form>";
	res.render("dashboard.ejs", {statusMessage: tableText});
};

//------------------------------------------------------------------------------
//--------------------------------EXPORT MODULES--------------------------------
//------------------------------------------------------------------------------
module.exports = {
  admin,
  getUserById,
  createUser,
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
  addCategory,
  deleteCategory,
  deliverCategories,
  deliverLogin,
  createUser,
  deliverLoginSuccess,
  teams2,
  deliverTeams,
  deliverJoinTeam,
  joinTeam,
  createTeam,
  deliverCreateTeam
}