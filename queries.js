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
	const sql = "delete from stripe where checkout_session_id = 'cs_00000000000000';";
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
//----------------------------ADDS SPECIFIED CAMPAIGN---------------------------
//------------------------------------------------------------------------------
const addCampaign = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const namestring = request.body.name;
	var name2 = namestring.replace(/'/gi,"''");
	var name = name2.replace(/\"/gi,"''");
	const resourcestring = request.body.resource;
	var resource2 = resourcestring.replace(/'/gi,"''");
	var resource = resource2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const user = request.user.id;
	const sql = "INSERT INTO campaigns\
					(name\
						, start_date\
						, end_date\
						, resource\
						, pcomplete\
						, user_id\
					)\
				VALUES\
					('" + name + "'\
						,'" + request.body.start + "'\
						,'" + request.body.end + "'\
						,'" + request.body.resource + "'\
						,'" + request.body.pcomplete + "'\
						,'" + user + "'\
					);";
	
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		deliverCampaigns(request, response);
	});
}

//------------------------------------------------------------------------------
//---------------------------DELETES SELECTED CAMPAIGN--------------------------
//------------------------------------------------------------------------------
const deleteCampaign = (request, response) => {
	const campaign_id = parseInt(request.body.campaign_id);
	const sql = "DELETE FROM campaigns WHERE campaign_id = $1";
	pool.query(sql, [campaign_id], (error, results) => {
		if (error) {
		  throw error
		}
		deliverCampaigns(request, response);
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
//------------------------DELETES SELECTED TEAM CATEGORY------------------------
//------------------------------------------------------------------------------
const deleteTeamCategory = (request, response) => {
	const category_id = parseInt(request.body.category_id);
	const sql = "DELETE FROM categories WHERE category_id = $1";
	pool.query(sql, [category_id], (error, results) => {
		if (error) {
		  throw error
		}
		deliverTeamCategories(request, response);
	});
}

//------------------------------------------------------------------------------
//------------------------DELETES SELECTED TEAM ANNOUNCEMENT--------------------
//------------------------------------------------------------------------------
const deleteAnnouncement = (request, response) => {
	const teamID = parseInt(request.body.teamID);
	const sql = "UPDATE pro_team SET announcements = '' WHERE pro_team_id = " + teamID;
	pool.query(sql, (error, results) => {
		if (error) {
		  throw error
		}
		deliverTeamAnnouncements(request, response);
	});
}

//------------------------------------------------------------------------------
//-----------------------ADDS SPECIFIED TEAM ANNOUNCEMENT-----------------------
//------------------------------------------------------------------------------
const addAnnouncement = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const announcementstring = request.body.announcement;
	var announcement2 = announcementstring.replace(/'/gi,"''");
	var announcement = announcement2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const team = parseInt(request.body.teamID);
	const sql = "UPDATE pro_team\
					SET announcements = '" + announcement + "' WHERE pro_team_id = " + team + ";";
	
	pool.query(sql, (error, results) => {
		if (error) {
			throw error
		}
		deliverTeamAnnouncements(request, response);
	});
}

//------------------------------------------------------------------------------
//-------------------------ADDS SPECIFIED TEAM CATEGORY-------------------------
//------------------------------------------------------------------------------
const addTeamCategory = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const namestring = request.body.category_name;
	var name2 = namestring.replace(/'/gi,"''");
	var name = name2.replace(/\"/gi,"''");
	const descriptionstring = request.body.category_description;
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const team = request.body.teamID;
	const sql = "INSERT INTO categories\
					(category\
						, description\
						, pt_id\
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
		deliverTeamCategories(request, response);
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
//------------------------DELETES SELECTED TEAM CUSTOMER------------------------
//------------------------------------------------------------------------------
const deleteTeamCustomer = (request, response) => {
	const customer_id = parseInt(request.body.customer_id);
	const sql = "DELETE FROM customers WHERE customer_id = $1";
	pool.query(sql, [customer_id], (error, results) => {
		if (error) {
		  throw error
		}
		deliverTeamCustomers(request, response);
	});
}

//------------------------------------------------------------------------------
//---------------------------DELETES SELECTED CUSTOMER--------------------------
//------------------------------------------------------------------------------
const deleteCustomer = (request, response) => {
	const customer_id = parseInt(request.body.customer_id);
	const sql = "DELETE FROM customers WHERE customer_id = $1";
	pool.query(sql, [customer_id], (error, results) => {
		if (error) {
		  throw error
		}
		deliverCustomers(request, response);
	});
}

//------------------------------------------------------------------------------
//-------------------------ADDS SPECIFIED TEAM CUSTOMER-------------------------
//------------------------------------------------------------------------------
const addTeamCustomer = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const namestring = request.body.customer_name;
	var name2 = namestring.replace(/'/gi,"''");
	var name = name2.replace(/\"/gi,"''");
	const descriptionstring = request.body.customer_description;
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const team = request.body.teamID;
	const sql = "INSERT INTO customers\
					(customer\
						, description\
						, pt_id\
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
		deliverTeamCustomers(request, response);
	});
}

//------------------------------------------------------------------------------
//----------------------------ADDS SPECIFIED CUSTOMER---------------------------
//------------------------------------------------------------------------------
const addCustomer = (request, response) => {
	
	//--------This sequence processes apostrophes/quotes--------
	const namestring = request.body.customer_name;
	var name2 = namestring.replace(/'/gi,"''");
	var name = name2.replace(/\"/gi,"''");
	const descriptionstring = request.body.customer_description;
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	//----------------------------------------------------------
	
	const team = request.body.team_id;
	const sql = "INSERT INTO customers\
					(customer\
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
		deliverCustomers(request, response);
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
		var tableText = "<div class='projectFilters'>\
			<form action='/openProjects' method='post'>\
				<input type='submit' name='openprojects' value='Open Projects' class='filterButton'>\
			</form>\
			<form action='/inprocessProjects' method='post'>\
				<input type='submit' name='inprocessprojects' value='In-Process Projects' class='filterButton'>\
			</form>\
			<form action='/allProjects' method='post'>\
			<input type='submit' name='allprojects' value='All Projects' class='filterButton'>\
			</form>\
			<form action='/myProjects' method='get'>\
				<input type='submit' name='myprojects' value='My Projects' class='filterButton'>\
			</form>\
			</div>\
			<br>\
		<table class='styled-table'>\
						<tr><th>TITLE</th><th>ID</th>\
							<th>STATUS</th>\
							<th>RESPONSIBLE</th>\
							<th>DUE DATE</th>\
							<th>DESCRIPTION</th>\
						</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td><form id='projectform' action='/openProject' method='post'>\
						<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' value='" + element.title.replace(/'/g,"&#39;") + "'>\
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
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
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
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
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
		var tableText = "<div class='projectFilters'>\
			<form action='/openProjects' method='post'>\
				<input type='submit' name='openprojects' value='Open Projects' class='filterButton'>\
			</form>\
			<form action='/inprocessProjects' method='post'>\
				<input type='submit' name='inprocessprojects' value='In-Process Projects' class='filterButton'>\
			</form>\
			<form action='/allProjects' method='post'>\
				<input type='submit' name='allprojects' value='All Projects' class='filterButton'>\
			</form>\
			<form action='/myProjects' method='get'>\
				<input type='submit' name='myprojects' value='My Projects' class='filterButton'>\
			</form>\
			</div>\
			<br>\
			<table class='styled-table'>\
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
						<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' value='" + element.title.replace(/'/g,"&#39;") + "'>\
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
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
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
		var tableText = "<div class='projectFilters'>\
			<form action='/openProjects' method='post'>\
				<input type='submit' name='openprojects' value='Open Projects' class='filterButton'>\
			</form>\
			<form action='/inprocessProjects' method='post'>\
				<input type='submit' name='inprocessprojects' value='In-Process Projects' class='filterButton'>\
			</form>\
			<form action='/allProjects' method='post'>\
				<input type='submit' name='allprojects' value='All Projects' class='filterButton'>\
			</form>\
			<form action='/myProjects' method='get'>\
				<input type='submit' name='myprojects' value='My Projects' class='filterButton'>\
			</form></div><br>\
			<table class='styled-table'>\
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
						<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
						<input type='submit' class='projectTitle' value='" + element.title.replace(/'/g,"&#39;") + "'>\
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
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
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
		var tableText = "<div class='projectFilters'>\
			<form action='/openProjects' method='post'>\
				<input type='submit' name='openprojects' value='Open Projects' class='filterButton'>\
			</form>\
			<form action='/inprocessProjects' method='post'>\
				<input type='submit' name='inprocessprojects' value='In-Process Projects' class='filterButton'>\
			</form>\
			<form action='/allProjects' method='post'>\
				<input type='submit' name='allprojects' value='All Projects' class='filterButton'>\
			</form>\
			<form action='/myProjects' method='get'>\
				<input type='submit' name='myprojects' value='My Projects' class='filterButton'>\
			</form>\
			</div>\
			<br>\
			<table class='styled-table'>\
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
						<input type='text' name='ticketID' value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit'  class='projectTitle' \
							value='" + element.title.replace(/'/g,"&#39;") + "'>\
					</form>\
				</td>\
				<td>" + element.project_id + "</td>\
				<td>" + element.status + "</td>\
				<td>" + element.displayname + "</td>\
				<td>" + element.duedate + "</td>\
				<td>" + element.description + "</td>\
			</tr>");
		tableText += '</table>';
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
};

//------------------------------------------------------------------------------
//---------------------------DELIVERS THE TABLES VIEW---------------------------
//------------------------------------------------------------------------------
const deliverTables = function(req, res) {
	const sql = "SELECT * FROM join_table INNER JOIN pro_team ON pro_team_id = pt_id WHERE user_id =" + req.user.id + " AND pt_role_id = 1;";
	const sqltracking = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'admin'\
					, '" + req.user.id + "'\
					);";
					
	pool.query(sqltracking, (error, results) => {
			if (error) {
				throw error;
			}
			
		
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
			
			var themeText = "<table class='styled-table'><tbody>\
			<tr><th>Theme</th><th>Description</th><th>Action</th></tr>\
			<tr><td>\
					Default\
				</td>\
				<td>Default dark theme</td>\
				<td>\
					<form action='/defaultDark' method='post'>\
							<input type='submit' name='defaultdark' \
								value='Change' class='projectTitle'>\
					</form>\
					</td>\
			</tr>\
			<tr><td>\
					Light Theme\
				</td>\
				<td>Bright white theme.</td>\
				<td>\
				<form action='/lightTheme' method='post'>\
							<input type='submit' name='lightTheme' \
								value='Change' class='projectTitle'>\
					</form>\
				</td>\
			</tr>\
			<tr><td>\
					Dashboard\
				</td>\
				<td>Dashboard theme.</td>\
				<td>\
				<form action='/dashboardTheme' method='post'>\
							<input type='submit' name='dashboardTheme' \
								value='Change' class='projectTitle'>\
					</form>\
				</td>\
			</tr>\
		</tbody></table><br>";
			
		var tableText = "<table class='styled-table'><tbody>\
				<tr><th>Personal Administration</th><th>Description</th></tr>\
				<tr><td>\
						<form action='/categories' method='post'>\
							<input type='submit' name='delivercategories' \
								value='Categories' class='projectTitle'>\
						</form>\
					</td>\
					<td>Returns a table containing all categories.</td>\
				</tr>\
				<tr><td>\
						<form action='/customers' method='post'>\
							<input type='submit' name='delivercustomers' \
								value='Customers' class='projectTitle'>\
						</form>\
					</td>\
					<td>Returns a table containing all customers.</td>\
				</tr>\
			</tbody></table>";
		
		var teamsText = ""
		
		results.rows.forEach(element => teamsText += "<br><table class='styled-table'><tbody><tr><th>" + element.pro_team_name + " Administration</th><th>Description</th></tr>\
				<tr><td>\
						<form action='/teamCategories' method='post'>\
							<input type='text' name='teamID' id='teamID' value=" + element.pro_team_id + " hidden>\
							<input type='submit' name='deliverTeamCategories' \
								value='Categories' class='projectTitle'>\
						</form>\
					</td>\
					<td>Returns a table containing all categories.</td>\
				</tr>\
				<tr><td>\
						<form action='/teamCustomers' method='post'>\
						<input type='text' name='teamID' id='teamID' value=" + element.pro_team_id + " hidden>\
							<input type='submit' name='deliverTeamCustomers' \
								value='Customers' class='projectTitle'>\
						</form>\
					</td>\
					<td>Returns a table containing all customers.</td>\
				</tr>\
				<tr><td>\
						<form action='/teamAnnouncements' method='post'>\
						<input type='text' name='teamID' id='teamID' value=" + element.pro_team_id + " hidden>\
							<input type='submit' name='deliverTeamAnnouncements' \
								value='Announcements' class='projectTitle'>\
						</form>\
					</td>\
					<td>Allows user to update announcements on the team's home page.</td>\
				</tr>\
			</tbody></table>")

		res.render("dashboard.ejs", {statusMessage: themeText + tableText + teamsText, user: req.user});

	});
	});
};

//------------------------------------------------------------------------------
//---------------------DELIVERS THE TEAMS ANNOUNCEMENTS VIEW--------------------
//------------------------------------------------------------------------------
const deliverTeamAnnouncements = function(req, res) {
	const team_id = req.body.teamID;
	const sql = "SELECT * FROM pro_team WHERE pro_team_id =" + team_id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'><tbody>\
			<tr><th>Announcement</th>\
				<th>Action</th>\
			</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.announcements + "</td>\
				<td><form action='/deleteAnnouncement' method='post'>\
						<input type='text' name='teamID' id='teamID' \
							value='" + team_id + "' hidden>\
						<input type='submit' name='deleteAnnouncement' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += "<tr>\
			<td><form action='/addAnnouncement' method='POST'>\
				<input type='text' name='announcement' id='announcement' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
			</td>\
				<input type='text' name='teamID' id='teamID' \
				value='" + team_id + "' hidden>\
			</td>\
			<td><input type='submit' class='redButton'></td>\
		</tr></tbody></table>";
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
};

//------------------------------------------------------------------------------
//----------------------DELIVERS THE TEAMS CATEGORIES VIEW----------------------
//------------------------------------------------------------------------------
const deliverTeamCategories = function(req, res) {
	const team_id = req.body.teamID;
	const sql = "SELECT * FROM CATEGORIES WHERE pt_id =" + team_id + ";";
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
				<td><form action='/deleteTeamCategory' method='post'>\
						<input type='text' id='category_id' name='category_id' \
							value='" + element.category_id + "' hidden>\
						<input type='text' name='teamID' id='teamID' \
							value='" + team_id + "' hidden>\
						<input type='submit' name='deletecategory' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += "<tr>\
			<td><form action='/addTeamCategory' method='POST'>\
				<input type='text' name='category_name' id='category_name' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
			</td>\
			<td><input type='text' name='category_description' \
			id='category_description' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
				<input type='text' name='teamID' id='teamID' \
				value='" + team_id + "' hidden>\
			</td>\
			<td><input type='submit' class='redButton'></td>\
		</tr></tbody></table>";
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
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
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
};

//------------------------------------------------------------------------------
//----------------------DELIVERS THE TEAMS CUSTOMERS VIEW-----------------------
//------------------------------------------------------------------------------
const deliverTeamCustomers = function(req, res) {
	const team_id = req.body.teamID;
	const sql = "SELECT * FROM customers WHERE pt_id =" + team_id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'><tbody>\
			<tr><th>Customers</th>\
				<th>Description</th>\
				<th>Action</th>\
			</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.customer + "</td>\
				<td>" + element.description + "</td>\
				<td><form action='/deleteTeamCustomer' method='post'>\
						<input type='text' id='customer_id' name='customer_id' \
							value='" + element.customer_id + "' hidden>\
						<input type='text' name='teamID' id='teamID' \
							value='" + team_id + "' hidden>\
						<input type='submit' name='deletecustomer' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += "<tr>\
			<td><form action='/addTeamCustomer' method='POST'>\
				<input type='text' name='customer_name' id='customer_name' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
			</td>\
			<td><input type='text' name='customer_description' \
			id='customer_description' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
				<input type='text' name='teamID' id='teamID' \
				value='" + team_id + "' hidden>\
			</td>\
			<td><input type='submit' class='redButton'></td>\
		</tr></tbody></table>";
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE CUSTOMERS VIEW--------------------------
//------------------------------------------------------------------------------
const deliverCustomers = function(req, res) {
	const team_id = req.user.team;
	const sql = "SELECT * FROM customers WHERE team_id =" + team_id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = "<table class='styled-table'><tbody>\
			<tr><th>Customers</th>\
				<th>Description</th>\
				<th>Action</th>\
			</tr>";
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.customer + "</td>\
				<td>" + element.description + "</td>\
				<td><form action='/deleteCustomer' method='post'>\
						<input type='text' id='customer_id' name='customer_id' \
							value='" + element.customer_id + "' hidden>\
						<input type='submit' name='deletecustomer' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		tableText += "<tr>\
			<td><form action='/addCustomer' method='POST'>\
				<input type='text' name='customer_name' id='customer_name' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
			</td>\
			<td><input type='text' name='customer_description' \
			id='customer_description' \
					style='width: 100%;padding: 12px;border: 1px solid #ccc;\
					border-radius: 4px; resize: vertical;'>\
				<input type='text' name='team_id' id='team_id' \
				value='" + team_id + "' hidden>\
			</td>\
			<td><input type='submit' class='redButton'></td>\
		</tr></tbody></table>";
		res.render("dashboard.ejs", {statusMessage: tableText, user: req.user});
	});
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE CAMPAIGNS VIEW--------------------------
//------------------------------------------------------------------------------
const deliverCampaigns = function(req, res) {
	const user = req.user.id;
	const sql = "SELECT campaign_id,\
						name,\
						pcomplete,\
						resource,\
						user_id,\
						TO_CHAR(start_date, 'MM/DD/YYYY') AS start_date,\
						TO_CHAR(end_date, 'MM/DD/YYYY') AS end_date,\
						EXTRACT(YEAR FROM start_date) AS start_year,\
						EXTRACT(MONTH FROM start_date) - 1 AS start_month,\
						EXTRACT(DAY FROM start_date) AS start_day,\
						EXTRACT(YEAR FROM end_date) AS end_year,\
						EXTRACT(MONTH FROM end_date) - 1 AS end_month,\
						EXTRACT(DAY FROM end_date) AS end_day\
					FROM campaigns WHERE user_id =" + user;
					
	const sqltracking = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'campaigns'\
					, '" + user + "'\
					);";
	pool.query(sqltracking, (error, results) => {
		if (error) {
			throw error;
		}
	
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		var tableText = ""
		results.rows.forEach(element => 
			tableText += "<tr>\
				<td>" + element.name + "</td>\
				<td>" + element.start_date + "</td>\
				<td>" + element.end_date + "</td>\
				<td>" + element.resource + "</td>\
				<td><form action='updateCampaign' method='post'><input type='number' name='pcomplete' id='pcomplete' value='" + element.pcomplete + "'><input type='text' id='campaign_id' name='campaign_id' \
							value='" + element.campaign_id + "' hidden>\</td>\
				<td><input type='submit' name='updateCampaign' value='UPDATE' class='projectTitle'></form> / <form action='/deleteCampaign' method='post'>\
						<input type='text' id='campaign_id' name='campaign_id' \
							value='" + element.campaign_id + "' hidden>\
						<input type='submit' name='deletecampaign' \
							value='DELETE' \
							class='projectTitle'>\
					</form>\
				</td>\
			</tr>"
		);
		var dataText = ""
		if (results.rows[0] != null) {
		results.rows.forEach(element => dataText += "['" + element.campaign_id + "', '" + element.name + "',\
										'" + element.resource + "', new Date(" + element.start_year + ", " + element.start_month + ", " + element.start_day + "),\
										new Date(" + element.end_year + ", " + element.end_month + ", " + element.end_day + "), null, " + element.pcomplete + ", null],");
		} else { dataText += "['2014Spring', 'No Campaigns', 'None', new Date(2014, 2, 22), new Date(2014, 5, 20), null, 100, null]" }
		res.render("campaigns.ejs", {statusMessage: tableText, data: dataText, user: req.user});
	});
	});
};

