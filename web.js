// web.js
var express = require("express");
var app = express();
var io = require('socket.io').listen(app);
var logfmt = require("logfmt");

//app.use(logfmt.requestLogger());
// app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
    // console.log('client connected');
    // agx.initGame(io, socket);
});