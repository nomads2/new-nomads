//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//var oscFunctions = require('./osc-bundle.js'); //require

//Setup Express
var server = express();
/*
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/public'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Nomads aren\'t here'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
*/
server.listen(port);

//Setup OSC functions
var oscMessage = require("./osc-bundle.js");

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');

  //when new user enters his/her name, display.
  socket.on('newuser', function (data) {
    console.log('new user added! ' + data.username);
    //console.log(data);
    oscMessage.sendOSC('/newuser', data);
    socket.broadcast.emit('user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('message', function(data){
    socket.broadcast.emit('proc_update',data); //send data to all clients for processing sketch
    socket.broadcast.emit('client_update',data); //send data back to all clients?
    oscMessage.sendOSC('/object', data);  //just send a single block instead of multiple, smaller OSC messages
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

server.get('/', function(req,res){
  res.render('client.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Your Page Description'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/client', function(req,res){
  res.render('client.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads main client'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/display', function(req,res){
  res.render('display.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads message disply'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/conference', function(req,res){
  res.render('conference.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads conference display'
             ,author: 'TThatcher'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound('Sorry, that page is not on this server');
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://127.0.0.1:' + port );