//------------------------------------------------------------------------------
//------------------------------UPDATES A CAMPAIGN------------------------------
//------------------------------------------------------------------------------
const updateCampaign = function(req, res) {
	const sql = "UPDATE campaigns\
					SET pcomplete = " + req.body.pcomplete + "WHERE campaign_id =" + req.body.campaign_id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
	
		deliverCampaigns(req, res)
	});
};

//------------------------------------------------------------------------------
//--------------------------UPDATES PROJECT PERCENTAGE--------------------------
//------------------------------------------------------------------------------
const updatePercentage = function(req, res) {
	const id = parseInt(req.body.ticketID);
	const percent = parseInt(req.body.percent_complete);

	const sql = "UPDATE projects\
					SET percent_complete =" + percent + " WHERE project_id =" + id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
	
		deliverTeams(req, res);
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
		var statustext = '';
		if (results.rows[0].status == 'Open') {statustext += "<option value='Open'>Open</option>\
							<option value='In-process'>In-process</option>\
							<option value='Closed'>Closed</option>"} else if (results.rows[0].status == 'In-process') {
							statustext += "<option value='In-process'>In-process</option>\
							<option value='Open'>Open</option>\
							<option value='Closed'>Closed</option>"} else {
								statustext += "<option value='Closed'>Closed</option>\
							<option value='In-process'>In-process</option>\
							<option value='Open'>Open</option>"}
							console.log(statustext);
		var projectText = '';
		projectText += "<div class='projectDiv' style='width:75%; margin-left:12%;'>\
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
							style='width: 75%;padding: 12px;\
							border: 1px solid #ccc;border-radius: 4px; \
							resize: vertical;'>" + statustext + "\
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
					<input type='text' name='ticketID' id='ticketID' \
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
			<div class='projectDiv' style='width:75%; margin-left:12%;'>\
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
					<input type='text' name='ticketID' id='ticketID' \
						value='" + results.rows[0].project_id + "' hidden>\
					<br><br>\
					<input type='submit' value='Add Comment' class='redButton'>\
					</input>\
				</form>\
			</div>";
		if(results.rows[0].commentdescription != null) {
			results.rows.forEach(element => 
				projectText += "<br><br>\
					<div class='commentDiv' style='width:75%; margin-left:12%;'>\
						<b>" + element.commentcreatedby + "</b> \
						(" + element.commentcreateddate + ")\
						<br>" + element.commentdescription + "\
					</div>"
			);
		}
		response.render("dashboard.ejs", {statusMessage: projectText, user: request.user});
	});
}

