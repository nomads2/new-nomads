//setup Dependencies
var connect = require('connect');

//Setup Express
var express = require('express');
var path = require('path');
let app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var keypress = require('keypress');

var port = (process.env.PORT || 8081);

const debug = false;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.set('env', 'development');

server.listen(port);

var message = '';
var main_socket;

//Setup Socket.IO

io.on('connection', function(socket){
  if(debug){
    console.log('Client Connected');  
  }

  main_socket = socket;
  
  //ceiling
  socket.on('ceiling_newuser', function (data) {
    if(debug){
      console.log('new user added! ' + data.username);
      console.log(data);
    }
    
    socket.emit('ceiling_user_confirmed', data);
    socket.broadcast.emit('ceiling_user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('ceiling_message', function(data){
    socket.broadcast.emit('ceiling_proc_update',data); //send data to all clients for processing sketch
    socket.broadcast.emit('ceiling_client_update',data); //send data back to all clients?
    if(debug){
      console.log(data);
    }
  });


  //auksalaq
  socket.on('auksalaq_newuser', function (data) {
    if(debug){
      console.log('new user added! ' + data.username);
      console.log(data);
    }
    
    socket.emit('auksalaq_user_confirmed', data);
    socket.broadcast.emit('auksalaq_user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('auksalaq_message', function(data){
    //socket.broadcast.emit('auksalaq_proc_update',data); //send data to all clients for processing sketch
    socket.broadcast.emit('auksalaq_client_update',data);
    socket.emit('auksalaq_client_update',data);
    if(debug){
      console.log(data);
    }
  });

  //mode change from controller
  socket.on('auksalaq_mode', function(data){
    socket.broadcast.emit('auksalaq_mode', data);
    if(debug){
      console.log(data);
    }
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
    if(debug){
      console.log('Client Disconnected.');
    }
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
  res.render('ceiling/ceiling_client.pug', {
    locals : { 
              title : 'The Ceiling Floats Away'
             ,description: 'The Ceiluing Floats Away'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/ceiling_display', function(req,res){
  res.render('ceiling/ceiling_display.pug', {
    locals : { 
              title : 'The Ceiling Floats Away'
             ,description: 'Ceiling Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/ceiling_control', function(req,res){
  res.render('ceiling/ceiling_control.pug', {
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
  res.render('auksalaq/auksalaq_client.pug', {
    locals : { 
              title : 'Auksalaq'
             ,description: 'Auksalaq Nomads System'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/auksalaq_display', function(req,res){
  res.render('auksalaq/auksalaq_display.pug', {
    locals : { 
              title : 'Auksalaq'
             ,description: 'Auksalaq Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

app.get('/auksalaq_control', function(req,res){
  res.render('auksalaq/auksalaq_control.pug', {
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

  // very basic!
  if(debug){
    console.error(err.stack);
  }

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});


function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

if(debug){
  console.log('Listening on http://127.0.0.1:' + port );
}

//for testing
sendChat = function(data, type){
  if(debug)
    console.log("sending data ", data);

  var messageToSend = {};
  messageToSend.id = 123;
  messageToSend.username = "Nomads_Server";
  messageToSend.type = type;
  messageToSend.messageText = data;
  messageToSend.location = 0;
  messageToSend.latitude = 0;
  messageToSend.longitude = 0;
  messageToSend.x = 0;
  messageToSend.y = 0;
  var date = new Date();
  d = date.getMonth()+1+"."+date.getDate()+"."+date.getFullYear()+ " at " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  messageToSend.timestamp = d;
  
  main_socket.broadcast.emit('auksalaq_client_update', messageToSend);
  

     
}

//Setup key input listening
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log(key.name);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
    process.exit();
  }
  else if(key.name == 'return'){
    if(message=='start_nomads'){
      sendChat(message, "start_nomads");
      message = '';  
    }
    else if(message=='stop_nomads'){
      sendChat(message, "stop_nomads");
      message = '';  
    }else{
      sendChat(message, "aukchatmessage");
      message = '';  
    }
  }
  else{
    message = message + key.name;
  }

});
 
process.stdin.setRawMode(true);
process.stdin.resume();




