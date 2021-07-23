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
//---------------------------------DEFAULT DARK---------------------------------
//------------------------------------------------------------------------------
const defaultDark = (request, response) => {
	const sql = "UPDATE users SET style = 'style' where id = " + request.user.id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		response.redirect('./adminPage')
	});
}

//------------------------------------------------------------------------------
//---------------------------------LIGHT THEME----------------------------------
//------------------------------------------------------------------------------
const lightTheme = (request, response) => {
	const sql = "UPDATE users SET style = 'lightTheme' where id = " + request.user.id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		response.redirect('./adminPage')
	});
}

//------------------------------------------------------------------------------
//-------------------------------DASHBOARD THEME--------------------------------
//------------------------------------------------------------------------------
const dashboardTheme = (request, response) => {
	const sql = "UPDATE users SET style = 'dashboard' where id = " + request.user.id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		response.redirect('./adminPage')
	});
}

//------------------------------------------------------------------------------
//---------------------------------METAL THEME----------------------------------
//------------------------------------------------------------------------------
const metalTheme = (request, response) => {
	const sql = "UPDATE users SET style = 'metal' where id = " + request.user.id + ";";
	pool.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		response.redirect('./adminPage')
	});
}

//------------------------------------------------------------------------------
//--------------------------------EXPORT MODULES--------------------------------
//------------------------------------------------------------------------------
module.exports = {
	defaultDark,
	lightTheme,
	dashboardTheme,
	metalTheme
}