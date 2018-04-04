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

//Setup Socket.IO

io.on('connection', function(socket){
  console.log('Client Connected');

  //when new user enters his/her name, display.
  socket.on('newuser', function (data) {
    console.log('new user added! ' + data.username);
    console.log(data);
    
    socket.emit('user_confirmed', data);
    socket.broadcast.emit('user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('message', function(data){
    socket.broadcast.emit('proc_update',data); //send data to all clients for processing sketch
    socket.broadcast.emit('client_update',data); //send data back to all clients?
   
    console.log(data);
  });
/*
  socket.on('begin_ceiling', function(){
    ;
  });

  socket.on('begin_auksalak', function(){
    ;
  });

  socket.on('stop_ceiling', function(){
    ;
  });

  socket.on('stop_auksalak', function(){
    ;
 });
*/
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });

});



///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

app.get('/', function(req,res){
  //res.send('hello world');
  
  res.render('index.pug', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads System'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
             ,cache: 'false'
            }
  });
});

// The Ceiling Floats Away Routes

app.get('/ceiling', function(req,res){
  res.render('ceiling_client.pug', {
    locals : { 
              title : 'The Ceiling Floats Away'
             ,description: 'The Ceiluing Floats Away'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/ceiling_display', function(req,res){
  res.render('ceiling_display.pug', {
    locals : { 
              title : 'The Ceiling Floats Away'
             ,description: 'Ceiling Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/ceiling_control', function(req,res){
  res.render('ceiling_control.pug', {
    locals : { 
              title : 'The Ceiling Floats Away Control'
             ,description: 'Ceiling Nomads System Control'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

// Auksalaq Routes

app.get('/auksalaq', function(req,res){
  res.render('auksalaq_client.pug', {
    locals : { 
              title : 'Auksalaq'
             ,description: 'Auksalaq Nomads System'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/auksalaq_display', function(req,res){
  res.render('auksalaq_display.pug', {
    locals : { 
              title : 'Auksalaq'
             ,description: 'Auksalaq Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/cauksalaq_control', function(req,res){
  res.render('auksalaq_control.pug', {
    locals : { 
              title : 'Auksalaq Control'
             ,description: 'Auksalaq Nomads System Control'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

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


function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://127.0.0.1:' + port );



