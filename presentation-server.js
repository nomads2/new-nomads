//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , keypress = require('keypress')
    , port = (process.env.PORT || 80);

//Setup OSC functions
var oscMessage = require("./osc-bundle.js");
var ioc = require('socket.io-client');
var client = ioc.connect("http://nomadslive.music.virginia.edu:"+port);
var userID = "Matthew_Max_Patch_"+Math.floor(Math.random()*1000);
var message = '';

receiveOsc = function(data){
  sendPoemData(data);
}

oscMessage.setOscCallback(receiveOsc);

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

//Setup key input listening
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
    process.exit();
  }
  if(key.name == 'return'){
    sendPoemData(message);
    message = '';
  }else{
    message = message + key.name;
  }

});
 
process.stdin.setRawMode(true);
process.stdin.resume();

sendPoemData = function(data){
  console.log("sending data ", data);

  var messageToSend = {};
  messageToSend.id = userID;
  messageToSend.username = "Matthew_Max_Patch";
  messageToSend.type = "poemMessage";
  messageToSend.messageText = data;
  messageToSend.location = 0;
  messageToSend.latitude = 0;
  messageToSend.longitude = 0;
  messageToSend.x = 0;
  messageToSend.y = 0;
  var date = new Date();
  d = date.getMonth()+1+"."+date.getDate()+"."+date.getFullYear()+ " at " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  messageToSend.timestamp = d;
  
  client.emit('message', messageToSend);
     
}

