var express = require("express"),  
    http = require('http'),
    io = require('socket.io'),
    app = express(),
    server=http.createServer(app),
    ioSock=io.listen(server),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

// Import Models and controllers
//var models     = require('./models/user')(app, mongoose);

var router = express.Router();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user-agent");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

var socket = require('./sockets/base')(ioSock);
app.use(router);

 
mongoose.connect('mongodb://localhost/TaxiShare', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
  server.listen(9615, function() {
    console.log("Node server running on http://localhost:9615");
    console.log("Connected to database");
  });
});
var Controllers = require('./taxishareserver.min');

// API routes
var users = express.Router();

users.route('/users')  
  .get(Controllers.findAllUsers)
  .post(Controllers.addUser);

users.route('/users/:id')  
  .get(Controllers.findById)
  .put(Controllers.updateUser)
  .post(Controllers.updateUser)
  .delete(Controllers.deleteUser);

users.route('/users/near/:lat/:lng')  
  .get(Controllers.getNear);
  
users.route('/users/login/:email/:password')  
  .get(Controllers.login)

app.use('/api', users); 