//------------------------------------------------------------------------------
//----------------------------GETS TEAM PROJECT BY ID---------------------------
//------------------------------------------------------------------------------
const getTeamProject = (request, response) => {
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
		var statustext = '';
		if (results.rows[0].status == 'Open') {statustext += "<option value='Open'>Open</option>\
							<option value='In-process'>In-process</option>\
							<option value='Closed'>Closed</option>"} else if (results.rows[0].status == 'In-process') {
							statustext += "<option value='In-process'>In-process</option>\
							<option value='Open'>Open</option>\
							<option value='Closed'>Closed</option>"} else {
								statustext += "<option value='Closed'>Closed</option>\
							<option value='In-process'>In-process</option>\
							<option value='Open'>Open</option>"}
							console.log(statustext);
		var projectText = '';
		projectText += "<div class='projectDiv' style='width:75%; margin-left:12%;'>\
			<form action='/updateTeamProject' method='post' \
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
							style='width: 75%;padding: 12px;\
							border: 1px solid #ccc;border-radius: 4px; \
							resize: vertical;'>" + statustext + "\
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
					<input type='text' name='ticketID' id='ticketID' \
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
			<div class='projectDiv' style='width:75%; margin-left:12%;'>\
				<form action='/addTeamComment' method='post' id='commentDescription' \
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
					<input type='text' name='ticketID' id='ticketID' \
						value='" + results.rows[0].project_id + "' hidden>\
					<br><br>\
					<input type='submit' value='Add Comment' class='redButton'>\
					</input>\
				</form>\
			</div>";
		if(results.rows[0].commentdescription != null) {
			results.rows.forEach(element => 
				projectText += "<br><br>\
					<div class='commentDiv' style='width:75%; margin-left:12%;'>\
						<b>" + element.commentcreatedby + "</b> \
						(" + element.commentcreateddate + ")\
						<br>" + element.commentdescription + "\
					</div>"
			);
		}
		
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
		var teamsVar = "";
		results.rows.forEach(element =>
			teamsVar += "<form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='" + element.pro_team_name + "' class='teamTitle'>\
					</form>"
		);
		if (results.rows[0] == null) {
			tableText = "NO TEAMS YET =(";
			teamsVar = "CREATE A TEAM";
			};
		response.render("teams.ejs", {
			statusMessage: projectText, teamsList: teamsVar, user: request.user
			}
		);
	});
	});
}


