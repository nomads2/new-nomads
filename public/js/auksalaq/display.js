/**
 * Test functions for server.
 */

var client;
var mode;
var clientAnimation;
var allClientThoughts = []; //by instantiating this here, users will get a clean slate as they enter the fray. will start populating globally as new messages appear.
var allClientXY = []; //by instantiating this here, users will get a clean slate as they enter the fray. will start populating globally as new messages appear.


$(document).ready(function() {   

  var log = new Array();


  var user = {};
  var socket = io.connect();
  
  //client = new NomadsMobileClient(initCallback, changeClientMode);
  $('#mainui').height(window.innerHeight);
  //$('#mainui').width(window.innerWidth);
  
  var chatLocX = $('#mainui').offset().left;
  $("#chat-log-container").css('left', chatLocX+'px');
  $("#chat-log-container").css('width', $('#mainui').height());
  // setup animation
  clientAnimation = new NomadsMobileClientAnimation();

  // on connection to server
  socket.on('connect', function() {
    console.log("connected!");
    
  });

  socket.on("disconnect", function() {
    
    console.log("reconnecting");
    socket.socket.reconnect();
  });

  //listen for user joining
  socket.on('auksalaq_user_confirmed', function(data){
    
  
  });

  //listen for message from the server.
  socket.on('auksalaq_client_update', function(data){
    console.log("data received ", data);
    if(data.type == 'aukthought'){
      
      //var xLoc = GRAPHICSW - data.messageText.length - (Math.random()*data);
      //var yLoc = Math.random()*200+20;
      allClientThoughts.push({
        "thought":data.messageText, 
        "x":data.x,
        "y":data.y,
        "life":4000,
        "size":12,
        "alpha":1.0,
        "vectorX":data.rX,
        "vectorY":data.rY
      });
    }

    if(data.type == 'aukxy'){
      
      //var xLoc = GRAPHICSW - data.messageText.length - (Math.random()*data);
      //var yLoc = Math.random()*200+20;
      var xyloc = {
        x:data.x,
        y:data.y,
        id:data.id
      };

      // add xy to display, if user already has xy value, update

      var inXY = false;
      for(var i=0; i<allClientXY.length; i++){
        if(allClientXY[i].id==data.id){
          allClientXY[i].x = data.x;
          allClientXY[i].y = data.y;
          inXY=true;
        }
      }
      if(!inXY){
        allClientXY.push(xyloc);
      }
    }

    if(data.type == 'aukchatmessage'){
      console.log('got chat message '+data.messageText);
      if($('chat-log')!=null){
        $('#chat-log').append("<li>"+data.messageText + "</li>");
      
        var dy = $('#chat-log').height() - $('#mainui').height();
        if(dy>0){
          $('#chat-log').css('top',-dy-40+'px');
        }
      }
    }
  });

  socket.on('auksalaq_mode', function(data){
    console.log('mode change to '+data);
    changeClientMode(data);
    //change inteface to new mode
    //initCallback(data);
  });
   
   
});

initCallback = function(){
  
}

chatMode = function(e){
  
  client.changeMode('chatMode');
}

xyMode = function(e){
  
  client.changeMode('xyMode');
}

thoughtMode = function(e){
  
  client.changeMode('thoughtMode');
}

changeClientMode = function(mode){
  this.mode=mode;
  if(mode=='chatMode'){
    clientAnimation.xyOff();

    $('#chat-log').empty();
    $('#chat-log').css('top','0px');
    $('#chat').show();
    $('#chat').fadeTo( "slow" , 1, function() {});
    
  }else if(mode=='xyMode'){
    clientAnimation.xyOn();
    allClientXY = [];
    

    $('#chat').fadeTo( "slow" , 0, function() {
      // Animation complete.
      $('#chat').hide();
    });
    
  }else if(mode=='thoughtMode'){
    clientAnimation.xyOff();
    

    $('#chat').fadeTo( "slow" , 0, function() {
      // Animation complete.
      $('#chat').hide();
    });
    
    
  }
}