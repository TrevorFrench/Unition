//------------------------------------------------------------------------------
//---------------------------INITIALIZE DB CONNECTION---------------------------
//------------------------------------------------------------------------------
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'haeylaqqqkjveg',
  host: 'ec2-100-25-75-194.compute-1.amazonaws.com',
  database: 'd4mt626ufi3h00',
  password: '1c52845abaa1df2175c6da25b8f959485d69e792d02984ff4ee6a7a291d74a0e',
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