//------------------------------------------------------------------------------
//--------------------------------UPDATES PROJECT-------------------------------
//------------------------------------------------------------------------------
const updateProject = (request, response) => {
	const statusSQL = request.body.statusSQL
	const id = parseInt(request.body.ticketID)
	
	console.log(statusSQL + " " + id);
	const sql = "UPDATE projects \
					SET status = '" + statusSQL + "' \
					WHERE project_id = " + id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		getProject(request, response)
	});
}

//------------------------------------------------------------------------------
//-----------------------------UPDATES TEAM PROJECT-----------------------------
//------------------------------------------------------------------------------
const updateTeamProject = (request, response) => {
	const statusSQL = request.body.statusSQL
	const id = parseInt(request.body.ticketID)
	
	console.log(statusSQL + " " + id);
	const sql = "UPDATE projects \
					SET status = '" + statusSQL + "' \
					WHERE project_id = " + id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		getTeamProject(request, response)
	});
}

//------------------------------------------------------------------------------
//------------------UPDATES PROJECT AND REDIRECTS BACK TO TEAM------------------
//------------------------------------------------------------------------------
const updateProjectTeam = (request, response) => {
	const statusSQL = request.body.statusSQL
	const id = parseInt(request.body.ticketID)
	
	console.log(statusSQL + " " + id);
	const sql = "UPDATE projects \
					SET status = '" + statusSQL + "' \
					WHERE project_id = " + id;
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		deliverTeams(request, response)
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
	response.render("dashboard.ejs", {statusMessage: projectFrame, user: request.user});
}

//------------------------------------------------------------------------------
//---------------------------ADDS COMMENT TO PROJECT----------------------------
//------------------------------------------------------------------------------
const plusComment = (request, response) => {
	const descriptionstring = request.body.commentDescription
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	const user = request.user.displayname;
	const project_id = request.body.ticketID
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
		getProject(request, response)
	});
}

//------------------------------------------------------------------------------
//------------------------ADDS TEAM COMMENT TO PROJECT--------------------------
//------------------------------------------------------------------------------
const plusTeamComment = (request, response) => {
	const descriptionstring = request.body.commentDescription
	var description2 = descriptionstring.replace(/'/gi,"''");
	var description = description2.replace(/\"/gi,"''");
	const user = request.user.displayname;
	const project_id = request.body.ticketID
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
		getTeamProject(request, response)
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
				
	const sqltracking = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'charts'\
					, '" + user + "'\
					);";
	pool.query(sqltracking, (error, results) => {
		if (error) {
			throw error;
		}
	
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
		const sql2 = "SELECT category, COUNT(category) AS CATEGORY_COUNT FROM projects WHERE (responsible = '" + user + "') GROUP BY category ORDER BY category_COUNT DESC;";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			
			let categoryArray = [];
			results.rows.forEach(element =>
					categoryArray.push("['" + element.category + "', " + parseInt(element.category_count) + "]")
				);
			const sql3 = "SELECT customer, COUNT(customer) AS CUSTOMER_COUNT FROM projects WHERE (responsible = '" + user + "') GROUP BY customer ORDER BY CUSTOMER_COUNT DESC;";
			pool.query(sql3, (error, results) => {
				if (error) {
					throw error;
				}
				let customerArray = [];
				results.rows.forEach(element =>
						customerArray.push("['" + element.customer + "', " + parseInt(element.customer_count) + "]")
					);
				
				const sql2 = "SELECT campaign_id,\
						name,\
						pcomplete,\
						resource,\
						user_id,\
						TO_CHAR(start_date, 'MM/DD/YYYY') AS start_date,\
						TO_CHAR(end_date, 'MM/DD/YYYY') AS end_date,\
						EXTRACT(YEAR FROM start_date) AS start_year,\
						EXTRACT(MONTH FROM start_date) - 1 AS start_month,\
						EXTRACT(DAY FROM start_date) AS start_day,\
						EXTRACT(YEAR FROM end_date) AS end_year,\
						EXTRACT(MONTH FROM end_date) - 1 AS end_month,\
						EXTRACT(DAY FROM end_date) AS end_day\
					FROM campaigns WHERE user_id =" + user;
					
				pool.query(sql2, (error, results) => {
					if (error) {
						throw error
					}
					
				var dataText = ""
				if (results.rows[0] != null) {
				results.rows.forEach(element => dataText += "['" + element.campaign_id + "', '" + element.name + "',\
										'" + element.resource + "', new Date(" + element.start_year + ", " + element.start_month + ", " + element.start_day + "),\
										new Date(" + element.end_year + ", " + element.end_month + ", " + element.end_day + "), null, " + element.pcomplete + ", null],");
				} else { dataText += "['2014Spring', 'No Campaigns', 'None', new Date(2014, 2, 22), new Date(2014, 5, 20), null, 100, null]" }
				response.render("charts.ejs", {statusMessage: googleArray, categoryData: categoryArray, customerData: customerArray, ganttData: dataText, user: request.user});
				});
			});
		});
	});
	});
}

