/**
 * Hit 'r' to randomly trigger a circle from anywhere in the US.
 */

//map library and vars
import de.fhpotsdam.unfolding.*;
import de.fhpotsdam.unfolding.geo.*;
import de.fhpotsdam.unfolding.marker.*;
import de.fhpotsdam.unfolding.utils.*;
import de.fhpotsdam.unfolding.providers.*;
import de.fhpotsdam.unfolding.marker.SimplePointMarker;
import de.fhpotsdam.unfolding.mapdisplay.MapDisplayFactory;
UnfoldingMap map;
UnfoldingMap innerMap;

//OSC library and vars
import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;

//screen modes
int screenMode = 2; //default is 1024x768
//1 = 1024x768, 2=1440x900 (MacBook Pro), 3= 16x9 ratio (1440x810)
int sWidth = 1024;
int sHeight = 768;
float borderX = 0;
float borderY = 0;
float borderWidth = 0;
float borderHeight = 0;

//points
ArrayList circles;
PVector geotag = new PVector();
//misc
PFont font;

//cant use millis() for timing, because this will be on for days!
float frCounter = 0;
int secCounter = 0;
int minCounter = 0;
int hourCounter = 0;
int dayCounter = 0;
String sDay, sHour, sMin;
String runningTime;

void setup() {
  
  setScreenMode(screenMode);
  size(sWidth, sHeight, P2D); //two maps require P2D
  
  circles = new ArrayList();
  smooth();
  font = createFont("Abel", 32);
  textFont(font, 14);
  textAlign(CENTER, CENTER);
  // OSC input port
  oscP5 = new OscP5(this, 6789);
  // OSC output port
  myRemoteLocation = new NetAddress("127.0.0.1", 41236);
  
  //setup the map
  Location centralUS = new Location(37.739f, -90.72466f); //1024x768
  map = new UnfoldingMap(this, "map", 0, 0, width, height);
//  if (screenMode > 1) {
//    centralUS = new Location(37.739f, -90.72466f); //1024x768
//  }
  map.zoomAndPanTo(4, centralUS); //13
  
  Location innerMapCenter = new Location(40.790278f, -73.959722f); //1024x768
  borderX = (sWidth*0.75)-50;
  borderY = (sHeight*0.75)-50;
  borderWidth = width*0.25;
  borderHeight = height*0.25;
  innerMap = new UnfoldingMap(this, "innerMap", borderX, borderY, borderWidth, borderHeight);
  innerMap.zoomAndPanTo(7, innerMapCenter); //11
  
  MapUtils.createDefaultEventDispatcher(this, innerMap, map);
  
  
}

void setScreenMode(int mode) {
 switch(mode) {
    case 1:
      //default mode is 1 (1024x768)
      break;
    case 2:
      //1440x900
      break;
    case 3:
      //1440x810, 16x9 ratio
      break; 
  } 
}

void draw() {
  background(0);
  
  //draw maps
  map.draw(); 
  stroke(5);
  strokeWeight(5);
  int edge = 0;
  rect(borderX-edge, borderY-edge, borderWidth+(edge*2), borderHeight+(edge*2));
  innerMap.draw();
  
  //display points
  for (int i = circles.size()-1; i >= 0; i--) { 
    // An ArrayList doesn't know what it is storing so we have 
    // to cast the object coming out
    Circle c = (Circle) circles.get(i);
    c.display();
    if (c.faded()) {
      circles.remove(i);
    }
  }
  
}


/*
 * incoming OSC messages
 *
 * @author Jon Bellona
 */
void oscEvent(OscMessage theOscMessage) {

  if (theOscMessage.checkAddrPattern("/geolocation")==true) {
    if (theOscMessage.checkTypetag("ff")) {
      // parse theOscMessage and extract the values from the osc message arguments.
      geotag.x = theOscMessage.get(0).floatValue();
      geotag.y = theOscMessage.get(1).floatValue();
      println("lat: " + geotag.x + ", lon: " + geotag.y);
      
      addMapPoint(geotag.x, geotag.y);
    }
  } 
}

void keyPressed() {
  //US coordinates (long, lat, long, lat)
  //coordinates: [-123.398438, 30.216355, -65.869904, 49.168237]
  //LA: -118.491669, 33.584879, -117.807770, 34.168636
  //NYC: -74,40,-73,41
  //SF: -122.75,36.8,-121.75,37.8
  float[] randCoord = {-74,40,-73,41};
  if (key == 'p' || key == 'P') {
    PVector newPoint = new PVector();
    newPoint.x = random(randCoord[1], randCoord[3]);
    newPoint.y = random(randCoord[0], randCoord[2]);
    println("point pos: " + newPoint.x + ", " + newPoint.y);
    addMapPoint(newPoint.x, newPoint.y);
    //addInnerMapPoint(newPoint.x, newPoint.y);
  }
}


/**
 * Add a point to Unfoldingmap and draw a circle
 *
 * @requires Unfoldingmap
 */
void addMapPoint(float x, float y) {
  
  Location location = new Location(x, y);
//  println("location pos: " + location.x + ", " + location.y);
  SimplePointMarker marker = new SimplePointMarker(location);
  ScreenPosition geotagPosition = marker.getScreenPosition(map);
  circles.add(new Circle(geotagPosition.x, geotagPosition.y));
  
  //if possible add to other map
  //create a check of the boundary regions and only add if within bounds.
  Location topLeft = innerMap.getTopLeftBorder();
  Location bottomRight = innerMap.getBottomRightBorder();
//  println("topLeft pos: " + topLeft.x + ", " + topLeft.y);
//  println("bottomRight pos: " + bottomRight.x + ", " + bottomRight.y);
  if ( (location.x < topLeft.x) && (location.y > topLeft.y)) {
    if ( (location.x > bottomRight.x) && (location.y < bottomRight.y)) {
      ScreenPosition geotagPos = innerMap.getScreenPosition(location);
      circles.add(new Circle(geotagPos.x, geotagPos.y));
    }
  }
  
}

void addInnerMapPoint(float x, float y) {
//  Location location = new Location(x, y);
//  SimplePointMarker marker = new SimplePointMarker(location);
//  //ScreenPosition geotagPosition = innerMap.getScreenPosition(location);
//  ScreenPosition geotagPosition = marker.getScreenPosition(innerMap);
////  println("geotagPosition pos: " + geotagPosition.x + ", " + geotagPosition.y);
//  circles.add(new Circle(geotagPosition.x, geotagPosition.y)); 
// 
}


/*
* automatically start Processing in fullscreen mode (2.0+)
*/
boolean sketchFullScreen() {
  return true;
}
