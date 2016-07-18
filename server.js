var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var crypto = require('crypto');
var fs = require('fs');
var usersModule = require('./server_modules/users');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/loginSubmission', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var users = usersModule.getUsers();
	var reqData = req.body;
	var vUser, resData;
	for (var u in users) {
		if (u == reqData.username) {
			vUser = u;
			break;
		}
	}

	if (vUser) {
		if (users[vUser].pass == reqData.password) {
			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			var access_token = crypto.createHash('sha1').update(current_date + random).digest('hex');
			users[vUser].access_token = access_token;
			usersModule.setUsers(users, function(err) {
				if (err) {
					res.status(500);
					resData = {
						error: "Internal Server Error."
					};
				}
				else {
					console.log("User " + req.body.username + " successfully logged in!");
			    	res.status(200);
			    	resData = {
						access_token: access_token
					};
				}
				res.send(resData);
			});
		}
		else {
			res.status(401);
			resData = {
				error: "Invalid Password"
			};
			res.send(resData);
		}
	} else {
		res.status(401);
		resData = {
			error: "Invalid User"
		};
		res.send(resData);
	}
}); 

app.post('/logout', function(req, res) {
	console.log("logging out user: " + req.body.username);
	var users = usersModule.getUsers();

	if (delete users[req.body.username].access_token) {
		usersModule.setUsers(users, function(err) {
			if(err)
		        res.status(500);
		    else {
		    	console.log("User " + req.body.username + " successfully logged out!");
		    	res.status(200);
		    }
		    res.send();
		});
	} else {
		console.log("unable to delete access_token for user: " + req.body.username);
		res.status(500);
		res.send();
	}
});

http.listen(8100, function(){ 
	console.log('listening on *:8100'); 
});