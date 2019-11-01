/**
 * Test functions for server.
 */

var startTime=0;
var currentTime=0;
var started=false;
var client;


$(document).ready(function() {   

  var log = new Array();


  var user = {};
  var socket = io.connect();
  client = new NomadsMobileClient(initCallback, changeClientMode);
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

  socket.on('clock_update', function(data){
    //console.log("update clock "+data)
    currentTime = data;
    updateClock();
  });

  socket.on('clock_reset', function(data){
    startTime = 0;
    console.log("reset clock");
    started=false;
    resetClock();
  });

  socket.on('clock_start', function(data){
    startTime = new Date().getTime();
    console.log("start clock");
    started=true;
    updateClock();
  });

  socket.on('clock_stop', function(data){
    
    console.log("stop clock");
    started=false;
    
  });


});

initCallback = function(){
  
}

changeClientMode = function(e){
  console.log("changing client mode", e);
}

resetClock = function(e){
  startTime = 0;
  $('#clock-time-display').text("0:00");
}

updateClock = function(e){
  if(!started){
    return;
  }
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
    $('#clock-time-display').text(m+":0"+s);
  }else{
    $('#clock-time-display').text(m+":"+s);
  }

}