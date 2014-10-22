/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var socket = io.connect();

  var localUser = {
    id: '',
    name: ''
  }

  var messageToSend = {
    id: '',
    messageText: '',
    location: ''
  }

  // on connection to server
  socket.on('connect', function() {
    //setup user object
      // localUser.message = new Array();
    //socket.emit('newuser', localUser);
  });



  // listen for interactions on the page. (text, locations)
  $('#sender').bind('click', function() {
    localUser.message = { 
      type: 'text',
      value: new Date()
    };
    socket.emit('message', localUser);     
  });

  //listen for message from the server.
  socket.on('user_confirmed', function(data){
   $('#info').html("Username is: "+data);
  });

  //Show Login Div
  $('#login').fadeIn();
  $('#login-form').bind('submit', function(){
    localUser.name = $('#namefield').val();
    localUser.id = "nomads_" + localUser.name + "_" + Math.floor(Math.random()*1000);
    socket.emit('newuser', localUser);
    $('#login').fadeOut();
    return false;
  });

  //send message
  $('#phrase-form').bind('submit', function(){
    messageToSend.messageText = $('#phrasefield').val();
    socket.emit('message', messageToSend);
    $('#phrase-entry').fadeOut();
    return false;
  });

  $('.zone').bind('click', function(){
    messageToSend.location = $(this).attr("data-location");
    $("#phrase-entry").fadeIn();
  });

  
});