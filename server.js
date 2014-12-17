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
server.listen( port);

//Setup OSC
var oscMessages = new Array();

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');

  //when new user enters his/her name, display.
  socket.on('newuser', function (data) {
    console.log('new user added! ' + data.username);
    //console.log(data);
    sendOSC('/newuser', data);
    socket.broadcast.emit('user_confirmed', data);
  });

  //see NomadsMobileClient.js for data var
  socket.on('message', function(data){
    socket.broadcast.emit('client_update',data); //send data back to all clients?
    sendOSC('/object', data);  //just send a single block instead of multiple, smaller OSC messages
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
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/client', function(req,res){
  res.render('client.jade', {
    locals : { 
              title : 'Nomads'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/display', function(req,res){
  res.render('display.jade', {
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
    throw new NotFound('Sorry, that page is not on this server');
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
var outport = 6789; //Max/MSP sound
var outport2 = 6790; //Prcoessing visual


/**
 * Send single OSC message (thought cloud)
 *
 * @param {string} [url] OSC address e.g. '/datatype user location message'
 * @param {string int float} [data] data value to send
 */
sendOSCText = function(url, data) {
  var buf;
  buf = osc.toBuffer({
    address: "" + url + "",
    args: [
      data.username, data.location, data.messageText
    ]
  });
  return udp.send(buf, 0, buf.length, outport, "localhost");
};

/**
 * Dynamically send any size array as a single OSC message
 *
 * @param {string} [url] OSC address e.g. '/datatype user location message'
 * @param {string int float} [data] data value to send
 */
sendOSC = function(url, data) {
  var buf;
  var argArray = new Array();
  for (var k in data){
    if (data.hasOwnProperty(k)) {
      argArray.push(data[k]);
    }
  }
  buf = osc.toBuffer({
    address: "" + url + "",
    args: 
      argArray
  });
  udp.send(buf, 0, buf.length, outport, "localhost");
  return udp.send(buf, 0, buf.length, outport2, "localhost");
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
  udp.send(buf, 0, buf.length, outport, "localhost");
  return udp.send(buf, 0, buf.length, outport2, "localhost");
};