//needs to come after processing-min has been installed.

var bound = false;
var file = 'animationUserText';

//bind JS to Processing so we can interact with the sketch.
function bindJavascript() {
 var pjs = Processing.getInstanceById(file);
  if(pjs!=null) {
    pjs.bindJavascript(this);
    bound = true; }
  if(!bound) setTimeout(bindJavascript, 250);
}
bindJavascript();

//function located in the Processing sketch
function showZone(zone) {
  document.getElementById('zoneID').innerHTML = zone; 
  //.value is for textfield .innerHTML is for span
}
//mouse x,y inside processing. fire when mouse clicked
//function promptyEntry(mx,my){
  //canvasPDE = document.getElementById('animationUserText');
  // var e = jQuery.Event( "mousedown", { clientX: mx, clientY: my } );
  // jQuery('#animationUserText').trigger( e );
//}
$(document).ready(function(){
  canvasPDE = document.getElementById('animationUserText');
  canvasPDE.addEventListener('mousedown', zoneClickPDE);
});

//interaction on page
function drawThought() {
  var pjs = Processing.getInstanceById(file);
  // var text = document.getElementById('inputtext').value;
  pjs.drawNewThought(); 
}

function drawUserThought() {
  // var pjs = Processing.getInstanceById(file);
  // var uZone = document.getElementById('userZone').value;
  // var text = document.getElementById('userThought').value;
  // pjs.drawNewUserThought(uZone, text);
}