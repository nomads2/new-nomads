/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var log = new Array();

  // on connection to server
  socket.on('connect', function() {
    console.log("connected!");
  });

  //listen for user joining
  socket.on('user_confirmed', function(data){
    log.push(data);
   $('#status').append("<li>"+ data.timestamp + ": " + data.username+" has joined Nomads</li>");
   
  });

  //listen for message from the server.
  socket.on('client_update', function(data){
    log.push(data);
    //oscMessage.sendOSC('/object', data);
   
   $('#status').append("<li>"+data.timestamp + ": " + data.messageText + " from: " + data.username + " located at: " + data.location+"</li>");
  });

});