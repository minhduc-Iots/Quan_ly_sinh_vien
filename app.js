//require express
var express = require('express');
//khởi tạo express
var app = express();
var path = require('path');
app.use(express.static(path.resolve('./public')));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs');

var user = false;
const port = 8000;

// ########################## DATABASE ##############################
//Listen port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
// Connect database
var mysql = require('mysql');
const { dirname } = require('path');
console.log('Get connection ...');
var db = mysql.createConnection({
    database: 'qlsinhvien',
    host: "localhost",
    user: "root",
    password: ""
});
db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});global.db = db;

function getAllStudents() {
    var sql1 = "SELECT * FROM sinhvien";
    let res;
    conn.query(sql1, function (err, results) {
        console.log(results);
        res = results;
    });
    return res;
}

// ########################## Pages Display ##############################
app.get('/', function (req, res) {
    if (user == false) res.redirect("/login");
    if (req.query.hasOwnProperty("search")) {
        var search = req.query.search;
      }
    var sql3 = "SELECT * from `sinhvien`  ORDER BY masv ASC;";
    
    db.query(sql3,function(err,results){
        if (err) throw err;
        if (!!search) {
            listsearch = [];
            results.forEach((element) => {
              console.log(element.masv);
              if (element.masv.toString().includes(search))
                listsearch.push(element);
            });
      
            res.render('pages/student', { students: listsearch, search: search });
          } else {
            res.render('pages/student', { students: results });
          }
        });
});
//login page
app.get('/login', function (req, res) {
    if (user == true) res.redirect('/');
    else res.render('pages/login');
});
// Logout page
app.get('/logout', function (req, res) {
    user = false;
    res.redirect('/login');
});
// Forgot Password page 
app.get('/password', function(req, res) {
    res.render('pages/password');
});
// Signup page 
app.get('/signup', function(req, res) {
    res.render('pages/signup');
});
// about page 
app.get('/about', function (req, res) {
    res.render('pages/about');
}); 
app.get('/about', function (req, res) {
    if (user == false) res.redirect('/login')
    res.render('pages/about');
});
//information page
app.get('/student', function(req,res){
    if (req.query.hasOwnProperty("search")) {
        var search = req.query.search;
      }
    var sql3 = "SELECT * from `sinhvien`  ORDER BY masv ASC;";

    db.query(sql3,function(err,results){
        if (err) throw err;
        if (!!search) {
            listsearch = [];
            results.forEach((element) => {
              console.log(element.masv);
              if (element.masv.toString().includes(search))
                listsearch.push(element);
            });
      
            res.render('pages/student', { students: listsearch, search: search });
          } else {
            res.render('pages/student', { students: results });
          }
        });
});
//information page
app.get('/information', function(req,res){
    res.render('pages/information');
});
// Account page
app.get('/account', function(req,res){
    res.render('pages/account');
})
// Contact page
app.get('/contact', function(req,res){
    res.render('pages/Contact');
})
// Add-student page
app.get('/add-student',function(req,res){
    res.render('pages/add-student');
    
})
// ########################## API interface Database ##############################

app.get('/api/login', function (req, res) {
    // console.log(req.query.username)
    var sql1 = `SELECT * FROM user WHERE username='${req.query.username}'AND password='${req.query.password}'`
    console.log(sql1)
    // thực hiện truy vấn
    db.query(sql1, function (err, results) {
        console.log(err)
        if (err) throw err;
        // console.log(results);
        // data trả về đưa vào trang web
        console.log('Success')
        if (results.length > 0) {
            user = true;
            res.redirect('/information')
        }
        else res.redirect('/login')
    });
});

// truy vấn csdl 
app.get('/api/add', function (req, res) {
    console.log('bod', req.query)
    // truy vấn csdl để tạo một ten
    var sql2 = "INSERT INTO `sinhvien` VALUES ('"+req.query.masv+"','"+ req.query.hovaten+"','"+req.query.email+"','"+req.query.sodienthoai+"','"+req.query.password+"');";
    console.log(sql2);
    db.query(sql2, function (err, results) {

        // tao ten xong thì trở về trang chủ
        console.log(results);
        res.redirect('/');
    });
});
app.get('/api/delete_student', function (req, res) {
    console.log(req.query)
    var sql1 = `DELETE FROM sinhvien WHERE masv=${req.query.masv}`;
    db.query(sql1, function (err, results) {
        res.redirect('/')
    });
});

// ##########################################################################