//------------------------------------------------------------------------------
//---------------------------------FILTER CHARTS--------------------------------
//------------------------------------------------------------------------------
const filterCharts = (request, response) => {
	const user = request.user.id;
	
	var start = ""
	if (request.body.startDate == ''){
		start += "'01/01/2000'::date"
	} else {
		start += "'" + request.body.startDate + "'::date";
	}
	
	console.log(start)
	
	var end = ""
	if(request.body.endDate == ''){
		end += "'12/31/2121'::date"
	} else {
		end += "'" + request.body.endDate + "'::date";
	}

	const sql = "SELECT DISTINCT\
					CONCAT(date_part('year', created_date)\
						, '-'\
						, date_part('month', created_date)) \
					AS PROJECT_MONTH\
					, COUNT(DISTINCT project_id) AS PROJECT_COUNT\
				FROM projects \
				WHERE (responsible = '" + user + "' AND date(created_date) >= " + start + " AND date(created_date) <= " + end + " )\
					GROUP BY date_part('year', created_date)\
					, date_part('month', created_date)\
				ORDER BY PROJECT_MONTH;";		
	const sqltracking = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'charts'\
					, '" + user + "'\
					);";
	pool.query(sqltracking, (error, results) => {
		if (error) {
			throw error;
		}
	
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
		const sql2 = "SELECT category, COUNT(category) AS CATEGORY_COUNT FROM projects WHERE (responsible = '" + user + "' AND date(created_date) >= " + start + " AND date(created_date) <= " + end + " ) GROUP BY category ORDER BY category_COUNT DESC;";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			
			let categoryArray = [];
			results.rows.forEach(element =>
					categoryArray.push("['" + element.category + "', " + parseInt(element.category_count) + "]")
				);
			const sql3 = "SELECT customer, COUNT(customer) AS CUSTOMER_COUNT FROM projects WHERE (responsible = '" + user + "' AND date(created_date) >= " + start + " AND date(created_date) <= " + end + " ) GROUP BY customer ORDER BY CUSTOMER_COUNT DESC;";
			pool.query(sql3, (error, results) => {
				if (error) {
					throw error;
				}
				let customerArray = [];
				results.rows.forEach(element =>
						customerArray.push("['" + element.customer + "', " + parseInt(element.customer_count) + "]")
					);
				
				const sql2 = "SELECT campaign_id,\
						name,\
						pcomplete,\
						resource,\
						user_id,\
						TO_CHAR(start_date, 'MM/DD/YYYY') AS start_date,\
						TO_CHAR(end_date, 'MM/DD/YYYY') AS end_date,\
						EXTRACT(YEAR FROM start_date) AS start_year,\
						EXTRACT(MONTH FROM start_date) - 1 AS start_month,\
						EXTRACT(DAY FROM start_date) AS start_day,\
						EXTRACT(YEAR FROM end_date) AS end_year,\
						EXTRACT(MONTH FROM end_date) - 1 AS end_month,\
						EXTRACT(DAY FROM end_date) AS end_day\
					FROM campaigns WHERE user_id =" + user + " AND date(start_date) >= " + start + " AND date(start_date) <= " + end + " AND date(end_date) >= " + start + " AND date(end_date) <= " + end;
					
				pool.query(sql2, (error, results) => {
					if (error) {
						throw error
					}
					
				var dataText = ""
				if (results.rows[0] != null) {
				results.rows.forEach(element => dataText += "['" + element.campaign_id + "', '" + element.name + "',\
										'" + element.resource + "', new Date(" + element.start_year + ", " + element.start_month + ", " + element.start_day + "),\
										new Date(" + element.end_year + ", " + element.end_month + ", " + element.end_day + "), null, " + element.pcomplete + ", null],");
				} else { dataText += "['2014Spring', 'No Campaigns', 'None', new Date(2014, 2, 22), new Date(2014, 5, 20), null, 100, null]" }
				response.render("charts.ejs", {statusMessage: googleArray, categoryData: categoryArray, customerData: customerArray, ganttData: dataText, user: request.user});
				});
			});
		});
	});
	});
}

//------------------------------------------------------------------------------
//---------------------------RENDER CHARTS FOR CONSOLE--------------------------
//------------------------------------------------------------------------------
const consoleCharts = (request, response) => {
	const user = request.user.id;
	const sql = "SELECT DISTINCT\
					CONCAT(date_part('year', date_time)\
						, '-'\
						, date_part('month', date_time)) \
					AS MONTH\
					, COUNT(DISTINCT user_id) AS USER_COUNT\
				FROM views \
				WHERE (user_id > 0)\
					GROUP BY date_part('year', date_time)\
					, date_part('month', date_time)\
				ORDER BY MONTH;";
				
	const sqltracking = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'console'\
					, '" + user + "'\
					);";
					
	if (request.user.username == "TrevorFrench") {
	
	pool.query(sqltracking, (error, results) => {
		if (error) {
			throw error;
		}
	
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		let dataArray = [];
		let labelArray = [];
		results.rows.forEach(element => 
			labelArray.push("'" + element.month + "'")
		);
		var texts= "labels: [" + labelArray + "],\
					datasets: [{\
					label: '# of Users',\
					data: " 
		results.rows.forEach(element => 
			dataArray.push(element.user_count)
		);
		
		let googleArray = [];
		results.rows.forEach(element =>
			googleArray.push("['" + element.month + "' ," + parseInt(element.user_count) + "]")
		);
		texts+= "[" + dataArray + "]";
		const sql2 = "SELECT page, COUNT(page) AS PAGE_COUNT FROM views WHERE (user_id > 0) GROUP BY page ORDER BY PAGE_COUNT DESC;";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			
			let categoryArray = [];
			results.rows.forEach(element =>
					categoryArray.push("['" + element.page + "', " + parseInt(element.page_count) + "]")
				);
			const sql3 = "SELECT DISTINCT\
					CONCAT(date_part('year', date_time)\
						, '-'\
						, date_part('month', date_time)) \
					AS MONTH\
					, COUNT(DISTINCT ipaddress) AS USER_COUNT\
				FROM views \
				WHERE (page = 'landing')\
					GROUP BY date_part('year', date_time)\
					, date_part('month', date_time)\
				ORDER BY MONTH;";
			pool.query(sql3, (error, results) => {
				if (error) {
					throw error;
				}
				let dataArray2 = [];
				let labelArray2 = [];
				results.rows.forEach(element => 
				labelArray2.push("'" + element.month + "'")
				);
				var texts= "labels: [" + labelArray2 + "],\
							datasets: [{\
							label: '# of Users',\
							data: " 
				results.rows.forEach(element => 
					dataArray2.push(element.user_count)
				);
				
				let googleArray2 = [];
				results.rows.forEach(element =>
					googleArray2.push("['" + element.month + "' ," + parseInt(element.user_count) + "]")
				);
				texts+= "[" + dataArray2 + "]";
				
				response.render("console.ejs", {statusMessage: googleArray, categoryData: categoryArray, customerData: googleArray2, user: request.user});

			});
		});
	});
	});
	
	} else { response.redirect('/home') }
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
			statusMessage: maxNumber, successMessage: "Profile succesfully created. You may now log in below."
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
		var tableText = "";
		/*var tableText = "<table class='styled-table'><tbody>\
			<tr><th>TEAM</th>\
				<th>USER</th>\
				<th>ROLE</th>\
				<th>ACTION</th>\
			</tr>";*/
		var teamsVar = "";
		/*results.rows.forEach(element =>
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
		); tableText = "</table>"*/
		tableText += "<table style='width: 86%; margin-right: 14%; text-align:center;'>\
			<tbody><tr>\
			<td>\
			<img type='image/png' src='./public/collaboration2.svg' style='margin-top:20px; height: 50%; width: 50%;'>\
			</td>\
			</tr>\
			</tbody></table>";
		results.rows.forEach(element =>
			teamsVar += "<form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='" + element.pro_team_name + "' class='teamTitle'>\
					</form>"
		);
		if (results.rows[0] == null) {
			tableText = "NO TEAMS YET =(";
			teamsVar = "CREATE A TEAM";
			};
		response.render("teams.ejs", {
			statusMessage: tableText, teamsList: teamsVar, user: request.user
			}
		);
	});
}

