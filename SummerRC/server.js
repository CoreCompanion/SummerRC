//var express = require('express'),
//	app = express(),
//	server= require('http').createServer(app),
//	io= require('socket.io').listen(server),
//	mongoose = require('mongoose'),
//	path = require('path');
//    wines = require('./www/js/index');

//This allows for the use of other scripts
//app.use(express.static(__dirname + '/www/'));
//This is the port that the server is run on
//server.listen(3000);
//app.listen(3000);
//Connects to the mongodb server and returns if connected or not
//mongoose.connect('mongodb://localhost/rc', function(err){
//	if(err)
//	{
//		console.log(err);
//	}else{
//		console.log("connected to mongodb");
//	}
//});

//var socket = io.connect();

//socket.emit('new Comment', commentObj);

//socket.on('find Comment', function (data) {
//    DisplayReplies();

//});

//var userSchema = mongoose.Schema({
//    name: String,
//    password: String,
//    currGrade: 0,
//    auth: false,
//    points: 0,
//    Email: String,
//    created: Date
//});
//var User = mongoose.model("User", userSchema)

//io.sockets.on('connection', function (socket) {

//    socket.on('new User', function (data) {

//    });
//    User.find({}, function (err, doc) {
//    });
//    socket.on('disconnect', function (data) {

//    });

//});


var express = require('express'),
    path = require('path'),
    http = require('http'),
    sd = require('./www/js/services/script');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'www')));
    app.use(express.static(path.join(__dirname, 'www/js')));

});

app.get('/studentdetails', sd.findAll);
app.get('/studentdetails/:id', sd.findById);
app.post('/studentdetails', sd.addSd);
app.put('/studentdetails/:id', sd.updateSd);
app.delete('/studentdetails/:id', sd.deleteSd);

//app.listen(3000);
//console.log('Listening on port 3000...');

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
