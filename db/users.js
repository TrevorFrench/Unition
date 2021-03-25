var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
  , { id: 3, username: 'TrevorFrench', password: 'swirecc', displayName: 'Trevor French', emails: [ { value: 'tfrench@swirecc.com' } ] }
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
    var userSelect= "<div class='col-75'><select id='responsible' name='responsible' style='float:right; width:80%; padding:2px; border:2px;'>";
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      userSelect += "<option value='" + record.displayName + "'>" + record.displayName + "</option>";

    }
	userSelect += "</select></div></div>";
	var customerInput = "<div class='row'><div class='col-25'><label for='customer'>Customer:</label></div>\
		<div class='col-75'><select id='customer' name='customer' style='float:right; width:80%; padding:2px; border:2px;'>\
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
	var projectFrame = "<div style='width:80%; margin-left:10%; background-color:#f7f7f7; padding:10px;'\
						<p><i>*Please do not use quotation marks or apostrophes in the title.</i></p>\
						<form action='/postProject' method='post' id='description'>\
						  <div class='row'><div class='col-25'><label for='title'>Title:</label></div>\
						<div class='col-75'><input type='text' name='title' id='title' style='float:right; width:80%; padding:2px; border:2px;' pattern=[^'\x22]+></div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='statusSQL'>Status:</label></div>\
						<div class='col-75'><select id='statusSQL' name='statusSQL' style='float:right; width:80%; padding:2px; border:2px;'>\
						   <option value='Open'>Open</option>\
						   <option value='In-process'>In-process</option>\
						   <option value='Closed'>Closed</option>\
						</select></div></div>\
						<br><br>" + customerInput + "<br><br>\
						<div class='row'><div class='col-25'><label for='category'>Category:</label></div>\
						<div class='col-75'><input type='text' name='category' id='category' style='float:right; width:80%; padding:2px; border:2px;' pattern=[^'\x22]+></div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='responsible'>Responsible:</label></div>" + userSelect + "<br><br>\
						<div class='row'><div class='col-25'><label for='duedate'>Due Date:</label></div>\
						<div class='col-75'><input type='date' name='duedate' id='duedate' style='float:right; width:80%; padding:2px; border:2px;' pattern=[^'\x22]+></div></div>\
						<br><br>\
						<div class='row'><div class='col-25'><label for='description'>Description:</label></div>\
						<div class='col-75'><textarea style='width:100%; height:300px; padding:2px; border:2px;' name='description' id='description' form='description' Placeholder='Describe your project here...'></textarea></div></div>\
						<br><br>\
						<input type='submit' value='Create Project'>\
						</form>\
						</div>";
	res.render("dashboard.ejs", {statusMessage: projectFrame})
	});
}