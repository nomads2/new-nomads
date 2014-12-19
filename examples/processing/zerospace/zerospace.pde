/**
 * @author Jon Bellona
 * @url http://jpbellona.com
 */

//fact vars
Timer timer;
int factChoice = 0;
//facts to show
String[] facts = {
  "It wasn't bliss. What was bliss but the ordinary life?", 
  "That's when she found the tree, the dark, crabbed branches bearing up such speechless bounty", 
  "It's neither red nor sweet. It doesn't melt or turn over, break or harden, so it can't feel pain, yearning, regret.", 
  "Now your tongue grows like celery between us", 
  "I was sick, fainting in the smell of teabags"
};
boolean canShowFacts = false;

ArrayList plates;
ArrayList thoughtList;
PFont font;
String tmpText;
float globalFade = 0;
float globalTweak = 0;
boolean endVisual = false;
boolean canStart = true; //default to true for testing

//Globe sphere vars
PVector change2D = new PVector(0, 0);
float grower = 0;
float iRadius = 100;

//OSC library and vars
import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;



void setup() {
  size(1024, 768, P3D);
  frameRate(40);
  smooth();
  background(0);
  noStroke();
  rectMode(CENTER);
  font = createFont("Abel", 32);
  textFont(font, 16);
  plates = new ArrayList();
  thoughtList = new ArrayList();

  // OSC input port
  oscP5 = new OscP5(this, 6790);
  // OSC output port
  myRemoteLocation = new NetAddress("127.0.0.1", 41736);

  //used for duration of showing facts/poetry lines
  timer = new Timer(30000); //length of time is 30 seconds.
}



void draw() {
  
  if (canStart) { //hit 'S' on keyboard to start piece
    pushGlobe();
    drawPlates(); 
    popGlobe();
  
    //also show tweets as running sidebar that shows as left column
    displayThoughtList();
  
    //show fact and change once a minute.
    if (canShowFacts) { //hit 'F' on keyboard to show facts
      displayFact(factChoice);
      if (timer.isFinished()) {
        factChoice++;
        if (factChoice > facts.length-1) {
          factChoice = 0;
        }
        timer.start();
      }
    }
  }
}


/**
 * globe events that happen before drawing the inner core plates.
 */
void pushGlobe() {
  pushMatrix();
  iRadius = width/2;
  grower += .1;
  rectMode(CENTER);
  background(0);
  translate(width*0.65, height/2.6);
  //Additional globe Rotation
  rotateY(radians((change2D.x)));
  rotateX(radians((-change2D.y)));
}

/**
 * globe events that happen after drawing the inner core plates.
 */
void popGlobe() {
  change2D.x = sin(float(frameCount)/144)*100;
  change2D.y = sin(float(frameCount)/245)*60;
  popMatrix();
}


/**
 * Display plates around the globe (as plates with tweet text)
 */
void drawPlates() {
  for (int i = plates.size()-1; i >= 0; i--) { 
    // An ArrayList doesn't know what it is storing so we have 
    // to cast the object coming out
    Plate p = (Plate) plates.get(i);
    p.display();
    if (p.faded()) {
      plates.remove(i);
    }
  }
}

/**
 * Display tweet text as list in left hand column
 */
void displayThoughtList() {
  for (int i = thoughtList.size()-1; i >= 0; i--) { 
    // An ArrayList doesn't know what it is storing so we have 
    // to cast the object coming out
    Thought t = (Thought) thoughtList.get(i);
    pushMatrix();
    translate(25, i*(t.getSize()*1.5));
    t.display();
    popMatrix();

    if (t.faded()) {
      thoughtList.remove(i);
    }
  }
}

/**
 * Display a fact as text upon the screen
 * @url https://www.rainn.org/statistics
 */
void displayFact(int choice) {
  float offsetX = 420;
  float offsetY = 620;
  int paddingX = 15;
  int paddingY = 15;

  pushMatrix();
  fill(247, 247);
  textSize(25);
  textLeading(22);
  rectMode(CORNER);
  translate(offsetX, offsetY);
  text(facts[choice], 0, 0, width-offsetX-paddingX, height-offsetY-paddingY);
  popMatrix();
}


/**
 * Add a plate upon keypress
 */
void keyPressed() {
  if (key == 'p' || key == 'P') {
    String testTxt = "thought text here";
    plates.add(new Plate(int(random(0, 15)), testTxt));
    thoughtList.add(new Thought(testTxt));
  }
  if (key == 'F') { 
    //start showing facts
    canShowFacts = true;
    factChoice = 0;
    timer.start();
  }
  if (key == 'G') { 
    //stop showing facts
    canShowFacts = false;
  }
  if (key == 'S') { 
    //start showing facts
    canStart = true;
  }
  if (key == 'E') {
    //fade out the work.
    globalFade = 0.5; 
    endVisual = true;
    canShowFacts = false;
  }
  if (key == 'R') {
    //reset the work
    globalFade = 0; 
    endVisual = false;
    canShowFacts = false;
    canStart = false;
  }
  //tweak fade rate if A LOT of tweets in a short period.
  if (keyCode == UP) {
    globalTweak += 0.01;
    println(globalTweak);
  }
  if (keyCode == DOWN) {
    globalTweak -= 0.01;
    println(globalTweak);
  }
}

/*
 * Parse incoming OSC messages
 */
void oscEvent(OscMessage theOscMessage) {

  println(theOscMessage.typetag());
  
  if(canStart) { //hit 'S' on keyboard to accept messages.
//    if (theOscMessage.checkAddrPattern("/no_geolocation")==true) {
//      if (theOscMessage.checkTypetag("s")) {
//        // parse theOscMessage and extract the values from the osc message arguments.
//        tmpText = theOscMessage.get(0).stringValue();
//  
//        if (!endVisual) { //only allow new objects if we aren't ending the work...
//          plates.add(new Plate(int(random(0, 15)), tmpText));
//          thoughtList.add(new Thought(tmpText));
//        }
//        println("thought text: " + tmpText);
//        println();
//      }
//    }
    
    if (theOscMessage.checkAddrPattern("/object")==true) {
      if (theOscMessage.checkTypetag("ssssfffs")) {
        // parse theOscMessage and extract the values from the osc message arguments.
        tmpText = theOscMessage.get(3).stringValue(); //last 's' is the message
  
        if (!endVisual) { //only allow new objects if we aren't ending the work...
          plates.add(new Plate(int(random(0, 15)), tmpText));
          thoughtList.add(new Thought(tmpText));
        }
        println("thought text: " + tmpText);
        println();
      }
    }
  }
}

/*
* automatically start Processing in fullscreen mode (2.0+)
 */
boolean sketchFullScreen() {
  return false;
}

