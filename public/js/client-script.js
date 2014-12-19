/**
 * Nomads Basic Mobile and Desktop Client
 */

INTERFACE_CIRCLE_RAD = 131;
INTERFACE_CIRCLE0_X = 298;
INTERFACE_CIRCLE0_Y = 156;
INTERFACE_CIRCLE1_X = 430;
INTERFACE_CIRCLE1_Y = 249;
INTERFACE_CIRCLE2_X = 380;
INTERFACE_CIRCLE2_Y = 408;
INTERFACE_CIRCLE3_X = 212;
INTERFACE_CIRCLE3_Y = 411;
INTERFACE_CIRCLE4_X = 155;
INTERFACE_CIRCLE4_Y = 250;

var client;
var currentZone;
var canvas;
var context;

$(document).ready(function(){
  client = new NomadsMobileClient(initCallback);
  client.geolocate();

  $('#namefield').focus();

  //setup interaction area
  canvas = document.getElementById('mainui');
  context = canvas.getContext('2d');
  var background = document.getElementById('background');  
  context.drawImage(background, 0, 0);



  //Listeners

  $('#login-form').submit(login);
  //$('.zone').bind('click', zoneSelect);

  $('#phrase-form').submit(submitPhrase);
  canvas.addEventListener('mousedown', zoneClick);

});

pointInCircle = function (center_x, center_y, radius, x, y){
  var dist = (center_x - x)*(center_x - x) + (center_y - y)*(center_y - y);
  if(dist < radius*radius){
    return true;
  }else{
    return false;
  }
}

zoneClick = function(evt){
  var rect = canvas.getBoundingClientRect();

  var x = evt.clientX - rect.left;
  var y = evt.clientY - rect.top;

  //tests!
  if(pointInCircle(INTERFACE_CIRCLE0_X, INTERFACE_CIRCLE0_Y, INTERFACE_CIRCLE_RAD, x, y)){
    //circle 0
    if(pointInCircle(INTERFACE_CIRCLE4_X, INTERFACE_CIRCLE4_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 9");
      zoneSelect(9);
    }else
    if(pointInCircle(INTERFACE_CIRCLE1_X, INTERFACE_CIRCLE1_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 1");
      zoneSelect(1);
    }else{
      console.log("zone 0");
      zoneSelect(0);
    } 
  }else
  if(pointInCircle(INTERFACE_CIRCLE1_X, INTERFACE_CIRCLE1_Y, INTERFACE_CIRCLE_RAD, x, y)){
    //circle 1
    if(pointInCircle(INTERFACE_CIRCLE0_X, INTERFACE_CIRCLE0_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 1");
      zoneSelect(1);
    }else
    if(pointInCircle(INTERFACE_CIRCLE2_X, INTERFACE_CIRCLE2_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 3");
      zoneSelect(3);
    }else{
      console.log("zone 2");
      zoneSelect(2);
    }
  }else
  if(pointInCircle(INTERFACE_CIRCLE2_X, INTERFACE_CIRCLE2_Y, INTERFACE_CIRCLE_RAD, x, y)){
    //circle 2
    if(pointInCircle(INTERFACE_CIRCLE1_X, INTERFACE_CIRCLE1_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 3");
      zoneSelect(3);
    }else
    if(pointInCircle(INTERFACE_CIRCLE3_X, INTERFACE_CIRCLE3_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 5");
      zoneSelect(5);
    }else{
      console.log("zone 4");
      zoneSelect(4);
    }  
  }else
  if(pointInCircle(INTERFACE_CIRCLE3_X, INTERFACE_CIRCLE3_Y, INTERFACE_CIRCLE_RAD, x, y)){
    //circle 3
    if(pointInCircle(INTERFACE_CIRCLE2_X, INTERFACE_CIRCLE2_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 5");
      zoneSelect(5);
    }else
    if(pointInCircle(INTERFACE_CIRCLE4_X, INTERFACE_CIRCLE4_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 7")
      zoneSelect(7);
    }else{
      console.log("zone 6");
      zoneSelect(6);
    }
  }else
  if(pointInCircle(INTERFACE_CIRCLE4_X, INTERFACE_CIRCLE4_Y, INTERFACE_CIRCLE_RAD, x, y)){
    //circle 4
    if(pointInCircle(INTERFACE_CIRCLE3_X, INTERFACE_CIRCLE3_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 7");
      zoneSelect(7);
    }else
    if(pointInCircle(INTERFACE_CIRCLE0_X, INTERFACE_CIRCLE0_Y, INTERFACE_CIRCLE_RAD, x, y)){
      console.log("zone 9");
      zoneSelect(9);
    }else{
      console.log("zone 8");
      zoneSelect(8);
    }
  }

  
  console.log("mouse down "+x + ' ' + y);
}

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

zoneSelect = function(cz){
  $("#phrase-entry").fadeIn();
  $('#phrasefield').focus();
  currentZone = cz;//$(this).attr("data-location");
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
