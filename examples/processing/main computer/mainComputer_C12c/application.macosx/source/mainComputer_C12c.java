import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import toxi.geom.*; 
import java.util.*; 
import java.awt.Color; 
import oscP5.*; 
import netP5.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class mainComputer_C12c extends PApplet {

//MAIN computer -- Matthew's visual.
//C2 05/05/15
//C10 05/20/15
//update 05/27/15
//C11 06/12/15 -- add sidebar on left to display user thoughts
//C12 02/20/16 -- added boolean to Thought/ThoughtSystem that enables display of thought onto Sidebar.
// C12 adds "poemMessage" type to OSC parsing, which will be Rita's poetry sent from Matthew (via node server)
// C12 we don't use "/poem" OSC message, but we can if we connect Ethernet to Matthew's machine (backup)
// C12b fixed error with fast firing OSC messages
// C12c add dynamic lifesize (more particles decrease lifespan)

//EMITTER particles
 //enables Vec3D Class



int counter;

//OSC library and vars


OscP5 oscP5;
NetAddress myRemoteLocation;

//Values that may be controlled via OSC (as globals via Max)
float thoughtLifespan = 130.0f; //shouldn't be more than 255.0, shouldn't be less than 40.0
String globalText = "";
float thoughtSize = 20.0f;
PVector globalTextPosition = new PVector(0,0); //moves global text on screen

int zones = 10;
int rad = 265;//265; //radius of speaker circle
int canvas = 700; //width+height of canvas
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
//float moveX = 100;
//float moveY = 60;
//float rotX = radians(0);
//float rotY = -0.4;
//float zoomF = 0.82;

///////////////
//Background Noise
///////////////
final int STAGE_WIDTH = 655;
final int STAGE_HEIGHT = 655;
final int NB_PARTICLES = 5000;
final float MAX_PARTICLE_SPEED = 2.5f;
final float PARTICULE_SIZE = 1;
final float MAX_DISTANCE = sqrt(STAGE_WIDTH*STAGE_WIDTH + STAGE_HEIGHT*STAGE_HEIGHT);
 
final float MIN_STEP_NOISE = 0.001f;
final float MAX_STEP_NOISE = 0.004f;//0.01;
final float MIN_SPEED_NOISE = -.03f;
final float MAX_SPEED_NOISE = .03f;
final int MIN_LIFE_TIME = 10;
final int MAX_LIFE_TIME = 40;
 
//'root' of the noise
float noiseX;
float noiseY;
//used to move the noise - or not
float noiseSpeedX;
float noiseSpeedY;
//noise step (the smaller, the better granularity)
float stepNoiseX;
float stepNoiseY;
myVector tabParticles[];//array of particles
 
//picture
final String IMAGE_PATH = "NewNomads_backgroundImage2.png";//"NewNomads_backgroundImage_700px.png";//landscape nature lao
PImage myImage;
int imageW;
int imageH;
int myPixels[];

float coeffColor;
//////////////////////////

public void setup() {
  size(1024, 768, P3D);
  //Color of background
  ((javax.swing.JFrame) frame).getContentPane().setBackground(new Color(74,51,32));
  
  smooth(4);
  noFill();
  
  //systems = new ArrayList<ParticleSystem>();
  ts = new ThoughtSystem(new PVector(width/2, 50));
  myFont = createFont("Gill Sans", 32);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  bg  = loadImage("NewNomads_backgroundImage2.png");//loadImage( "NewNomads_backgroundImage_simple.png" );//loadImage("backgroundImageMay15.png");//
  speakers = new ArrayList<SpeakerSystem>();
  addSpeakers(5);
  
  oscP5 = new OscP5(this, 6790);                          // OSC input port
  myRemoteLocation = new NetAddress("127.0.0.1", 6789);  // OSC output port
  
  initializeImage();
  initializeNoise();
  myImage.updatePixels();
}



//////////////////////////
public void draw() { 

  pushMatrix();
    translate(moveX,moveY,0);
    rotateX(rotX);
    rotateY(rotY);
    scale(zoomF); //user controlled zoom
    
    //setup the background and bg image
    blendMode(BLEND); // default blend mode
    colorMode( RGB, 255.0f );
    background(74,51,32); //RGB is set to 0 - 1.
    imageMode(CENTER);
    noTint(); //otherwise will fade
    colorMode( RGB, 255.0f );
    image(bg, width/2, height/2, 587, 587); //bg image 587 is a happy accident for size of bg image
    
    //displaySpeakerMap(); //show circles where speakers are located  
    displayGlobalText(); //if Matthew wants to have instructions on screen (sent from Max)
  
    pushMatrix();
      translate(0,0,3); //lift eveything above the background
      //circles around the main speakers
      for (SpeakerSystem ss: speakers) {
        ss.run();
      }
      blendMode(ADD);//return Blend Mode back to ADD
      colorMode( RGB, 1.0f ); //openGL uses 0.0 - 1.0 RGB colors
      counter ++;
    popMatrix();
    
      if (ts.getSize() <= 10) {
        thoughtLifespan = 130.0f;
      } else if (ts.getSize() <= 20) {
        thoughtLifespan = 100.0f;
      } else if (ts.getSize() <= 25) {
        thoughtLifespan = 70.0f;
      } else if (ts.getSize() <= 30) {
        thoughtLifespan = 50.0f;
      }
      
      //display the thoughtSystem
      ts.intersection();
      ts.bounce();
      ts.display(); //display on screen and on sidebar
      ts.update();
    
      blendMode(BLEND);
      drawBackground(); //if you place above image(); snow will be more prevalent
      
  popMatrix();
}


///////////// OTHER FUNCTIONS

/*
* Draw background noise (snow particles)
*/
public void drawBackground()
{
  float imageSide = 650;
  pushMatrix();
  translate(width/2, height/2, 1);
  translate( (imageSide/2)*-1, (imageSide/2)*-1, 0); 
  fill(0, 2);
  noStroke();
  //rect(0, 0, imageSide, imageSide);
 
  noiseX += noiseSpeedX;
  noiseY += noiseSpeedY;
  float n;
  float vx;
  float vy;
  for (int i = 0; i < NB_PARTICLES; i++)
  {
    tabParticles[i].prevX = tabParticles[i].x;
    tabParticles[i].prevY = tabParticles[i].y;
 
    n = noise(noiseX+tabParticles[i].x*stepNoiseX, noiseY+tabParticles[i].y*stepNoiseY);
 
    vx = (n-1)*2*cos((n-.6f) * TWO_PI)*MAX_PARTICLE_SPEED;
    vy = (n-1)*2*sin(n * TWO_PI)*MAX_PARTICLE_SPEED;
    vx = constrain(vx, -MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
    vy = constrain(vy, -MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
 
    tabParticles[i].x += vx;
    tabParticles[i].y += vy;
    tabParticles[i].count++;
    if ((tabParticles[i].x < 0) || (tabParticles[i].x > imageW-1) ||
      (tabParticles[i].y < 0) || (tabParticles[i].y > imageH-1) ||
      tabParticles[i].count > MAX_LIFE_TIME)
    {
      float myX = random(imageW-100);
      float myY = random(imageH-100);

      tabParticles[i].x = tabParticles[i].prevX = myX;
      tabParticles[i].y = tabParticles[i].prevY = myY;
      tabParticles[i].count = (int)random(MIN_LIFE_TIME, MAX_LIFE_TIME);
      n = noise(noiseX+myX*stepNoiseX, noiseY+myY*stepNoiseY);
      tabParticles[i].myColor = myPixels[(int)(tabParticles[i].y)*imageW + (int)(tabParticles[i].x)];
    }
    strokeWeight(sqrt(vx*vx + vy*vy)*n*1.5f);
    stroke(tabParticles[i].myColor, 150);
    line(tabParticles[i].prevX, tabParticles[i].prevY, tabParticles[i].x, tabParticles[i].y);
  }
  popMatrix();
}


/**
 * Keyboard Controls
 **/
public void keyPressed() {
  if (key == 'z' || key == 'Z') {
    //we will know the zone and text, so fire with these as vars
    String message = randMess();
    animateZone(PApplet.parseInt(random(10)), message);
  }
  if (key == 'p' || key == 'P') {
    //last ditch effort.  send OSC message to Max to trigger Rita's text from the same machine.
    OscMessage ohShit = new OscMessage("/lastDitch");
    ohShit.add(1);
    oscP5.send(ohShit, myRemoteLocation);
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
        zoomF = 1.0f;
      }
      if (key == 'T') {
        moveX = 100;
        moveY = 60;
        rotY = -0.4f;
        zoomF = 0.82f;
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
      if(zoomF < 0.01f) { 
      zoomF = 0.01f; 
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
public void displaySpeakerMap() {
  for (int i=0; i<zones; i++) {
    pushMatrix();
    translate(width/2, height/2); //move to center.
    translate( rad*(sin(radians((i*(360/zones))))), rad*(cos(radians((i*(360/zones))+180))) );//move to angle location.
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
public void addSpeakers(int numSpeakers) {
  PVector origin = new PVector(0, 0);
  for (int i=0; i<numSpeakers; i++) {
    origin.x = (width/2) + rad*(sin(radians((i*(360/numSpeakers)))));
    origin.y = (height/2) + rad*(cos(radians((i*(360/numSpeakers))+180)));
    speakers.add(new SpeakerSystem(7, origin, 16, color(119,93,39), 1)); //5 circles to each speaker location.
    speakers.add(new SpeakerSystem(4, origin, 3, color(225,172, 50), 2)); //5 circles to each speaker location.
  }
}


/**
 Query and return a random string
 **/
public String randMess() {
  String[] facts = {
"It wasn't bliss. What was bliss but the ordinary life?",
"That's when she found the tree",
"the dark, crabbed branches bearing up such speechless bounty",
"It's neither red nor sweet.",
"It doesn't melt or turn over, break or harden",
"so it can't feel pain",
"prove a theorem",
"expanding",
"windows",
"hover near the ceiling",
"ceiling floats away with a sigh",
"ceiling floats",
"away with a sigh",
"clear walls",
"everything",
"transparency",
"scent of carnations",
"leaves with them",
"I am out in the open",
"when hope withers",
"a reprieve",
"door opens",
"onto a street",
"clean of people, of cars",
"your street",
"you are leaving",
"Reprive has been granted",
"provisionally",
"windows",
"closed behind",
"it\u2019s gray",
"This suitcase, the saddest object in the world",
"the world\u2019s open",
"the sky begins to blush",
"what it took to be a woman in this life",
"hinged windows",
"butterflies",
"sunlight glinting",
"magnets cleared the air",
"that smile",
"your hair, flying silver",
"waving goodbye",
"she was silver, too",
"calling softly",
"choose",
"You turned in the light",
"eyes seeking your name",
"Cut a cane",
"Lean on it",
"Weigh a stone in your hands",
"Watch it",
"Strike the stone",
"thinking",
"of water",
"shutters",
"darkened residences",
"playing",
"hunger shaking",
"hear them sighing and not answer",
"to deny this world",
"no loss and no desire",
"Listen",
"empty yet full",
"silken",
"air",
"refuse to be born",
"you are here",
"suck the good milk in",
"an awkward loveliness",
"a mirror",
"a box in a box",
"Blue is all around",
"an overturned bowl",
"this noise",
"lint",
"filled past caring",
"on the edge of a system",
"small",
"unimaginable",
"cold",
"dark dark",
"no wind",
"no heaven",
"i am not anything",
"slice the air",
"no wind can hold me",
"aperture",
"now i can feel",
"the beginning was the dark",
"moan and creak",
"Thicker then",
"scent of thyme",
"slight hairs",
"We were falling down",
"river, carnal",
"slippage and shadow melt",
"velocity",
"Oh beautiful body",
"where they\u2019ve intersected",
"some point",
"true and unproven",
"between us",
"fainting",
"tree life",
"water",
"dream",
"bliss",
"tell me once again", 
"a single note in time",
"the thing at the edge", 
"outside in the open",
"the woods were dark",
"over the moment",
"more common", 
"the smell of a flower", 
"fly away",
"bring release", 
"forget where",
"happy in the soft daylight",
"profit is finite",
"ask and find the truth",
"sun eye",
"free to open and run",
"shining and perfect",
"go velocity",
"never cold again",
"filled with silence and waiting",
"a garden of thoughts",
"give, stand, wait",
"going for gold",
"wind noise, a sigh",
"dismissed", 
"today and forever",
"windows in rain",
"remind the world", 
"near whistle",
"going",
"saying",
"thick heat",
"the door is cold",
"touch fire",
"every exit",
"heart filled",
"beaten", 
"wanting to fall away",
"a final door", 
"the long return ride",
"paradise",
"yearning, regret."
};
  return facts[PApplet.parseInt(random(facts.length-1))];
}


/**
 Upon OSC receive message, animate particles from the zone location.
 This is a test function!
 **/
public void animateZone(int z, String t) {
  //int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * z) * -1; //provides correct heading in radians (0-9).
  //  println(zone + ": " + heading);
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.05f);
  force.mult(-1.5f);
  //float psXOrigin = (width/2) + rad*(sin(radians((zone*(360/zones))+180)));
  float psXOrigin = (width/2) + (random(0.3f, 1.0f)*rad)*(sin(radians((z*(360/zones)))));
  //subtract random value from X,Y in order to get random location from center and external speaker position
  //float psYOrigin = (height/2) + rad*(cos(radians((zone*(360/zones))+180)));
  float psYOrigin = (height/2) + (random(0.3f, 1.0f)*rad)*(cos(radians((z*(360/zones))+180)));
  //psYOrigin = psYOrigin - (random(0.0, 0.7)*rad)*(sin(radians((zone*(360/zones))+180)));

  //then add the thought to the screen
  ts.addThought(psXOrigin, psYOrigin, force, thought, thoughtLifespan, z, false);
  
//  OscMessage myM = new OscMessage("/object");
//  myM.add("a");
//  myM.add("b");
//  myM.add("c");
//  myM.add(thought);
//  myM.add(z);
//  oscP5.send(myM, myRemoteLocation);
}



/*
* automatically start Processing in fullscreen mode (2.0+)
 */
public boolean sketchFullScreen() {
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
public void oscEvent(OscMessage theOscMessage) {
  println(theOscMessage.typetag());
  if (theOscMessage.checkAddrPattern("/object")==true) {
//    println("message");
    
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
//      println("typetag ok");
      
      //at this point, check message type (whether "textMessage" a user, or "poemMessage" matthew
      if (theOscMessage.get(2).stringValue().equals("poemMessage") == true) {
//        println("poemMessage");
        //once Travis codes this in presentation-server, add in fire
        // parse theOscMessage and extract the values from the osc message arguments.
        String thoughtP = theOscMessage.get(3).stringValue();
        int zoneNumPoem = PApplet.parseInt(0);
        float locXp = (width/2); //theOscMessage.get(7).floatValue();
        float locYp = (height/2) + (random(-50,50)); //theOscMessage.get(8).floatValue();
        //add new thought 
        //addUserThought(zoneNumPoem, locXp, locYp, thought);//thread("addUserThought"); // 
        // Variable for heading! (angle)
        float headingp = ((PI/5) * zoneNumPoem) * -1; //provides correct heading in radians (0-9).
        // Offset the angle since we have zones set up vertically.
        float anglep = headingp - PI/2;
        // Polar to cartesian for force vector!
        PVector forceP = PVector.fromAngle(anglep);
        forceP.mult(0.05f);//0.05random(0.05,0.5)
        forceP.mult(1.25f); //random(1.25,
        ts.addThought(locXp, locYp, forceP, thoughtP, thoughtLifespan, zoneNumPoem, false);
      } else {
        // "textMessage" type.
        // parse theOscMessage and extract the values from the osc message arguments.
        String thought = theOscMessage.get(3).stringValue();
        int zoneNum = PApplet.parseInt(theOscMessage.get(4).floatValue());
        float locX = theOscMessage.get(7).floatValue();
        float locY = theOscMessage.get(8).floatValue();
        locX = locX + ((width/2) - (canvas/2) + 50); //locX + ((width/2) - (canvas/2)); //250 is half of graphic size //map(locX, 0, 600, 0, width); //500 is graphics width
        locY = locY + ((height/2) - (canvas/2) + 50); //locY + ((height/2) - (canvas/2)); //map(locY, 0, 500, 0, height); //500 is graphics height
        //add new thought 
        addUserThought(zoneNum, locX, locY, thought);//thread("addUserThought"); // 
      }
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
  
  if (theOscMessage.checkAddrPattern("/globalTextPosition")==true) {
    if (theOscMessage.checkTypetag("ff")) {
      globalTextPosition.x = theOscMessage.get(0).floatValue();
      globalTextPosition.y = theOscMessage.get(1).floatValue();
      println("globalTextPosition: " + globalTextPosition.x + ", " + globalTextPosition.y);
    }
  }
  
  //receive poetry from Max/MSP
  //see "send-poem-to-processing.maxpat" inside max folder
  if (theOscMessage.checkAddrPattern("/poem")==true) {
    //println("/poem received");
    if (theOscMessage.checkTypetag("si")) {
      //s = thought string
      //f = the zone number.
      String poemLine = theOscMessage.get(0).stringValue();
      int poemZone = theOscMessage.get(1).intValue();
      
      //make up a starting point and direction
      float pHeading = ((PI/5) * poemZone) * -1; //provides correct heading in radians (0-9).
      float pAngle = pHeading - PI/2; // Offset the angle since we have zones set up vertically.
      PVector pForce = PVector.fromAngle(pAngle); // Polar to cartesian for force vector!
      pForce.mult(0.05f);
      pForce.mult(-1.5f);
      float pXOrigin = (width/2) + (random(0.3f, 1.0f)*rad)*(sin(radians((poemZone*(360/zones)))));
      float pYOrigin = (height/2) + (random(0.3f, 1.0f)*rad)*(cos(radians((poemZone*(360/zones))+180)));

      //then add the thought to the screen
      ts.addThought(pXOrigin, pYOrigin, pForce, poemLine, thoughtLifespan, poemZone, false);

    }
  }
  
  // print the address pattern for determing OSC information
//     println("### received an OSC message.");
//     println("Address pattern: " + theOscMessage.addrPattern() + " and Type Tag: " + theOscMessage.typetag());
  //
}


/**
 Upon receive message, animate particles from the zone location.
 **/
public void addUserThought(int z, float x, float y, String t) {
  //int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * z) * -1; //provides correct heading in radians (0-9).
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.25f);//0.05
  force.mult(-1.5f);
  //then add the thought to the screen
  ts.addThought(x, y, force, thought, thoughtLifespan, z, false);
}


/**
 Show text that presenter sets via OSC message. Use as a primer for audience.
 **/
public void displayGlobalText() {
  fill(255);
  rectMode(CORNERS);
  textAlign(LEFT, TOP);
  textSize(32);
  pushMatrix();
    translate(globalTextPosition.x, globalTextPosition.y, 5);
    text(globalText, 0, 20, 400, 200);
  popMatrix();
}





///////////////NOISE BACKGROUND

public void initializeImage()
{
  myImage = loadImage(IMAGE_PATH);
  imageW = myImage.width;
  imageH = myImage.height;
  myPixels = new int[imageW * imageH];
  myImage.loadPixels();
  myPixels = myImage.pixels;
  myImage.updatePixels();
}
 
public void initializeNoise()
{
  int myX;
  int myY;
  noiseX = random(123456);
  noiseY = random(123456);
  noiseSpeedX = random(MIN_SPEED_NOISE, MAX_SPEED_NOISE);
  noiseSpeedY = random(MIN_SPEED_NOISE, MAX_SPEED_NOISE);
  stepNoiseX = random(MIN_STEP_NOISE, MAX_STEP_NOISE);
  stepNoiseY = random(MIN_STEP_NOISE, MAX_STEP_NOISE);
  tabParticles = new myVector[NB_PARTICLES];
  for (int i = 0; i < NB_PARTICLES; i++)
  {
    myX = (int)random(imageW);
    myY = (int)random(imageH);
    tabParticles[i] = new myVector(myX, myY);
    tabParticles[i].prevX = tabParticles[i].x;
    tabParticles[i].prevY = tabParticles[i].y;
    tabParticles[i].count = (int)random(MIN_LIFE_TIME, MAX_LIFE_TIME);
    tabParticles[i].myColor = myPixels[(int)(tabParticles[i].y)*imageW + (int)(tabParticles[i].x)];
  }
}

class myVector extends PVector
{
  myVector (float p_x, float p_y)
  {
    super(p_x, p_y);
  }
  float prevX;
  float prevY;
  int count;
  int myColor;
}

//When a thought is triggered, a SoundWave animation (ArrayList)
//emits from the respective speaker on screen

class SoundWave {
  boolean ISDEAD;    // kill when age is reached
  float age;         // current age
  int lifeSpan;      // maximum age
  //Vec3D[] loc;       // array of waves
  Vec3D startLoc;    // position
  Vec3D vel;         // velocity
  float radius;      // growth of circle arc
  float agePer;      // range from 1.0 (birth) to 0.0 (death)
  int zone;          // starting zone (on speaker or in between two speakers)
  int c;
  int r;
  PVector swLoc;
    
  
  Vec3D acceleration;
  Vec3D velo;
  
  SoundWave( Vec3D _lo, Vec3D _vel, int _zonenum, int _radOffset ) {
    radius  = 5;// 50; random(30, 85);
    startLoc = new Vec3D( _lo ); //_loc.add( new Vec3D().randomVector().scaleSelf( random(5.0) ) )
    vel = new Vec3D( _vel.scale( 3 ) );  //scale up speed  20, 40  random ( 5.0, 10.0)
    //vel = new Vec3D( _vel.scale( .5 ).addSelf( new Vec3D().randomVector().scaleSelf( random( 10.0 ) ) ) );
    age = 0;
    lifeSpan = 60;//75 lower shorter lifespan
    zone = _zonenum;
    c = color(1,1,0.7f);//color(0.6156862745098, 0.47450980392157, 0.17647058823529); //157, 121, 45
    r = _radOffset;
    swLoc = new PVector(0,0);
    swLoc.x = (width/2) + rad*(sin(radians((zone*(360/zones))))); //number of speakers and rad are global
    swLoc.y = (height/2) + rad*(cos(radians((zone*(360/zones))+180)));
  }
  
  public void exist() {
    setPosition();
    render();
    setAge();
  }
  
  public void setPosition() {
    startLoc.addSelf( vel );  
  }
  
  public void render() {
    blendMode(BLEND);
    stroke(c, agePer);
    strokeWeight(1);
    noFill();
//    float percentage = ((float)(zone)) / ((float)(zones)); //have to cast as floats to not get 0
//    float angle = PI+HALF_PI-(TWO_PI*percentage);//starting location point
//    angle = angle+HALF_PI+QUARTER_PI; //rotate angle to match inner circle
//    float arcX = angle; //zones is global (10)  PI+HALF_PI+
//    float arcY = angle+HALF_PI; //+ HALF_PI;//+QUARTER_PI; //arc is HALF_PI long
    //arc(startLoc.x, startLoc.y, radius, radius, arcX, arcY);
    
    
    ellipse(swLoc.x, swLoc.y, radius+r, radius+r);
  }
  
  public void setAge() {
    age++;
    radius+=4;//how big the circles grow
    if(age >= lifeSpan) {
      ISDEAD = true;
    } else {
      agePer = 1.0f - age/(float)lifeSpan;
    }
  }
  
}
// Speaker as a Moving Circle

class Speaker {
  PVector loc;
  float lifespan;
  float fade;
  int c1;
  int c2;
  float size;
  int num;
  float pul;
  float amt;
  float amtStatic = 0.01f;
  int mode;
    //png colors
  //inner ven dark (119,93,39)
  //outer ven light (157, 121, 45)
  //ouside ven ligth (225,172, 50)

  Speaker(PVector l, int n, int s, int c, int m) {
    loc = l.get();
    lifespan = 255.0f;
    num = n;               //speaker number
    c1 = c; //color(119,93,39); //color(228,174,50);  134,96,94
    c2 = color(92,84,36); //color(157,121,45);
    fade = 0;
    size = s; //15
    pul = random(1.5f,2.5f); //random number for pulsing the size
    amt = random(0.0f,0.9f);
    mode = m; //display mode SCREEN = 1, BLEND = 2;
  }

  public void run() {
    update();
    display();
  }

  // Method to update location
  public void update() {
    //lifespan -= 2.0;
    amt+=amtStatic;
    fade+=0.01f;
    if(amt >= 1.0f){
      amtStatic *= -1; 
    } else if (amt <= 0.0f) {
      amtStatic *= -1;
    }
  }

  // Method to display
  public void display() {
    switch(mode) {  //SCREEN also is good, BLEND is default
      case 1: blendMode(ADD); break; //SCREEN
      case 2: blendMode(BLEND); break; //BLEND
    }
    int cL = lerpColor(c1, c2, amt);
    fill(cL, 255/num); //numerator makes it lighter or darker
    noStroke();
    float pulse = sin(fade*(num/pul))*6;  //6
    //spheres take too much CPU
//    pushMatrix();
//    stroke(cL, 255/num);
//    translate(loc.x, loc.y,0);
//    sphere(pulse*num);
//    popMatrix(); 
    ellipse(loc.x, loc.y, pulse+size*num, pulse+size*num);
  }
  
  // Is the particle still useful?
  public boolean isDead() {
    if (lifespan < 0.0f) {
      return true;
    } else {
      return false;
    }
  }
}


// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class SpeakerSystem {
  ArrayList<Speaker> speakers;
  PVector origin;

  SpeakerSystem(int num, PVector loc, int size, int c, int m) {
    origin = loc.get();
    speakers = new ArrayList<Speaker>();
    for (int i = 1; i <= num; i++) {
      speakers.add(new Speaker(origin, i, size, c, m)); // Add "num" amount of particles to the arraylist
    }
  }

  public void run() {
    pushMatrix();
    for (int i = speakers.size()-1; i >= 0; i--) {
      translate(0,0,2); //elevate each speaker up by 1 z value.
      Speaker s = speakers.get(i);
      s.run();
      if (s.isDead()) {
        speakers.remove(i);
      }
    }
    popMatrix();
  }
}

// Simple Particle System -- THOUGHT CLOUD

class Thought {
  Vec3D location;
  Vec3D velocity;
  Vec3D acceleration;
  Vec3D swV;// = new Vec3D(velocity.x, velocity.y, 0);
  float lifespan;
  String theThought;
  float r = 50;
  int zone;
  int lineC;
  boolean showSidebar;
  //thoughtLifespan is Global

  ArrayList<SoundWave> soundwaves;

  Thought(float x, float y, PVector dir, String t, float l, int z, boolean s) {
    acceleration = new Vec3D(0.025f, 0.025f, 0.1f);//dir.get(); //instead of new PVector();
    //velocity = PVector.random2D();
    velocity = new Vec3D(dir.x, dir.y, 1.5f);//dir.get();
    location = new Vec3D(x,y,10);//new PVector(x, y);
    swV = new Vec3D(velocity.x, velocity.y, 0);
    lifespan = l;
    theThought = t;
    zone = z;
    soundwaves  = new ArrayList<SoundWave>();
    addSoundWaves( 3, z ); //number and zone
    lineC = color(0, 0.2f);
    showSidebar = s;
  }

  //this could still be an issue for Java error???
  public void intersects(ArrayList<Thought> thoughts) {
    for (Thought other : thoughts) {
      if (other != this) {
        Vec3D dir = location.sub(other.location);
        if (dir.magnitude() < r*1.5f) {
          dir.normalizeTo(0.01f);   //0.02 is too fast
          applyForce3D(dir);
        }
      }
    }
  }
  
  //bounce against the walls
  public void intersectsWall() {
    if ((location.x + r/2 > width) || (location.x - r/2 < 0)) {
      velocity.x = velocity.x * -1;
    }
    if ((location.y + r/2 > height) || (location.y - r/2 < 0)) {
      velocity.y = velocity.y * -1;
    }
    if ((location.z < 0)) {
      velocity.z = velocity.z * -1;
    }
  }

  public void applyForce3D(Vec3D f) {
    acceleration.addSelf(f); 
  }

  // Method to update location
  public void update() {
    velocity.addSelf(acceleration);
    //location.addSelf(velocity.x, velocity.y, pow((thoughtLifespan/lifespan),3));
    location.addSelf(velocity);//pow((thoughtLifespan/lifespan),0.5));
    acceleration.scaleSelf(0);
    lifespan -= 0.5f;
  }

  // Method to display
  public void display() {
    blendMode(BLEND);
    iterateWaveExist(); //draw wave before text
    
    //
    stroke(0, lifespan);
    strokeWeight(2);
    colorMode(RGB, 255.0f);
    fill(255,231,210, (lifespan/thoughtLifespan)*255);  //rgb mode 1.0
   
    textSize(thoughtSize); //thoughtSize is Global, default 20.0
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    pushMatrix();
      translate(0,0,15); //eleveate text above speakers. +pow((thoughtLifespan/lifespan),3)
      text(theThought, location.x, location.y, location.z);
    popMatrix();
    colorMode(RGB, 1.0f);
  }
  
  //display thoughts as shifting left column sidebar
  public void displayAsSidebar(int index) {
    //set up text 
    colorMode(RGB, 255.0f);
    fill(255,238,97, 200);
    textSize(thoughtSize-2);
    textLeading(thoughtSize-4);
    rectMode(CORNER);
    textAlign(LEFT);
    pushMatrix();
      translate(0,10,15); //eleveate text above speakers. 
      translate(25, index*40, 0);
      text(theThought, 0, 0, 200, 40);
    popMatrix();
    colorMode(RGB, 1.0f); //reset colormode
  }
  
  public void iterateWaveExist(){
//    for( Iterator it = soundwaves.iterator(); it.hasNext(); ){
//      SoundWave s = (SoundWave) it.next();
//      if( !s.ISDEAD ){
//        s.exist();
//      } else {
//        it.remove();
//      }
//    }
    
    for (int i = soundwaves.size()-1; i >= 0; i--) {
      SoundWave s = (SoundWave) soundwaves.get(i);
      s.exist();
      if (s.ISDEAD) {
        soundwaves.remove(i);
      }
    }
  }
  
  public boolean canShowSidebar(){
    return showSidebar; 
  }
  
  public float x() {
    return location.x; 
  }
  public float y() {
    return location.y; 
  }
  public float z() {
    return location.z; 
  }
  public float lifespan() {
    return lifespan; 
  }
  
  //draw lines between text (within a certain distance) //2D
  public void displayLines(ArrayList<Thought> thoughts){
    blendMode(BLEND);
    for (int i = 0; i < thoughts.size(); i++) {
      Thought ti = thoughts.get(i);
      
      for (int c = i+1; c < thoughts.size(); c++) {  
        Thought tc = thoughts.get(c);
   
        float d = sq(tc.x() - ti.x()) + sq(tc.y() - ti.y()) + sq(tc.z() - ti.z());
        if( d < pow(1500,2)  ) {
          strokeWeight(1);
          //stroke(lineC, map(d, 0.0, pow(1500,2), 1.0, 0.1) ); //rgb mode is 1.0
          stroke(lineC, pow((ti.lifespan()/thoughtLifespan), 3)); //alpha of line determined by lifespan (ti better than tc)
          line(tc.x(),tc.y(),tc.z(),ti.x(),ti.y(),ti.z());
        }
      }
    }
    blendMode(ADD);
  }
  
  
  public void addSoundWaves( int _amt, int _zonen ){
    PVector speakerLoc = new PVector(0,0);
    speakerLoc.x = (width/2) + rad*(sin(radians((_zonen*(360/zones))))); //number of speakers and rad are global
    speakerLoc.y = (height/2) + rad*(cos(radians((_zonen*(360/zones))+180)));
    int dist = 25;
     
    
    for( int i=0; i<_amt; i++ ){
      //waveOffset.x = (i*dist)*(sin(radians((_zone*(360/zones)))));
      //waveOffset.y = (i*dist)*(cos(radians((_zone*(360/zones))+180)));
      //instead of location.x,y (the text location), use the speaker location as starting point for soundwave (based upon zone)
      //soundwaves.add( new SoundWave( new Vec3D(speakerLoc.x+waveOffset.x, speakerLoc.y+waveOffset.y, 0), new Vec3D(velocity.x*-1, velocity.y*-1, 0), _zone, i*dist ) );
      //new SoundWave( new Vec3D(speakerLoc.x, speakerLoc.y, 0), 
      soundwaves.add( new SoundWave( new Vec3D(speakerLoc.x, speakerLoc.y, 0), swV, _zonen, i*dist) );
      //soundwaves.add( new SoundWave( new Vec3D(speakerLoc.x+waveOffset.x, speakerLoc.y, 0), new Vec3D(velocity.x*-1, velocity.y*-1, 0), _zone, i*dist ) );
    }
  }

  // Is the thought still useful?
  public boolean isDead() {
    if (lifespan < 0.0f) {
      return true;
    } 
    else {
      return false;
    }
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class ThoughtSystem {
  ArrayList<Thought> thoughts;

  ThoughtSystem(PVector location) {
    thoughts = new ArrayList<Thought>();
  }

  public void addThought(float x, float y, PVector f, String m, float l, int z, boolean s) {
    //x y position, zone, message, lifespan, zone
    thoughts.add(new Thought(x, y, f, m, l, z, s));
  }


  public void display() {
    for (int i = thoughts.size()-1; i>=0; i--) {
      Thought t = (Thought) thoughts.get(i); 
      t.displayLines(thoughts);
      t.display();
    }
    
    //this method is inefficient? or causes Java to throw java.lang.RuntimeException: java.util.ConcurrentModificationException
//    int i = 0;
//    for (Thought t : thoughts) {
//      t.displayLines(thoughts); //connect lines btw. thoughts 
//      t.display(); //draw text on top of lines
//      if (t.canShowSidebar()) {
//        t.displayAsSidebar(i); //display thoughts as running sidebar - left column
//      }
//      i+=1;
//    }
  }

  public void applyForce(Vec3D f) {
    for (Thought t : thoughts) {
      t.applyForce3D(f);
    }
  }

  public void intersection() {
    for (Thought t : thoughts) {
      t.intersects(thoughts);
    }
  }
  
  public void bounce() {
    for (Thought t : thoughts) {
      t.intersectsWall();
    }
  }


  public void update() {
    for (int i = thoughts.size()-1; i >= 0; i--) {
      Thought t = (Thought) thoughts.get(i);
      t.update();
      if (t.isDead()) {
        thoughts.remove(i);
      }
    }
  }
  
  public int getSize() {
    return thoughts.size();
  }
}

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "--full-screen", "--bgcolor=#4A3320", "--hide-stop", "mainComputer_C12c" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
