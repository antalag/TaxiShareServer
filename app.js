var express = require("express"),  
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

// Import Models and controllers
var models     = require('./models/user')(app, mongoose);

var router = express.Router();

router.get('/', function(req, res) {  
   res.send("Hello World!");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use(router);

 
mongoose.connect('mongodb://localhost/user', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
  app.listen(9615, function() {
    console.log("Node server running on http://localhost:9615");
    console.log("Connected to database");
  });
});

var UserCtrl = require('./controllers/users');

// API routes
var users = express.Router();

users.route('/users')  
  .get(UserCtrl.findAllUsers)
  .post(UserCtrl.addUser);

users.route('/users/:id')  
  .get(UserCtrl.findById)
  .put(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

app.use('/api', users); 