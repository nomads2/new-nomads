/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var log = new Array();


  var user = {};
  var socket = io.connect();
  

  // on connection to server
  socket.on('connect', function() {
    console.log("connected!");
    $('#status').append("Connected to NOMADS server");
  });

  //listen for user joining
  socket.on('auksalaq_user_confirmed', function(data){
    //log.push(data);
   $('#status').append("<li>"+ data.timestamp + ": " + data.username+" has joined Nomads</li>");
   
  });

  //listen for message from the server.
  socket.on('auksalaq_client_update', function(data){
    //log.push(data);
    //oscMessage.sendOSC('/object', data);
   
   $('#status').append("<li>"+data.timestamp + ": " + data.messageText + " from: " + data.username + " located at: " + data.location+"</li>");
  });

});