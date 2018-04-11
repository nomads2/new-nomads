/**
 * Nomads Basic Mobile and Desktop Client
 */

ANIMATION_OFFSET = 50;


var client;

var currentX;
var currentY;
var canvas;
var context;
var clientAnimation;
var x, y;
var allClientThoughts = []; //by instantiating this here, users will get a clean slate as they enter the fray. will start populating globally as new messages appear.
var mode = "chatMode";
var xyTimer;
var soundTimer;

var muted = false;
var xyMoving = false;
var debug = false;

$(document).ready(function(){
  if(debug){
    $('#debug').show();
    $('#debug').append('Debug text here<br/>');
  }
  //$('#control').width(window.innerWidth);
  client = new NomadsMobileClient(initCallback, changeClientMode);

  //client.geolocate();
  initCallback();

  //$('#namefield').focus();
  canvas = document.getElementById('mainui');

  // setup animation
  clientAnimation = new NomadsMobileClientAnimation();
  
  /*
    setup wordcloud
  */
  //hide entry div until user selects a zone.
  $("#phrase-entry").hide();
  $('#enter_phrase').prop('disabled', true);
  $('#cancel_phrase').prop('disabled', true);
  $('#phrasefield').prop('disabled', true);
  
  $("#chat").hide();
  $('#enter_chat').prop('disabled', true);
  $('#cancel_chat').prop('disabled', true);
  $('#chat_messge').prop('disabled', true);
  

  //listeners
  $('#phrase-form').submit(submitPhrase);

  /*
    setup chat
  */

  $('#chat-form').submit(submitChat);

  //hide chat div 
  $("#chat").hide();
  $('#enter_chat').prop('disabled', true);
  $('#cancel_chat').prop('disabled', true);
  $('#chat_message').prop('disabled', true);

  
  //canvas.addEventListener('mousedown', startXY);
  //canvas.addEventListener('mouseup', stopXY);
  /*canvas.addEventListener('mousemove', function(evt){
    currentX = evt.clientX;
    currentY = evt.clientY;
  });
*/
  $('#mainui').on('tapstart', startXY);
  $('#mainui').on('tapend', stopXY);
  $('#mainui').on('tapmove', function(evt, touch){
    if(window.innerWidth<421){
      currentX = (touch.offset.x/320)*500;
    
      currentY = (touch.offset.y/320)*500;
    }else{
      currentX = touch.offset.x;
      currentY = touch.offset.y;
    }
    
    if(xyMoving){
      clientAnimation.xyMove(currentX, currentY);
    }
  });

  $('#login-form').submit(login);

  //Load sounds
  $('.sounds').load();
  $("html, body").animate({ scrollTop: 0 }, "slow");

});

startXY = function(e){
  xyClick();
  xyMoving = true;
  if(debug){
    $('#debug').append(currentX+' '+currentY+'<br/>');
  }
}

stopXY = function(e){
  xyMoving = false;
  clearTimeout(xyTimer);
}

xyClick = function(){
  
  if(mode!='xyMode'){
    return;
  }
  var rect = canvas.getBoundingClientRect();

  //x = currentX - rect.left;
  //y = currentY - rect.top;

  x = currentX;
  y = currentY;
  console.log('xy stuff '+x+' '+y);
  client.sendMessage('xy', 'aukxy', x, y);  
  xyTimer = setTimeout(xyClick, 100);

  //$(window).scrollTop($(document).height());
  //$("#instruction").hide();
  //console.log("mouse down "+x + ' ' + y);
}

changeClientMode = function(mode){
  this.mode=mode;
  if(mode=='chatMode'){
    clientAnimation.xyOff();
    $('#chat-log').empty();
    $('#chat-log').css('top','0px');
    $('#chat-log').val('Enter your discussion message');
    $('#xy-instruction').hide();
    
    $('#enter_chat').prop('disabled', false);
    $('#chat_message').prop('disabled', false);
    $('#phrase-entry').hide();
    $('#chat').show();
    
    
    clearTimeout(xyTimer);
  }else if(mode=='xyMode'){

    clientAnimation.xyOn();
    $('#chat').hide();
    $('#phrase-entry').hide();
    $('#xy-instruction').show();
   
    
    
  }else if(mode=='thoughtMode'){
    clientAnimation.xyOff();
    $('#phrase-entry').show();  
    // Animation complete.
    $('#xy-instruction').hide();
    
    
    $('#chat').hide();
    
    
    $('#enter_phrase').prop('disabled', false);
    $('#phrasefield').prop('disabled', false);
   
    clearTimeout(xyTimer);
  }
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
  //while(!client.loggedIn){
    
  //}
  $("#namefield").blur();
  $('#login').fadeOut();
  var time = Math.random()*6000+4000;
  playSound();
  soundTimer = setTimeout(playSound, time);
  
}

initCallback = function(){
  $('#loader').hide();
  
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

  if(profanityCheck(text)){
    //$("#phrasefield").blur();
    $("#phrasefield").val("");

    $("body, html").animate({ 
      scrollTop: $("#mainui").offset().top 
    }, 600, function() {
    // Animation complete.
      
    });
    return;
  }
  x = random()*350+20;
  y = random()*350+20;
  client.sendMessage(text, 'aukthought', x, y);
  
  $('#phrasefield').val('');
  
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
  }, 600, function() {
    // Animation complete.
    $("#phrase-entry").hide();
  });
}

submitChat = function(e){
  e.preventDefault();
  console.log('sending chat ' + $('#chat_message').val());
  
  var text = $('#chat_message').val();
  if(text==""){
    //must submit phrase
    //tell the user to submit something?
    return;
  }

  if(profanityCheck(text)){
    
    $("#chat_message").val("");

    $("body, html").animate({ 
      scrollTop: $("#mainui").offset().top 
    }, 600, function() {
    // Animation complete.
      
    });
    return;
  }

  client.sendMessage(text, 'aukchatmessage', 0, 0);
  
  //error with this function. won't play anything else below. doesn't exist?
  //clientAnimation.sendMessage();
  
  
  $('#chat_message').val('');
  
  
  //jump user screen back up to top of page.
  //$("body, html").scrollTop($("#mainui").offset().top);
  $("body, html").animate({ 
    scrollTop: $("#mainui").offset().top 
  }, 600, function() {
    // Animation complete.
    });
}

cancelChat = function(e){
  //cancel form submission
  $('#enter_chat').prop('disabled', true);
  $('#cancel_chat').prop('disabled', true);
  $('#chat_message').prop('disabled', true);
  $('#chat_message').val('');

  //jump user back to top after cancel.
  $("body, html").animate({ 
    scrollTop: $("#mainui").offset().top 
  }, 600, function() {
    // Animation complete.
    $("#chat").hide();
  });
}

playSound = function(){
  clearTimeout(soundTimer);

  if(muted){
    return;
  }
  
  console.log('stopping all sounds');
  for(var s = 0; s<10; s++){
    var sound = $('#sound'+s)[0];
    sound.pause();
    sound.currentTime = 0;
  }
  var i = Math.floor(Math.random()*10);
  
  console.log("playing sound "+i);
  $('#sound'+i)[0].play();
  var time = Math.random()*6000+4000;
  soundTimer = setTimeout(playSound, time);
}

profanityCheck = function(text){
  var testText = text.toLowerCase();

  for(var i=0;i<profanityArray.length;i++){
    if(testText.indexOf(profanityArray[i])>-1){
      console.log("No Profanity!");
      return true;
    }
  }
  return false;
}