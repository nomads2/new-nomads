//MAIN computer -- Matthew's visual.
//C2 05/05/15

//EMITTER particles
import toxi.geom.*; //enables Vec3D Class
import java.util.*;
int counter;

//OSC library and vars
import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;

//Values that may be controlled via OSC (as globals via Max)
float thoughtLifespan = 130.0; //shouldn't be more than 255.0
String globalText = "";
float thoughtSize = 20.0;

int zones = 10;
int rad = 265; //radius of speaker circle
PFont myFont;
ThoughtSystem ts;
PImage bg;

ArrayList<SpeakerSystem> speakers;

//zoom
float zoomF =1.0f;
float rotX = radians(0);
float rotY = radians(0);
float moveX = 0;
float moveY = 0;

void setup() {
  size(1024, 768, P3D);
  smooth(4);
  noFill();

  //systems = new ArrayList<ParticleSystem>();
  ts = new ThoughtSystem(new PVector(width/2, 50));
  myFont = createFont("Gill Sans", 32);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  bg  = loadImage( "NewNomads_backgroundImage_simple.png" );
  speakers = new ArrayList<SpeakerSystem>();
  addSpeakers(5);
  
  oscP5 = new OscP5(this, 6790);                          // OSC input port
  myRemoteLocation = new NetAddress("127.0.0.1", 41236);  // OSC output port
}

void draw() { 

  pushMatrix();
    translate(moveX,moveY,0);
    rotateX(rotX);
    rotateY(rotY);
    scale(zoomF); //user controlled zoom
    
    //setup the background
    blendMode(BLEND); // default blend mode
    background(0.8); //RGB is set to 0 - 1.
    imageMode(CENTER);
    noTint(); //otherwise will fade
    colorMode( RGB, 255.0 );
    image(bg, width/2, height/2, 587, 587); //bg image
    
    //show circles where speakers are located
    //displaySpeakerMap();  
    displayGlobalText();
  
    pushMatrix();
      translate(0,0,3); //lift eveything above the background
      //circles around the main speakers
      for (SpeakerSystem ss: speakers) {
        ss.run();
      }
      blendMode(ADD);//return Blend Mode back to ADD
      colorMode( RGB, 1.0 ); //openGL uses 0.0 - 1.0 RGB colors
      counter ++;
      
      //display the thoughtSystem
      ts.update();
      ts.intersection();
      ts.bounce();
      ts.display();
    popMatrix();
  popMatrix();
}

void keyPressed() {
  if (key == 'z' || key == 'Z') {
    //we will know the zone and text, so fire with these as vars
    String message = randMess();
    animateZone(int(random(10)), message);
  }
  if(keyEvent.isShiftDown()) {
      if (key == 'J') {
        moveX -= 10; 
        println("moveX: " + moveX);
      }
      if (key == 'L') {
        moveX += 10; 
        println("moveX: " + moveX);
      }
      if (key == 'I') {
        moveY += 10; 
        println("moveY: " + moveY);
      }
      if (key == 'K') {
        moveY -= 10; 
        println("moveY: " + moveY);
      }
      if (key == 'R') {
        moveX = 0;
        moveY = 0;
        rotY = radians(0);
        rotX = radians(0);
        zoomF = 1.0;
      }
      if (key == 'T') {
        moveX = 100;
        moveY = 60;
        rotY = -0.4;
        zoomF = 0.78;
      }
  }
  
  switch(keyCode)
  {
  case LEFT:
    rotY += 0.1f;
    println("rotY: " + rotY);
    break;
  case RIGHT:
    // zoom out
    rotY -= 0.1f;
    println("rotY: " + rotY);
    break;
  case UP:
    if(keyEvent.isShiftDown()) { 
      zoomF += 0.02f; 
      println("zoomF: " + zoomF);
    }
    else { 
      rotX += 0.1f; 
      println("rotX: " + rotX); 
    }
    break;
  case DOWN:
    if(keyEvent.isShiftDown()) {
      zoomF -= 0.02f;
      println("zoomF: " + zoomF);
      if(zoomF < 0.01) { 
      zoomF = 0.01; 
    }
    } else {
      rotX -= 0.1f; 
      println("rotX: " + rotX);
    }
    break;
  }
}

/**
 Draw generic location of speakers on a circle
 **/
void displaySpeakerMap() {
  for (int i=0; i<zones; i++) {
    pushMatrix();
    translate(width/2, height/2); //move to center.
    translate( rad*(sin(radians((i*(360/zones))+180))), rad*(cos(radians((i*(360/zones))+180))) );//move to angle location.
    stroke(255);
    strokeWeight(1);
    fill(0);
    ellipse(0, 0, 10, 10);
    popMatrix();
  }
}



/**
 Add a system of circles by the speaker locations.
 **/
