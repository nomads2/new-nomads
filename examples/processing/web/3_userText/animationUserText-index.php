<html>
<head>
<meta charset="utf-8">
 <title>animation 0.0.1</title>
 <script type="text/javascript" src="processing-1.4.8.min.js"></script>
 <script type="text/javascript">
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

      //interaction on page
      function drawThought() {
        var pjs = Processing.getInstanceById(file);
        // var text = document.getElementById('inputtext').value;
        pjs.drawNewThought(); 
      }

      function drawUserThought() {
        var pjs = Processing.getInstanceById(file);
        var uZone = document.getElementById('userZone').value;
        var text = document.getElementById('userThought').value;
        pjs.drawNewUserThought(uZone, text);
      }
  </script>
   </head>
   <body>
      <canvas id="animationUserText" data-processing-sources="animationUserText.pde"></canvas>
      
      <div>Generate random thought: <button type="button" onclick="drawThought()"></button>
      </div>
      <div id="interactivity">
        zone: <span id="zoneID"></span><!-- <input type="textfield" id="zoneID">  -->
      </div>
      <div>
        zone: <!-- <input type="textfield" value="1" id="userZone"> -->
        <select id="userZone">
          <option value="1">Zone 1</option>
          <option value="2">Zone 2</option>
          <option value="3">Zone 3</option>
          <option value="4">Zone 4</option>
          <option value="5">Zone 5</option>
          <option value="6">Zone 6</option>
          <option value="7">Zone 7</option>
          <option value="8">Zone 8</option>
          <option value="9">Zone 9</option>
          <option value="10">Zone 10</option>
        </select>
        thought: <input type="textfield" value="my thought" id="userThought"> <span></span>
        <button id="uT" type="button" onclick="drawUserThought()"></button>
      </div>
    </body>
  </html>