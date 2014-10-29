/**
 * Nomads Basic Mobile and Desktop Client
 */

// Global Namespace
var NomadsClient = NomadsClient || {};

var socket;

var localUser = {
  id: '',
  username: '',
}

var messageToSend = {
  id: '',
  username: '',
  timestamp: '',
  messageText: '',
  location: '',
  type: ''
}

$(document).ready(function() {   
  socket = io.connect();

  NomadsClient.geoLocate();

  //Show Login Div
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

NomadsClient.geoLocate = function(){
  if(geoPosition.init()){  // Geolocation Initialisation
              geoPosition.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true});
  }else{
    // You cannot use Geolocation in this device
    console.log("Geolocation is not available");
  }

  // p : geolocation object
  function success_callback(p){
    localUser.latitude = parseFloat(p.coords.latitude);
    localUser.longitude = parseFloat(p.coords.longitude);
    console.log("Lat/Long = " + localUser.latitude + " " + localUser.longitude);

    // Send User Long/Lat
    var messageToSend = new Object();
    messageToSend.id = localUser.id;
    messageToSend.username = localUser.username;
    messageToSend.timestamp = new Date();
    socket.emit('userGeo', messageToSend);
  }

  function error_callback(p){
      // p.message : error message
      console.log("Geolocation is not available");
      
  }
}