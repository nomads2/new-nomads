/**
 * Nomads Basic Mobile and Desktop Client
 */

var client;
var currentZone;

$(document).ready(function(){
  client = new NomadsMobileClient(initCallback);
  client.geolocate();

  $('#namefield').focus();

  //Listeners

  $('#login-form').submit(login);
  $('.zone').bind('click', zoneSelect);
  $('#phrase-form').submit(submitPhrase);

});

initCallback = function(){
  $('#loader').hide();
}

login = function(e){
  //cancel form submission
  e.preventDefault();

  if($('#namefield').val()==""){
    //must submit phrase
    return;
  }

  client.login($('#namefield').val(), loginComplete);
}

loginComplete = function(){
  $('#login').fadeOut();
}

zoneSelect = function(){
  $("#phrase-entry").fadeIn();
  $('#phrasefield').focus();
  currentZone = $(this).attr("data-location");
  return false;
}

submitPhrase = function(e){
  //cancel form submission
  e.preventDefault();
  if($('#phrasefield').val()==""){
    //must submit phrase
    return;
  }

  client.sendMessage($('#phrasefield').val(), currentZone, 'textMessage');
  $('#phrase-entry').fadeOut();
  $('#phrasefield').val('');
}

// var socket;

// var localUser = {
//   id: '',
//   username: '',
// }

// var messageToSend = {
//   id: '',
//   username: '',
//   timestamp: '',
//   messageText: '',
//   location: '',
//   type: ''
// }

// $(document).ready(function() {   
//   socket = io.connect();

//   NomadsClient.geoLocate();

  //Show Login Div
 // $('#namefield').focus();
 

  ///////////////////////////////////////////
  //          Socket Communication         //
  ///////////////////////////////////////////

  // on connection to server
//   socket.on('connect', function() {

//   });

//   //listen for message from the server.
//   socket.on('user_confirmed', function(data){
//     if(data.username == localUser.username){
//       $('#info').html("Username is: "+data.username);
//     }
//   });

//   //send message
//   $('#phrase-form').bind('submit', function(){
//     messageToSend.messageText = $('#phrasefield').val();
//     messageToSend.timestamp = new Date();
//     messageToSend.type = 'textMessage';
//     socket.emit('message', messageToSend);
//     $('#phrase-entry').fadeOut();
//     $('#phrasefield').val('');
//     return false;
//   });

// });
/*
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
      
  }*/
//}