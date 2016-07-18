var fs = require('fs');
var jsonFile = "dummy_data/users.json";
var vUsers = {};

//initial read
fs.readFile(jsonFile, 'utf8', function(err, data) {
	data = JSON.parse(data);
	if (err) {
		console.log("Error while reading data from " + jsonFile);
		console.log(err);
	}
	vUsers = data;
});

function getUsers() {
	console.log(vUsers);
	return vUsers;
}

function setUsers(users, callback) {
	vUsers = users;
	fs.writeFile(jsonFile, JSON.stringify(users), function(err) {
		if (err) {
			console.log("Error while writing data to " + jsonFile);
			console.log(err);
		}
		callback(err);
	});
}

function getUser(username) {
	return vUsers[username];
}

function setUser(username, data, callback) {
	vUsers[username] = data;
	setUsers(vUsers);
}

function verifyUser(accessToken) {
	for (var user in vUsers) {
		if (vUsers[user].access_token == accessToken)
			return true;
	}
	return false;
}

exports.getUsers = getUsers;
exports.setUsers = setUsers;
exports.getUser = getUser;
exports.setUser = setUser;
exports.verifyUser = verifyUser;


