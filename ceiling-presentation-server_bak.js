//setup Dependencies
var connect = require('connect');
var keypress = require('keypress');

//Setup Express
var express = require('express');
var path = require('path');
let app = express();
var server = require('http').Server(app);
var ioc = require('socket.io-client');


var port = (process.env.PORT || 80);
var server_loc = 'http://nomads.music.virginia.edu:';


//Setup OSC functions
var oscMessage = require("./osc-bundle.js");


var userID = "Matthew_Max_Patch_"+Math.floor(Math.random()*1000);
var message = '';

socket = ioc.connect('http://nomads.music.virginia.edu:8081');

socket.once("connection", function(socket){
  console.log('Client connected to port ' + port);

});

//when new user enters his/her name, display.
socket.on('user_confirmed', function (data) {
  console.log('new user added! ' + data.username);
  //console.log(data);
  oscMessage.sendOSC('/newuser', data);
  
});

//see NomadsMobileClient.js for data var
socket.on('client_update', function(data){
  
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
  console.log(key.name);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
    process.exit();
  }
  else if(key.name == 'return'){
    if(message=='start_nomads'){
      sendPoemData(message, "start_nomads");
      message = '';  
    }
    else if(message=='stop_nomads'){
      sendPoemData(message, "stop_nomads");
      message = '';  
    }else{
      sendPoemData(message, "poemMessage");
      message = '';  
    }
  }
  else{
    message = message + key.name;
  }

});
 
process.stdin.setRawMode(true);
process.stdin.resume();

receiveOsc = function(data){
  sendPoemData(data);
}

oscMessage.setOscCallback(receiveOsc);

sendPoemData = function(data, type){
  console.log("sending data ", data);

  var messageToSend = {};
  messageToSend.id = userID;
  messageToSend.username = "Matthew_Max_Patch";
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
  
  socket.emit('message', messageToSend);
     
}

