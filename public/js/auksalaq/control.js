/**
 * Test functions for server.
 */

var client;

$(document).ready(function() {   

  var log = new Array();


  var user = {};
  var socket = io.connect();
  
  client = new NomadsMobileClient(initCallback);

  // on connection to server
  socket.on('connect', function() {
    console.log("connected!");
    $('#status').append("Connected to NOMADS server");
  });

  socket.on("disconnect", function() {
    //https://github.com/LearnBoost/socket.io-client/issues/251
    console.log("reconnecting");
    socket.socket.reconnect();
  });

  //listen for user joining
  socket.on('auksalaq_user_confirmed', function(data){
    log.push(data);
   $('#status').append("<li>"+ data.timestamp + ": " + data.username+" has joined Nomads Auksalaq</li>");
   
  });

  //listen for message from the server.
  socket.on('auksalaq_client_update', function(data){
    log.push(data);
    //oscMessage.sendOSC('/object', data);
   
   $('#status').append("<li>"+data.timestamp + ": " + data.messageText + " from: " + data.username+"</li>");
  });

  $('#chatMode').click(chatMode);
  $('#xyMode').click(xyMode);
  $('#thoughtMode').click(thoughtMode);

});

initCallback = function(){
  
}

chatMode = function(e){
  $('#status').append("<li>chatMode initiated</li>");  
  client.changeMode('chatMode');
}

xyMode = function(e){
  $('#status').append("<li>xyMode initiated</li>");  
  client.changeMode('xyMode');
}

thoughtMode = function(e){
  $('#status').append("<li>thoughtMode initiated</li>"); 
  client.changeMode('thoughtMode');
}