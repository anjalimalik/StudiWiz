const express = require('express')
const app = express()
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

var mysql = require('mysql');

var db = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_NAME
});

db.connect(function (error) {
    if (error) {
        console.error('Database connection failed: ' + error.stack);
        return;
    }

    console.log('Connected to database.');
});

app.post('/login', function (req, res) {

  var email = req.body.email;
  var password = req.body.pass;

  if (!email || !password) { //SHOULD BE HANDLED IN JS too
    return res.status(401).json({ message: "invalid_credentials" });
  }

  var dbQuery = "SELECT * FROM Users WHERE Email = ? AND Password = ?";
  var requestParams = [email, password];

  db.query(dbQuery, requestParams, function (err, result) {

    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result == null || result == "") {
      return res.status(401).json({ message: "invalid_credentials" });
    }
  });
});