//setup Dependencies
var connect = require('connect');
var keypress = require('keypress');

//Setup Express
var express = require('express');
var path = require('path');
let app = express();
var server = require('http').Server(app);
var ioc = require('socket.io-client');

// OSC Lib
var outport_max = 6789; //Max/MSP sound
var inport_max = 6791; //From Max/MSP
var outport_proc = 6790; //Prcoessing visual

const OSC = require('osc-js');
const options = { send: { port: outport_max }};
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options)});

var port = (process.env.PORT || 80);
var server_loc = 'http://nomads.music.virginia.edu:';


var userID = "Matthew_Max_Patch_"+Math.floor(Math.random()*1000);
var message = '';

socket = ioc.connect('http://nomads.music.virginia.edu:80');

socket.once("connection", function(socket){
  console.log('Client connected to port ' + port);

});

//when new user enters his/her name, display.
socket.on('auksalaq_user_confirmed', function (data) {
  console.log('new user added! ' + data.username);
  //console.log(data);
  osc.send(new OSC.Message('/newuser', data.username, data.id, data.type));
  
});

//see NomadsMobileClient.js for data var
socket.on('auqsalaq_client_update', function(data){
  
  osc.send(new OSC.Message('/object', data.id, data.username, data.type, data.messageText, data.location));  //just send a single block instead of multiple, smaller OSC messages
  // sendOSCText('/thought', data);
  // sendOSC('/geolocation', [ data.latitude, data.longitude ] );
  //socket.emit('server_message',data); // send data back to individual client?
  console.log(data);
});

socket.on("connect_error", function(error){console.log("connect error "+error);});
socket.on("connect_timeout", function(error){console.log("timeoout error "+error);});
socket.on("error", function(error){console.log(error);});

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

sendOSCMessage = function(type, data){
  osc.send(new OSC.Message(type, data));

}

sendChat = function(data, type){
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
  
  //socket.emit('message', messageToSend);

  osc.send(new OSC.Message('/aukchatmessage', messageToSend.id, messageToSend.username, messageToSend.messageText));

     
}

