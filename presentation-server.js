//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 80);

//Setup OSC functions
var oscMessage = require("./osc-bundle.js");
var ioc = require('socket.io-client');
var client = ioc.connect("http://nomadslive.music.virginia.edu:"+port);

client.once("connect", function(){
  console.log('Client connected to port ' + port);

});

//when new user enters his/her name, display.
  client.on('user_confirmed', function (data) {
    console.log('new user added! ' + data.username);
    //console.log(data);
    oscMessage.sendOSC('/newuser', data);
    
  });

  //see NomadsMobileClient.js for data var
  client.on('client_update', function(data){
    
    oscMessage.sendOSC('/object', data);  //just send a single block instead of multiple, smaller OSC messages
    // sendOSCText('/thought', data);
    // sendOSC('/geolocation', [ data.latitude, data.longitude ] );
    //socket.emit('server_message',data); // send data back to individual client?
    console.log(data);
  });