//------------------------------------------------------------------------------
//---------------------------------TAKE PROJECT---------------------------------
//------------------------------------------------------------------------------
const takeProject = (req, res) => {
	const id = parseInt(req.body.ticketID);

	const sql = "UPDATE projects\
					SET responsible ='" + req.user.id + "' WHERE project_id = " + id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		deliverTeams(req, res);
	});
};

//------------------------------------------------------------------------------
//--------------------------------RELEASE PROJECT-------------------------------
//------------------------------------------------------------------------------
const releaseProject = (req, res) => {
	const id = parseInt(req.body.ticketID);
	console.log(req.body.ticketID)

	const sql = "UPDATE projects\
					SET responsible ='1' WHERE project_id = " + id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		deliverTeams(req, res);
	});
};

//------------------------------------------------------------------------------
//-----------------------------DELIVER TEAMS BY ID------------------------------
//------------------------------------------------------------------------------
const deliverTeams = (request, response) => {
	const sql = "SELECT pro_team_name\
					, displayname \
					, announcements \
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
		var title = "<div class='nextRow' id='announcements'><div onclick='toggleAnnouncement()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div><h3>" + results.rows[0].pro_team_name + "</h3>Announcements: " + results.rows[0].announcements
		var usersText = "<table class='styled-table' id='users' style='width:100%;'><tbody><tr><th>Users<div onclick='toggleUsers()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></th></tr>";
		/*var teamsVar = results.rows[0].pro_team_name;*/
		results.rows.forEach(element => 
			usersText += "<tr><td>" + element.displayname + "</td></tr>"
		);
		usersText += "</tbody></table>";
		const sql2 = "SELECT project_id\
					, title\
					, status\
					, responsible\
					, TO_CHAR(duedate, 'MM/DD/YYYY') AS duedate\
					, description\
					, category\
					, percent_complete\
					FROM projects \
						WHERE pt_id =" + request.body.teamid + " AND status <> 'Closed'\
					ORDER by project_id desc;;";
		pool.query(sql2, (error, results) => {
			if (error) {
				throw error;
			}
			var projectBoard = "<table class='styled-table' id='projectBoard' style='width: 100%;'><tbody>\
				<tr><th>Project Board</th><th>Due</th><th><div onclick='toggleBoard()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></th></tr>";
			var projectsText = "<table class='styled-table' id='allProjects' style='width: 100%;'><tbody>\
				<tr><th>All Active Projects<div onclick='toggleAllProjects()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></th></tr>";
			var myProjects = "<table class='styled-table' id='myProjects' style='width: 100%;'><tbody>\
				<tr><th>Projects Assigned to Me</th><th>Due</th><th><div onclick='toggleMyProjects()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></th></tr>";
			var scrumBoard = "<table class='styled-table' id='scrumBoard' style='width: 100%;'><tbody>\
				<tr><th>Scrum Board<div onclick='toggleScrumBoard()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></th></tr>";
			var scrumBoard2 = "<table class='scrum-table' id='scrumBoard' style='width: 100%;'><tbody>\
				<tr class='scrumTitle'><th>Unition Board</th><td></td><td><div onclick='toggleScrumBoard()' Style='float:right; cursor: pointer;'><i class='fas fa-window-close' style='float: right; color: white;'></i></div></td></tr>";
			var scripts = "";
			results.rows.forEach(element => 
				projectsText += "<tr><td><form id='projectform' action='/openTeamProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit'  class='projectTitle' \
							value='" + element.title.replace(/'/g,"&#39;") + "'>\
					</form></td></tr>"				
			);
			
			let uniqueCategory = new Set();
			
			results.rows.forEach(element => uniqueCategory.add(element.category))
			
			let unique = Array.from(uniqueCategory);
			
			console.log(unique)
			
			var catLength = unique.length;
			var resultLength = results.rows.length;
			
			let i = 0;
			let j = 0
			if (unique[0] != null) {
			do {
				var texts = unique[i].replace(/\s/g, '');
				scrumBoard2 += "<tr class='scrumClass'><td style='font-size: medium;'><b>" + unique[i] + "</b></td><td></td><td><div class='toolTableButton' onclick='toggle" + texts + "()' Style='float:right; cursor: pointer;'><i id='" + texts + "Minus' class='fas fa-minus' style='float: right;'></i><i id='" + texts + "Plus' class='fas fa-plus' style='float: right; display: none;'></i></div></td></tr>";
				scripts += "<script> function toggle" + texts + "() { var minus = document.getElementById('" + texts + "Minus'); var plus = document.getElementById('" + texts + "Plus'); if (minus.style.display == 'none') {minus.style.display = 'inline-block'; plus.style.display = 'none'} else {plus.style.display = 'inline-block'; minus.style.display = 'none'} var x = document.getElementsByName('" + unique[i] + "Cat'); let h = 0; do {if (x[h].style.display === 'none') {x[h].style.display = 'table-row';} else { x[h].style.display = 'none';} h += 1;} while (h < x.length)}</script>"
				do {
					if (results.rows[j].category == unique[i]) {
						scrumBoard2 += "<tr name='" + unique[i] + "Cat' class='scrumClass2'><td><form id='projectForm' action='/openTeamProject' method='post'>\
						<input type='text' name='ticketID' value='" + results.rows[j].project_id + "' id='" + results.rows[j].project_id + "' hidden>\
						<input type='submit' class='projectTitle' value='" + results.rows[j].title.replace(/'/gi,"''") + "'></form></td><td>\
						<form id='form" + results.rows[j].project_id + "' action='/updatePercentage' method='POST'>\
						<label class='label" + results.rows[j].project_id + "label' for='label" + results.rows[j].project_id + "label'>" + results.rows[j].percent_complete + "</label>\
						<input name='percent_complete' id='percent_complete" + results.rows[j].project_id + "' class='input" + results.rows[j].project_id + "input' value='" + results.rows[j].percent_complete + "' hidden />\
						<input name='teamid' id='teamid' value='" + request.body.teamid + "' hidden />\
						<input id='label" + results.rows[j].project_id + "label' type='range' min='0' max='100' value='" + results.rows[j].percent_complete + "'/>\
						<input id='ticketID' name='ticketID' type='text' value='" + results.rows[j].project_id + "' hidden />\
						</form></td>\
						<td><form action='/updateProjectTeam' method='POST' name='closeProject'>\
						<input id='statusSQL' name='statusSQL' type='text' value='Closed' hidden />\
						<input id='ticketID' name='ticketID' type='text' value='" + results.rows[j].project_id + "' hidden />\
						<input id='teamid' name='teamid' type='text' value='" + request.body.teamid + "' hidden />\
						<input type='submit' value='Close' class='projectTitle'>\
						</form></td></tr>\
						<script>\
						document.querySelector('#label" + results.rows[j].project_id + "label').addEventListener('change', function(e){\
							document.querySelector('.label" + results.rows[j].project_id + "label').textContent=e.currentTarget.value;\
							var slider = document.getElementById('label" + results.rows[j].project_id + "label');\
							var input = document.getElementById('percent_complete" + results.rows[j].project_id + "');\
							input.value = slider.value;\
							document.forms['form" + results.rows[j].project_id + "'].submit();\
						})\
						</script>"
					}
				  j = j + 1;
				} while (j < resultLength);
				j = 0;
				i += 1;
				} while (i < catLength);
			
			uniqueCategory.forEach(element => scrumBoard += "<tr><td>" + element + "</td></tr>"); }
			
			
			
			results.rows.forEach(element => 
				scrumBoard += "<tr><td><form id='projectform' action='/openTeamProject' method='post'>\
						<input type='text' name='ticketID' \
							value='" + element.project_id + "' \
							id='" + element.project_id + "' hidden>\
						<input type='submit'  class='projectTitle' \
							value='" + element.title.replace(/'/g,"&#39;") + "'>\
					</form></td></tr>"				
			);
			

			
			let sqlResults = results.rows;		
			let mineProjects = [];
			for (let i = 0; i < sqlResults.length; i++) {
				if (parseInt(sqlResults[i].responsible) == request.user.id) {
					mineProjects.push(sqlResults[i]);
				}
			}
			
			let openProjects = [];
			for (let i = 0; i < sqlResults.length; i++) {
				if (parseInt(sqlResults[i].responsible) == 1) {
					openProjects.push(sqlResults[i]);
				}
			}
			
			
			
			mineProjects.forEach(element => myProjects += "<tr><td>\
			<form id='projectForm' action='/openTeamProject' method='post'>\
			<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
			<input type='submit' class='projectTitle' value='" + element.title.replace(/'/g,"&#39;") + "'></form></td><td>" + element.duedate + "</td><td><form id='projectForm' action='/releaseProject' method='post'>\
			<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
			<input id='teamid' name='teamid' type='text' value='" + request.body.teamid + "' hidden />\
			<input type='submit' class='projectTitle' value='Release'></form></td></tr>");
			openProjects.forEach(element => projectBoard += "<tr><td>\
			<form id='projectForm' action='/openTeamProject' method='post'>\
			<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
			<input type='submit' class='projectTitle' value='" + element.title.replace(/'/g,"&#39;") + "'></form></td><td>" + element.duedate + "</td><td><form id='projectForm' action='/takeProject' method='post'>\
			<input type='text' name='ticketID' value='" + element.project_id + "' id='" + element.project_id + "' hidden>\
			<input id='teamid' name='teamid' type='text' value='" + request.body.teamid + "' hidden />\
			<input type='submit' class='projectTitle' value='Take'></form></td></tr>");
			myProjects += "</table>";
			projectsText += "</table>";
			scrumBoard += "</table>";
			scrumBoard2 += "</table>" + scripts;
			projectBoard += "</table>";
			var buttons = "<br><br><form action='/createTeamProject' method='post' id='createProject'>\
					<input type='text' name='pt_id' id='pt_id'value=" + request.body.teamid + " hidden>\
					<input class='redButton' type='submit' style='width:250px;' value='Create Team Project'>\
			</form></div>"
			var toolbar = "<div class='topRow' style='background-color: #32323e; height: 50px;'>\
				<table style='width: 100%; height: 100%;' class='toolTable'>\
			<tr>\
			<td><div class='toolTableButton' onclick='createProject()' title='Create Team Project' style='cursor: pointer;'><i class='fas fa-folder-plus'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleAnnouncement()' title='Toggle Announcements' style='cursor: pointer;'><i class='fas fa-bullhorn'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleUsers()' title='Toggle Users' style='cursor: pointer;'><i class='fas fa-users'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleBoard()' title='Toggle Project Board' style='cursor: pointer;'><i class='fas fa-chalkboard-teacher'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleMyProjects()' title='Toggle My Projects' style='cursor: pointer;'><i class='fas fa-clipboard-check'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleAllProjects()' title='Toggle All Projects' style='cursor: pointer;'><i class='fas fa-stream'></i></div></td>\
			<td><div class='toolTableButton' onclick='toggleScrumBoard()' title='Toggle Unition Board' style='cursor: pointer;'><i class='fas fa-project-diagram'></i></div></td>\
			<td><a href='/profile'><i class='fas fa-user'></i></a></td>\
			<td><a href='/profile'><i class='fas fa-user'></i></a></td>\
			<td><a href='/profile'><i class='fas fa-user'></i></a></td>\
			</tr>\
			</table>\
	</div>\
	<div class='dataRow'>"
			var tableText = toolbar + title + buttons + "<div id='leftDiv' class='leftDiv'>" + scrumBoard2 + "</div><div class='rightDiv'>" + projectBoard + "<br>" + myProjects + "<br>" + usersText + "<br>" + projectsText + "</div>";
			
			/**/
			const sql2 = "SELECT pt_id\
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
				WHERE user_id =" + request.user.id + ";";
			pool.query(sql2, (error, results) => {
				if (error) {
					throw error;
				}
				var teamsVar = "<div class='toolTableButton' onclick='toggleTeams()' title='Toggle Teams' id='leftChevron' style='cursor: pointer;'><i class='fas fa-chevron-left'></i></div>\
					<div class='toolTableButton' onclick='toggleTeams()' title='Toggle Teams' id='rightChevron' style='cursor: pointer; display: none;'><i class='fas fa-chevron-right'></i></div>";
				results.rows.forEach(element =>
					teamsVar += "<form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='" + element.pro_team_name + "' class='teamTitle'>\
					</form>"
				);				
			/**/
			
			response.render("teams.ejs", {
				statusMessage: tableText, teamsList: teamsVar, user: request.user
				}
			);
			});
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
					, style\
					) VALUES ('\
						" + displayname + "'\
						, '" + email + "'\
						, '" + password + "'\
						," + team + "\
						, '" + username +"'\
						, 'style'\
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
							res.render("dashboard.ejs", {statusMessage: "FAILURE (0): You are already part of this team! Navigate to the 'Teams' tab to interact with your teammates.", user: req.user});
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
							res.render("dashboard.ejs", {statusMessage: "You have been added to the team successfully. Navigate to the 'Teams' tab to start collaborating!", user: req.user});
							});
						}
					});
										
			} else {
				var tableText = "";
				//DO NOT JOIN TEAM
				console.log("FAILURE1: NAME DOES NOT EXIST")
				res.render("dashboard.ejs", {statusMessage: "FAILURE (1): TEAM NAME DOES NOT MATCH ID. Please double-check your spelling and try again.", user: req.user});
			}

		} else {
			//DO NOT JOIN TEAM
			console.log("FAILURE2: TEAM ID DOES NOT EXIST")
			res.render("dashboard.ejs", {statusMessage: "FAILURE (2): TEAM ID DOES NOT EXIST", user: req.user});
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
							res.render("dashboard.ejs", {statusMessage: "You have created the team successfully. Navigate to the 'Teams' tab to start collaborating!", user: req.user});
							});
						
					});
										


		} else {
			//DO NOT JOIN TEAM
			console.log("FAILURE2: TEAM NAME ALREADY EXISTS")
			res.render("dashboard.ejs", {statusMessage: "FAILURE (2): TEAM NAME ALREADY EXISTS", user: req.user});
			}							 
	});
};