void addSpeakers(int numSpeakers) {
  PVector origin = new PVector(0, 0);
  for (int i=0; i<numSpeakers; i++) {
    origin.x = (width/2) + rad*(sin(radians((i*(360/numSpeakers))+180)));
    origin.y = (height/2) + rad*(cos(radians((i*(360/numSpeakers))+180)));
    speakers.add(new SpeakerSystem(7, origin, 16, color(119,93,39), 1)); //5 circles to each speaker location.
    speakers.add(new SpeakerSystem(4, origin, 3, color(225,172, 50), 1)); //5 circles to each speaker location.
  }
}


String randMess() {
  String[] facts = {
    "It wasn't bliss. What was bliss but the ordinary life?", 
    "That's when she found the tree", 
    "the dark, crabbed branches bearing up such speechless bounty", 
    "It's neither red nor sweet.", 
    "It doesn't melt or turn over, break or harden,", 
    "so it can't feel pain", 
    "Now your tongue grows like celery between us", 
    "fainting in the smell of teabags",
    "tree life",
    "I was sick",
    "water",
    "dream",
    "bliss",
    "yearning, regret."
  };
  return facts[int(random(facts.length-1))];
}


/**
 Upon receive message, animate particles from the zone location.
 **/
void animateZone(int z, String t) {
  int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * zone) * -1; //provides correct heading in radians (0-9).
  //  println(zone + ": " + heading);
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.05);
  force.mult(-1.5);
  float psXOrigin = (width/2) + rad*(sin(radians((zone*(360/zones))+180)));
  float psYOrigin = (height/2) + rad*(cos(radians((zone*(360/zones))+180)));

  //then add the thought to the screen
  ts.addThought(psXOrigin, psYOrigin, force, thought, thoughtLifespan, zone);
}



/*
* automatically start Processing in fullscreen mode (2.0+)
 */
boolean sketchFullScreen() {
  return true;
}


/////////////////////////////////////////
////////////////// OSC //////////////////
/////////////////////////////////////////

/*
 * parse incoming OSC messages
 *
 * @author Jon Bellona
 * @since simpleopenni 0.26
 */
void oscEvent(OscMessage theOscMessage) {
  //println(theOscMessage.typetag());
  if (theOscMessage.checkAddrPattern("/object")==true) {

    //typetag contains 
    //s: user ID
    //s: username
    //s: message type
    //s: text message!
    //f: zone number!
    //f: latitude of user server
    //f: longitude of user server
    //f: x position of mouseclick
    //f: y position of mouseclick
    //s: timestamp (date) 
    if (theOscMessage.checkTypetag("ssssfffffs")) {
      // parse theOscMessage and extract the values from the osc message arguments.
      String thought = theOscMessage.get(3).stringValue();
      int zoneNum = int(theOscMessage.get(4).floatValue());
      float locX = theOscMessage.get(7).floatValue();
      float locY = theOscMessage.get(8).floatValue();
      locX = locX + ((width/2) - 250); //250 is half of graphic size //map(locX, 0, 500, 0, width); //500 is graphics width
      locY = locY + ((width/2) - 250); //map(locY, 0, 500, 0, height); //500 is graphics height
      //add new thought 
      addUserThought(zoneNum, locX, locY, thought);//thread("addUserThought"); //
    }
  }
  
  //GLOBAL controls set by author -- control functions made in Max/MSP
  if (theOscMessage.checkAddrPattern("/thoughtLifespan")==true) {
    if (theOscMessage.checkTypetag("f")) {
      thoughtLifespan = theOscMessage.get(0).floatValue();
      println("thoughtLifespan: " + thoughtLifespan);
    }
  }
  
  if (theOscMessage.checkAddrPattern("/globalText")==true) {
    if (theOscMessage.checkTypetag("s")) {
      globalText = theOscMessage.get(0).stringValue();
      println("globalText: " + globalText);
    }
  }
  
  if (theOscMessage.checkAddrPattern("/thoughtSize")==true) {
    if (theOscMessage.checkTypetag("f")) {
      thoughtSize = theOscMessage.get(0).floatValue();
      println("thoughtSize: " + thoughtSize);
    }
  }
  
  
  

  // print the address pattern for determing OSC information
  //   println("### received an OSC message.");
     //println("Address pattern: " + theOscMessage.addrPattern() + " and Type Tag: " + theOscMessage.typetag());
  //
}


/**
 Upon receive message, animate particles from the zone location.
 **/
void addUserThought(int z, float x, float y, String t) {
  int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * zone) * -1; //provides correct heading in radians (0-9).
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(10);//0.05
  force.mult(-1.5);
  //then add the thought to the screen
  ts.addThought(x, y, force, thought, thoughtLifespan, z);
}

/**
 Show text that presenter sets via OSC message. Use as a primer for audience.
 **/
void displayGlobalText() {
  fill(255);
  rectMode(CORNERS);
  textAlign(LEFT, TOP);
  textSize(32);
  text(globalText, 0, 20, 400, 200);
}
