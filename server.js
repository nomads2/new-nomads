//setup Dependencies
var connect = require('connect');

//Setup Express
var express = require('express');
var path = require('path');
let app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = (process.env.PORT || 8081);


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.set('env', 'development');



server.listen(port);

//Setup OSC functions
//var oscMessage = require("./osc-bundle.js");

//Setup Socket.IO

io.on('connection', function(socket){
  console.log('Client Connected');

  //when new user enters his/her name, display.
  socket.on('newuser', function (data) {
    console.log('new user added! ' + data.username);
    console.log(data);
    //oscMessage.sendOSC('/newuser', data);
    socket.broadcast.emit('user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('message', function(data){
    socket.broadcast.emit('proc_update',data); //send data to all clients for processing sketch
    socket.broadcast.emit('client_update',data); //send data back to all clients?
    //oscMessage.sendOSC('/object', data);  //just send a single block instead of multiple, smaller OSC messages
    // sendOSCText('/thought', data);
    // sendOSC('/geolocation', [ data.latitude, data.longitude ] );
    //socket.emit('server_message',data); // send data back to individual client?
    console.log(data);
  });

  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });

});



///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

app.get('/', function(req,res){
  res.render('client.pug', {
    locals : { 
              title : 'Nomads'
             ,description: 'Your Page Description'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/client', function(req,res){
  res.render('client.pug', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads main client'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/display', function(req,res){
  res.render('display.pug', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/conference', function(req,res){
  res.render('conference.pug', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads conference display'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});
*/

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://127.0.0.1:' + port );



