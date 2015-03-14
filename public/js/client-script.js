/**
 * Nomads Basic Mobile and Desktop Client
 */

ANIMATION_OFFSET = 50;

INTERFACE_CIRCLE_RAD = 110;
INTERFACE_CIRCLE0_X = 250 + ANIMATION_OFFSET;
INTERFACE_CIRCLE0_Y = 129 + ANIMATION_OFFSET;
INTERFACE_CIRCLE1_X = 370 + ANIMATION_OFFSET;
INTERFACE_CIRCLE1_Y = 215 + ANIMATION_OFFSET;
INTERFACE_CIRCLE2_X = 330 + ANIMATION_OFFSET;
INTERFACE_CIRCLE2_Y = 360 + ANIMATION_OFFSET;
INTERFACE_CIRCLE3_X = 176 + ANIMATION_OFFSET;
INTERFACE_CIRCLE3_Y = 375 + ANIMATION_OFFSET;
INTERFACE_CIRCLE4_X = 134 + ANIMATION_OFFSET;
INTERFACE_CIRCLE4_Y = 215 + ANIMATION_OFFSET;

GRAPHICS_W = 500;
GRAPHICS_H = 500;

var client;
var currentZone;
var currentX;
var currentY;
var canvas;
var context;
var clientAnimation;
var x, y;

$(document).ready(function(){
  client = new NomadsMobileClient(initCallback);

  client.geolocate();

  $('#namefield').focus();
  canvas = document.getElementById('mainui');
 
  // setup animation
  clientAnimation = new NomadsMobileClientAnimation();
  
  $('#enter_phrase').prop('disabled', true);
  $('#cancel_phrase').prop('disabled', true);
  $('#phrasefield').prop('disabled', true);

  //Listeners

  $('#login-form').submit(login);

  $('#phrase-form').submit(submitPhrase);
  $('#cancel_phrase').click(cancelPhrase);

  canvas.addEventListener('mousedown', zoneClick);

  //Load sounds
  $('.sounds').load();

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

  x = currentX = evt.clientX - rect.left;
  y = currentY = evt.clientY - rect.top;

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
  $('#enter_phrase').prop('disabled', false);
  $('#cancel_phrase').prop('disabled', false);
  $('#phrasefield').prop('disabled', false);
  $('#phrasefield').focus();
  
  
  currentZone = cz;//$(this).attr("data-location");
  return false;
}

submitPhrase = function(e){
  //cancel form submission
  e.preventDefault();
  var text = $('#phrasefield').val();
  if(text==""){
    //must submit phrase
    //tell the user to submit something?
    return;
  }

  client.sendMessage(text, currentZone, 'textMessage');
  
  //error with this function. won't play anything else below
  //clientAnimation.sendMessage();
  //console.log("x: " + x + ".  y: " + y);
  //console.log(text);
  //clientAnimation.animateMessage(text, x, y);

  $('#phrasefield').val('');
  //Play sound
  var i = Math.floor(Math.random()*14);
  console.log("playing sound "+i);
  $('#sound'+i)[0].play();
  $('#enter_phrase').prop('disabled', true);
  $('#cancel_phrase').prop('disabled', true);
  $('#phrasefield').prop('disabled', true);

  //jump user screen back up to top of page.
  //$("body, html").scrollTop($("#mainui").offset().top);
  $("body, html").animate({ 
    scrollTop: $("#mainui").offset().top 
  }, 600);
}

cancelPhrase = function(e){
  //cancel form submission
  $('#enter_phrase').prop('disabled', true);
  $('#cancel_phrase').prop('disabled', true);
  $('#phrasefield').prop('disabled', true);
  $('#phrasefield').val('');

  //jump user back to top after cancel.
  $("body, html").animate({ 
    scrollTop: $("#mainui").offset().top 
  }, 600);
}
