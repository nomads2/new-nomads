/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var socket = io.connect();

  var localUser = {
    id: '',
    username: '',
    timestamp: ''
  }

  var messageToSend = {
    id: '',
    username: '',
    time: '',
    messageText: '',
    location: ''
  }

  //Show Login Div
  $('#login').fadeIn();
  $('#login-form').bind('submit', function(){
    localUser.username = messageToSend.username = $('#namefield').val();
    localUser.id = "nomads_" + localUser.username + "_" + Math.floor(Math.random()*1000);
    localUser.timestamp = new Date();
    socket.emit('newuser', localUser);
    $('#login').fadeOut();
    return false;
  });

  $('.zone').bind('click', function(){
    messageToSend.location = $(this).attr("data-location");
    $("#phrase-entry").fadeIn();
  });

  ///////////////////////////////////////////
  //          Socket Communication         //
  ///////////////////////////////////////////

  // on connection to server
  socket.on('connect', function() {

  });

  //listen for message from the server.
  socket.on('user_confirmed', function(data){
   $('#info').html("Username is: "+data.username);
  });

  //send message
  $('#phrase-form').bind('submit', function(){
    messageToSend.messageText = $('#phrasefield').val();
    messageToSend.timestamp = new Date();
    socket.emit('message', messageToSend);
    $('#phrase-entry').fadeOut();
    $('#phrasefield').val('');
    return false;
  });

});