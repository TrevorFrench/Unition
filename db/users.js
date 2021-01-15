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
//----------------DELIVERS THE PROJECT CREATION FORM (NO QUERIES)---------------
//------------------------------------------------------------------------------
exports.createProject2 = function(request, response) => {
	process.nextTick(function() {
    var userSelect= "<select id='responsible' name='responsible'>";
	for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      userSelect += "<option value='" + record.displayName + "'>" + record.displayName + "</option>";

    }
	userSelect += "</select>";
  });
	var projectFrame = "<p><i>*Please do not use quotation marks or apostrophes in the form.</i></p><form action='/postProject' method='post' id='description'> <label for='title'>Title:</label><br><br><input type='text' name='title' id='title' pattern=[^'\x22]+><br><br><label for='statusSQL'>Status:</label><br><br><select id='statusSQL' name='statusSQL'><option value='Open'>Open</option><option value='In-process'>In-process</option><option value='Closed'>Closed</option></select><br><br><label for='responsible'>Responsible:</label><br><br>" + userSelect + "<br><br><label for='duedate'>Due Date:</label><br><br><input type='date' name='duedate' id='duedate' pattern=[^'\x22]+><br><br><label for='description'>Description:</label><br><br><textarea style='width:300px; height:300px;' name='description' id='description' form='description' Placeholder='Describe your project here...'></textarea><br><br><input type='submit' value='Create Project'></form>";
	response.render("dashboard.ejs", {statusMessage: projectFrame})
}