//------------------------------------------------------------------------------
//------------------------DELIVERS THE CREATE TEAM VIEW-------------------------
//------------------------------------------------------------------------------
const deliverCreateTeam = function(req, res) {
	const user = req.user.id;
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
		var teamsVar = "";
			var tableText = "<div class='nextRow'><form action='/createTeam' method='POST'>\
			<input type='text' name='user_id' id='user_id' value=" + req.user.id + " hidden>\
			<label for='team_name'>Team Name:</label><br><br>\
			<input type='text' name='team_name' id='team_name'><br><br>\
			<input class='redButton' type='submit' style='width:250px;' value='Create Team'>\
		</form></div>";
		results.rows.forEach(element =>
			teamsVar += "<form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='" + element.pro_team_name + "' class='teamTitle'>\
					</form>"
		);
		if (results.rows[0] == null) {
			tableText = "NO TEAMS YET =(";
			teamsVar = "CREATE A TEAM";
			};
		res.render("teams.ejs", {
			statusMessage: tableText, teamsList: teamsVar, user: req.user
			}
		);
	});
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE JOIN TEAM VIEW--------------------------
//------------------------------------------------------------------------------
const deliverJoinTeam = function(req, res) {
	const user = req.user.id;
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
		var teamsVar = "";
			var tableText = "<div class='nextRow'><form action='/joinTeam' method='POST'>\
			<input type='text' name='user_id' id='user_id' value=" + req.user.id + " hidden>\
			<label for='team_name'>Team Name:</label><br><br>\
			<input type='text' name='team_name' id='team_name'><br><br>\
			<label for='team_id'>Team ID:</label><br><br>\
			<input type='number' name='team_id' id='team_id'><br><br>\
			<input class='redButton' type='submit' style='width:250px;' value='Join Team'>\
		</form></div>";
		results.rows.forEach(element =>
			teamsVar += "<form action='deliverTeam' method='POST'>\
						<input type='text' id='teamdid' name='teamid' \
							value='" + element.pt_id + "' hidden>\
						<input type='submit' name='deliverTeam' \
							value='" + element.pro_team_name + "' class='teamTitle'>\
					</form>"
		);
		if (results.rows[0] == null) {
			tableText = "NO TEAMS YET =(";
			teamsVar = "CREATE A TEAM";
			};
		res.render("teams.ejs", {
			statusMessage: tableText, teamsList: teamsVar, user: req.user
			}
		);
	});
};

