const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
var router = express.Router();
var path = __dirname + '/public/index.html/';

const app = express();
const port = 3000;
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'PROGNOZWEBSITE'
});

app.use(bodyParser.json());


app.listen(port, () => {
	console.log(`Server started at port http://localhost:${port}`);
});

connection.connect(function (error) {
	if (!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully!');
	}
});

module.exports = connection;

app.get('/register', function (req, res) {
	res.sendFile(_dirname + '/register.html');
})

app.post('/register', function (req, res) {
	var f_name = req.body.Firstname;
	var l_name = req.body.Lastname;
	var sid = req.body.stud_id;
	var email = req.body.mail;
	var course = req.body.Coursename;

	connection.connect(function (err) {
		var sql = "insert into Student(f_name,l_name,sid,email,course) values (" + f_name + "," + l_name + "," + sid + "," + email + "," + course + ")";
		connection.query(sql, function (rerr, results) {
			if (err) throw err;
			console.log('1 Record Inserted');
			res.redirect('/');
		});
	});

});

app.get('/modify', function (req, res) {
	res.sendFile(_dirname + '/modify.html');
})

app.post('/modify', function (req, res) {
	var sid = req.body.stud_id;
	var f_name = req.body.Firstname;
	var l_name = req.body.Lastname;
	var email = req.body.mail;
	var course = req.body.Coursename;

	connection.connect(function (err) {
		var sql = "update Student set f_name='"+Firstname+"',l_name='"+Lastname+"',sid='"+stud_id+"',email='"+mail+"',course='"+Coursename+"' where sid="+stud_id+"";
		connection.query(sql, function (rerr, results) {
			if (err) throw err;
			console.log('1 Record Updated');
			res.redirect('/');
		});
	});

});

app.get('/delete', function (req, res) {
	res.sendFile(_dirname + '/delete.html');
})

app.post('/delete', function (req, res) {
	var sid = req.body.stud_id;
	
	connection.connect(function (err) {
		var sql = "delete from Student where sid="+stud_id+"";
		connection.query(sql, function (rerr, results) {
			if (err) throw err;
			console.log('1 Record Deleted');
			res.redirect('/');
		});
	});

});