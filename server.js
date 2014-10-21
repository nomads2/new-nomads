//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//var oscFunctions = require('./osc-bundle.js'); //require

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
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
server.listen( port);

//Setup OSC
var oscMessages = new Array();

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');

  //when new user enters his/her name, display.
  socket.on('newuser', function (data) {
    console.log('new user added! ' + data.name);
  });


  socket.on('message', function(data){
    socket.broadcast.emit('data_received',data); //send data back to all clients?
    socket.emit('server_message',data); // send data back to individual client?
    // console.log(data);
    sendOSC('/'+data.name+'/'+data.message['type'], data.message.value); //send OSC message
  
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
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/nomads_display', function(req,res){
  res.render('nomads_display.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Nomads pages blah blah blah'
             ,author: 'Your Name'
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
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://127.0.0.1:' + port );



//////////////////////            //////////////////////
////////////////////// OSC PLUGIN //////////////////////
//////////////////////            //////////////////////

// GLOBAL vars
var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');
var outport = 6789;


/**
 * Send single OSC message
 *
 * @param {string} [url] OSC address e.g. '/username/datatype'
 * @param {string int float} [data] data value to send
 */
sendOSC = function(url, data) {
  var buf;
  buf = osc.toBuffer({
    address: "" + url + "",
    args: [
      data
    ]
  });
  return udp.send(buf, 0, buf.length, outport, "localhost");
};

/**
 * Send multidimensional array as an OSC bundle (keys are addresses)
 * @author  Jon Bellona
 * @requires osc-min, dgram, udp4
 */
function sendOSCBundle(bundle) {
  var oscBundle = new Array();

  //convert keys from array into OSC addresses, push into oscBundle
  for (var k in bundle){
    if (bundle.hasOwnProperty(k)) {
      var tmpItem = { address: k, args: bundle[k] };
      oscBundle.push(tmpItem);
    }
  }
  console.log(oscBundle);

  //take oscBundle and send out as OSC message
  var buf;
  buf = osc.toBuffer(
  {
    oscType: "bundle",
    elements:
      oscBundle
  });
  return udp.send(buf, 0, buf.length, outport, "localhost");
};