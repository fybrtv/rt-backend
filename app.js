var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err)
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(6060, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Fybr server at http://%s:%s', host, port);
  //addToTimeline(83,'553c4755594c6adaa7ad79e3');
})
var amas = io.of('/ama');
var usernames = {};
var rooms = ['Lobby'];

amas.on('connection', function(socket){
    socket.on('creatorInit', function(data){
        socket.join(data.creatorId)
    })
    socket.on('init', function(data){
        socket.join(data.channelId)
    })
    socket.on('question', function(data){
      io.to(data.creatorId).emit(data.question);
    })
    socket.on('answer', function(data){
      socket.broadcast.to(data.channelId).emit('newAnswer', { question: data.question, answer: data.answer} );
    })
});


module.exports = app;
