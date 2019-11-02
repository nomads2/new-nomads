/**
 * Test functions for server.
 */

var client;
var startTime=0;
var currentTime=0;

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
    if(data.type!='aukxy'){
      $('#status').append("<li>"+data.timestamp + ": " + data.messageText + " from: " + data.username+"</li>");
    }
  });

  socket.on('clock_update', function(data){
    currentTime = data;
    updateClock();
  });

  $('#chat-mode').click(chatMode);
  $('#xy-mode').click(xyMode);
  $('#thought-mode').click(thoughtMode);
  $('#mute-button').click(muteClientAudio);
  $('#clock-start').click(startStopClock);
  $('#clock-reset').click(resetClock);

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

muteClientAudio = function(e){
  if($('#mute-button').text()=="mute"){
    $('#mute-button').text("unmute");
    client.muteClientAudio("mute");
  }
  else{
    $('#mute-button').text("mute");
    client.muteClientAudio("unmute");
  }

}

startStopClock = function(e){
  if($('#clock-start').text()=="start clock"){
    $('#clock-start').text("stop clock");
    startTime = new Date().getTime();
    currentTime = startTime;
    client.startClock(startTime);
  }else{
    $('#clock-start').text("start clock");
    startTime = 0;
    client.stopClock('stop clock');
  }
}

resetClock = function(e){
  startTime = 0;
  $('#clock-start').text("start clock");
  $('#clock-time').text("0:00");
  client.resetClock();
}

updateClock = function(e){
  if($('#clock-start').text()=="stop clock"){
    time = currentTime - startTime;
    //console.log("current time = "+time);
    s = time/1000;
    m = Math.floor(s/60);
    if(s>59){
      s = Math.floor(s%60);  
    }else{
      s = Math.floor(s);
    }
    
    

    if(s<10){
      $('#clock-time').text(m+":0"+s);
    }else{
      $('#clock-time').text(m+":"+s);
    }
  }
}