//------------------------------------------------------------------------------
//-------------------------DELIVERS THE PROFILE VIEW--------------------------
//------------------------------------------------------------------------------
const profileView = (request, response) => {
	const user = request.user.id;
	const stripe_id = request.user.stripe_id;
	console.log("STRIPE ID: " + stripe_id);
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'profile'\
					, '" + user + "'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		if (stripe_id != null && stripe_id != "null") {
		  response.render('profile', { user: request.user, statusMessage: '<form action="/create-customer-portal-session" method="POST">\
			<button type="submit">Manage Billing</button>\
			</form>' });
		} else {response.render('profile', { user: request.user, statusMessage: 'No subscription found. If you believe this is a mistake, please contact me at Trevor@unition.app' });}
	});
}

//------------------------------------------------------------------------------
//--------------------------DELIVERS THE PROJECTS VIEW--------------------------
//------------------------------------------------------------------------------
const projectsView = (request, response) => {
	const user = request.user.id
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'projects'\
					, '" + user + "'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}

    response.render("dashboard.ejs", {statusMessage:
	"<table class='styled-table'><tbody>\
	<tr><th>PROJECT LIST</th><th>Description</th>\
	<tr><td><form action='/openProjects' method='post'><input type='submit' name='openprojects' value='Open Projects' class='projectTitle'></form></td><td>Returns a list of all open projects for which the current user is responsible.</td></tr>\
	<tr><td><form action='/inprocessProjects' method='post'><input type='submit' name='inprocessprojects' value='In-Process Projects' class='projectTitle'></form></td><td>Returns a list of all in-process projects for which the current user is responsible.</td></tr>\
	<tr><td><form action='/allProjects' method='post'><input type='submit' name='allprojects' value='All Projects' class='projectTitle'></form></td><td>Returns a complete list of projects for which the current user is responsible.</td></tr>\
	<tr><td><form action='/myProjects' method='get'><input type='submit' name='myprojects' value='My Projects' class='projectTitle'></form></td><td>Returns all 'open' and 'in-process' projects for which the current user is responsible.</td></tr>\
	</tbody></table>", user: request.user
	})
	
	});
}

//------------------------------------------------------------------------------
//-----------------------DELIVERS THE DOCUMENTATION VIEW------------------------
//------------------------------------------------------------------------------
const documentationView = (request, response) => {
	const user = request.user.id
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'documentation'\
					, '" + user + "'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}

    response.render("documentation.ejs", {statusMessage: "", user: request.user})
	
	});
}

//------------------------------------------------------------------------------
//---------------------------DELIVERS THE TEAMS VIEW----------------------------
//------------------------------------------------------------------------------
const teamsView = (request, response) => {
	const user = request.user.id
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'teams'\
					, '" + user + "'\
					);";
	const sql2 = "SELECT subscription_end from stripe where stripe_id = '" + request.user.stripe_id + "';";
	let date = new Date();
	console.log(date);


	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		pool.query(sql2, (error, results) => {
		if (error) {
			throw error;
		}
		if (results.rows[0] != null) {
			console.log(results.rows[0])
		let endDate = results.rows[0].subscription_end;
		console.log(endDate)
		console.log(new Date(endDate))
		
		if (new Date(endDate) >= date) { response.redirect("./teams2")} else {

    response.render("dashboard.ejs", {statusMessage: "<div class='nextRow'><p>Teams functionality allows teams to efficiently define outcomes, track progress, and measure productivity.</p></div>\
	<div class='nextRow'>Sign up for an early-adopter membership for early access.\
	<form action='/create-checkout-session' method='POST'>\
      <input type='hidden' name='priceId' value='price_1JBVtmKqakUFqghQNtxN26pV' />\
      <button type='submit'>Checkout</button>\
		</form></div>", user: request.user})}} else {    response.render("dashboard.ejs", {statusMessage: "<div class='nextRow'><p>Teams functionality allows teams to efficiently define outcomes, track progress, and measure productivity.</p></div>\
	<div class='nextRow'>Sign up for an early-adopter membership for early access.\
	<form action='/create-checkout-session' method='POST'>\
      <input type='hidden' name='priceId' value='price_1JBVtmKqakUFqghQNtxN26pV' />\
      <button type='submit'>Checkout</button>\
		</form></div>", user: request.user})}
	});
	});
}

//------------------------------------------------------------------------------
//----------------------------DELIVERS THE HOME VIEW----------------------------
//------------------------------------------------------------------------------
const homeView = (request, response) => {
	const user = request.user.id
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'home'\
					, '" + user + "'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}

      response.render('main.ejs', {user: request.user})
	
	});
}

//------------------------------------------------------------------------------
//---------------------------DELIVERS THE FORMS VIEW----------------------------
//------------------------------------------------------------------------------
const formsView = (request, response) => {
	const user = request.user.id
	const sql = "INSERT INTO views(\
					page\
					, user_id\
					) VALUES (\
					'forms'\
					, '" + user + "'\
					);";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}

		response.render("dashboard.ejs", {statusMessage:
		"<table class='styled-table'><tbody>\
		<tr><th>FORM LIST</th><th>Description</th><th>INTERNAL/EXTERNAL</th>\
		<tr><td><form action='/createProject' method='post'>\
		<input type='submit' name='createProject' value='Project Creation Form' class='projectTitle'>\
		</form></td><td>Delivers the default project creation form.</td>\
		<td>Internal</td></tr>\
		</tbody></table>\
		<br>\
		<table class='styled-table'><tr><th>Custom Forms</th></tr><tr><td>Custom forms are available for enterprise customers. For inquiries, contact me here: Trevor@unition.app</td></tr></table>", user: request.user
		})
	
	});
}

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
  deliverCreateTeam,
  deliverCustomers,
  deleteCustomer,
  addCustomer,
  addTeamCustomer,
  addTeamCategory,
  deliverTeamCustomers,
  deliverTeamCategories,
  deleteTeamCategory,
  deleteTeamCustomer,
  addCampaign,
  deliverCampaigns,
  deleteCampaign,
  updateCampaign,
  profileView,
  projectsView,
  documentationView,
  teamsView,
  homeView,
  formsView,
  consoleCharts,
  filterCharts,
  deliverTeamAnnouncements,
  deleteAnnouncement,
  addAnnouncement,
  updatePercentage,
  updateProjectTeam,
  takeProject,
  releaseProject,
  getTeamProject,
  plusTeamComment,
  updateTeamProject
}