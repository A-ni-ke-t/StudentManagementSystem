//importing libraries 
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const moment = require('moment');


// exporting express library functions to an constant app
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));

//to display pictures of bootstrap on webpage to search root folder 
app.use(express.static('public'));
app.use('/images', express.static('images'));

const port = 3000;

// displaying connection port 

app.listen(port, () => {
	console.log(`Server started at port http://localhost:${port}`);
});

//creating MySQL connection

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: 3306,
	database: 'PROGNOZWEBSITE'
});

//default routing to index.html file

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

//register page 


app.get('/register', function (req, res) {
	connection.query('SELECT bid FROM Batch', (err, rows) => {
		if (err) throw err;
		const batchIds = rows.map(row => row.bid);
		res.render('/Users/aniketlimaye/Documents/nodeWorkspace/proj3/ views/register.ejs', { batchIds }); 
	  });	
})

app.post('/registerdemo', function (req, res) {
	
	var sid = req.body.sid;
	var f_name = req.body.Firstname;
	var l_name = req.body.Lastname;
	var email = req.body.mail;
	var course = req.body.Coursename;
	var uname = req.body.Username;
	var pass = req.body.password;
	var bid = req.body.batch;

	var sql = "insert into Student (f_name,l_name,sid,email,course,uname,pass,bid) values ('" + f_name + "','" + l_name + "'," + sid + ",'" + email + "','" + course + "','" + uname + "','" + pass + "','" + bid + "')";
	connection.query(sql, function (err, results) {
		if (err) throw err;
		console.log('1 Record Inserted.');
		res.redirect('/');
	});
});

//modify page

app.get('/modify', function (req, res) {
	res.sendFile(__dirname + '/modify.html');
})

app.post('/modifydemo', function (req, res) {
	
	var sid = req.body.sid;
	var f_name = req.body.Firstname;
	var l_name = req.body.Lastname;
	var email = req.body.mail;
	var course = req.body.Coursename;
	var uname = req.body.Username;
	var pass = req.body.password;
	var bid = req.body.bid;

	var sql = "update Student set f_name='" + f_name + "',l_name='" + l_name + "',sid=" + sid + ",email='" + email + "',course='" + course + "',uname='" + uname + "',pass='" + pass + "',bid='" + bid + "' where sid=" + sid + " AND bid= "+bid +" ";
	connection.query(sql, function (err, results) {
		if (err) throw err;
		console.log('1 Record Updated');
		res.redirect('/');
	});
});

//delete page

app.get('/delete', function (req, res) {
	res.sendFile(__dirname + '/delete.html');
})

app.post('/deletedemo', function (req, res) {
	var sid = req.body.sid;
	var bid = req.body.bid;


	var sql = "delete from Student where sid=" + sid + " AND bid=" + bid +"";
	connection.query(sql, function (err, results) {
		if (err) throw err;
		console.log('1 Record Deleted');
		res.redirect('/');
	});
});


//login page 

app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/login.html');
})

app.post("/logindemo", function (req, res) {
	var uname = req.body.uname;
	var pass = req.body.pass;

  res.cookie('userData', { uname, pass });
	if (uname && pass) {
		connection.query("select * from student where uname=? and pass=?", [uname, pass], function (error, result, field) {
			if (result.length > 0) {
				res.redirect('/display');
			}
			else {
				res.send('Incorrect User Name and Password');
			}
		});
	}
});

//Display Student Details 


app.get('/display', function (req, res) {
	const { userData } = req.cookies;

	if (userData && userData.uname && userData.pass) {
		var sql = "SELECT *,sid,bid FROM student WHERE uname = ? AND pass = ?";
		connection.query(sql, [userData.uname, userData.pass], function (err, rows) {
			if (err) throw err;
			const updatedUserData = { ...userData, sid: rows[0].sid, bid: rows[0].bid };
			res.cookie('userData', updatedUserData);
			res.render('/Users/aniketlimaye/Documents/nodeWorkspace/proj3/ views/show.ejs', { data: rows });
		});
	} else {
		res.send('User data not found.');
	}
});

//Display Student Attendance
app.get('/show', function (req, res) {
	const { userData } = req.cookies;
  
	if (userData && userData.uname && userData.pass) {
	  var sql = "select currentDate, date(currentDate) as date ,sts FROM attendance WHERE sid = ? AND bid = ?";
	  connection.query(sql, [userData.sid, userData.bid], function (err, rows) {
		if (err) throw err;
		res.render('/Users/aniketlimaye/Documents/nodeWorkspace/proj3/ views/viewattendance.ejs', { data: rows });
	  });
	} else {
	  res.send('User data not found.');
	}
  });
  

//Admin login page 

app.get('/adminlogin', function (req, res) {
	res.sendFile(__dirname + '/adminlogin.html');
});

app.post("/adminlogindemo", function (req, res) {
	var u_name = req.body.u_name;
	var u_pass = req.body.u_pass;
	if (u_name && u_pass) {
		connection.query("select * from adminDetails where u_name=? and u_pass=?", [u_name, u_pass], function (error, result, field) {
			if (result.length > 0) {
				res.sendFile(__dirname + '/admin.html');
		}
			else {
				res.send('Incorrect User Name and Password');
			}
		});
	}
});

//create batch

app.get('/create', function (req, res) {
	res.sendFile(__dirname + '/create.html');
})


app.post("/createdemo", function (req, res) {
	var bid = req.body.bid;
	var bname = req.body.bname;
	var startDate=req.body.startDate;
	connection.query("insert into Batch (bid,bname,startDate) values ('" + bid + "','" + bname + "','" + startDate + "')"
	,function (err, results) {
		if (err) throw err;
		console.log('Batch Created');
		res.redirect('/');
	});
});
  
  //attendance 
  app.get('/attendance', function (req, res) {
	res.sendFile(__dirname + '/attendance.html');
});

	app.post('/attendancedemo', function (req, res) {
		var bid = req.body.bid;
		var sql = "SELECT sid, f_name FROM Student WHERE bid = ?";
		
		connection.query(sql, [bid], function (err, results) {
		  if (err) throw err;
		  
		  res.render('/Users/aniketlimaye/Documents/nodeWorkspace/proj3/ views/result.ejs', { bid: bid, students: results });
		});
	  });
	  
	  app.post('/markattendancedemo', (req, res) => {
		const batchId = req.body.bid;
		const studentData = Object.keys(req.body).reduce((acc, key) => {
		  const match = key.match(/^student\[(\d+)\]\[(\w+)\]$/);
		  if (match) {
			const sid = match[1];
			const field = match[2];
			if (!acc[sid]) {
			  acc[sid] = { sid: sid };
			}
			acc[sid][field] = req.body[key];
		  }
		  return acc;
		}, {});
	  		
		if (studentData && Object.keys(studentData).length > 0) {
		  const attendanceData = Object.values(studentData).map((student) => {
			return [student.sid, batchId, student.status || 'absent'];
		  });
	  
		  const insertQuery = 'INSERT INTO attendance (sid, bid, sts) VALUES ?';
	  
		  connection.query(insertQuery, [attendanceData], (error, results) => {
			if (error) throw error;
	  
			console.log('Attendance data inserted successfully.');
			console.log(studentData);
	  
			res.redirect('/');
		  });
		} else {
		  console.log('No student data provided.');
		  res.redirect('/');
		}
	  });

