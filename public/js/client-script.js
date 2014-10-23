/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var socket = io.connect();

  var localUser = {
    id: '',
    username: ''
  }

  var messageToSend = {
    id: '',
    username: '',
    timestamp: '',
    messageText: '',
    location: '',
    type: ''
  }

  //Show Login Div
  $('#login').fadeIn();
  $('#namefield').focus();

  $('#login-form').bind('submit', function(){
    localUser.username = messageToSend.username = $('#namefield').val();
    localUser.id = "nomads_" + localUser.username + "_" + Math.floor(Math.random()*1000);
    messageToSend.timestamp = new Date();
    messageToSend.type = 'newUser';
    messageToSend.location = '';
    socket.emit('newuser', messageToSend);
    $('#login').fadeOut();
    return false;
  });

  $('.zone').bind('click', function(){
    messageToSend.location = $(this).attr("data-location");
    $("#phrase-entry").fadeIn();
    $('#phrasefield').focus();
  });

  ///////////////////////////////////////////
  //          Socket Communication         //
  ///////////////////////////////////////////

  // on connection to server
  socket.on('connect', function() {

  });

  //listen for message from the server.
  socket.on('user_confirmed', function(data){
    if(data.username == localUser.username){
      $('#info').html("Username is: "+data.username);
    }
  });

  //send message
  $('#phrase-form').bind('submit', function(){
    messageToSend.messageText = $('#phrasefield').val();
    messageToSend.timestamp = new Date();
    messageToSend.type = 'textMessage';
    socket.emit('message', messageToSend);
    $('#phrase-entry').fadeOut();
    $('#phrasefield').val('');
    return false;
  });

});