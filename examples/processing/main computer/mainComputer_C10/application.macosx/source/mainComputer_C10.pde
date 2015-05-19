//MAIN computer -- Matthew's visual.
//C2 05/05/15

//EMITTER particles
import toxi.geom.*; //enables Vec3D Class
import java.util.*;
import java.awt.Color;

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
//Background as Noise
///////////////
final int STAGE_WIDTH = 655;
final int STAGE_HEIGHT = 655;
final int NB_PARTICLES = 5000;
final float MAX_PARTICLE_SPEED = 2.5;
final float PARTICULE_SIZE = 1;
final float MAX_DISTANCE = sqrt(STAGE_WIDTH*STAGE_WIDTH + STAGE_HEIGHT*STAGE_HEIGHT);
 
final float MIN_STEP_NOISE = 0.001;
final float MAX_STEP_NOISE = 0.004;//0.01;
final float MIN_SPEED_NOISE = -.03;
final float MAX_SPEED_NOISE = .03;
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
color myPixels[];

float coeffColor;
//////////////////////////

void setup() {
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


void draw() { 

  pushMatrix();
    translate(moveX,moveY,0);
    rotateX(rotX);
    rotateY(rotY);
    scale(zoomF); //user controlled zoom
    
    //setup the background
    blendMode(BLEND); // default blend mode
    colorMode( RGB, 255.0 );
    background(74,51,32); //RGB is set to 0 - 1.
    imageMode(CENTER);
    noTint(); //otherwise will fade
    colorMode( RGB, 255.0 );
    
    
    image(bg, width/2, height/2, 587, 587); //bg image 587 is a happy accident for size of bg image
    
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
    popMatrix();
      //display the thoughtSystem
      ts.update();
      ts.intersection();
      ts.bounce();
      ts.display();
    
    
    blendMode(BLEND);
    drawBackground(); //if you place above image(); snow will be more prevalent
  popMatrix();
}

void drawBackground()
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
 
    vx = (n-1)*2*cos((n-.6) * TWO_PI)*MAX_PARTICLE_SPEED;
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
    strokeWeight(sqrt(vx*vx + vy*vy)*n*1.5);
    stroke(tabParticles[i].myColor, 150);
    line(tabParticles[i].prevX, tabParticles[i].prevY, tabParticles[i].x, tabParticles[i].y);
  }
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
        zoomF = 0.82;
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
void addSpeakers(int numSpeakers) {
  PVector origin = new PVector(0, 0);
  for (int i=0; i<numSpeakers; i++) {
    origin.x = (width/2) + rad*(sin(radians((i*(360/numSpeakers)))));
    origin.y = (height/2) + rad*(cos(radians((i*(360/numSpeakers))+180)));
    speakers.add(new SpeakerSystem(7, origin, 16, color(119,93,39), 1)); //5 circles to each speaker location.
    speakers.add(new SpeakerSystem(4, origin, 3, color(225,172, 50), 2)); //5 circles to each speaker location.
  }
}

String randMess() {
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
"it’s gray",
"This suitcase, the saddest object in the world",
"the world’s open",
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
"where they’ve intersected",
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
  return facts[int(random(facts.length-1))];
}


/**
 Upon receive message, animate particles from the zone location.
 **/
void animateZone(int z, String t) {
  //int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * z) * -1; //provides correct heading in radians (0-9).
  //  println(zone + ": " + heading);
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.05);
  force.mult(-1.5);
  //float psXOrigin = (width/2) + rad*(sin(radians((zone*(360/zones))+180)));
  float psXOrigin = (width/2) + (random(0.3, 1.0)*rad)*(sin(radians((z*(360/zones)))));
  //subtract random value from X,Y in order to get random location from center and external speaker position
  //float psYOrigin = (height/2) + rad*(cos(radians((zone*(360/zones))+180)));
  float psYOrigin = (height/2) + (random(0.3, 1.0)*rad)*(cos(radians((z*(360/zones))+180)));
  //psYOrigin = psYOrigin - (random(0.0, 0.7)*rad)*(sin(radians((zone*(360/zones))+180)));

  //then add the thought to the screen
  ts.addThought(psXOrigin, psYOrigin, force, thought, thoughtLifespan, z);
  
  OscMessage myM = new OscMessage("/object");
  myM.add("a");
  myM.add("b");
  myM.add("c");
  myM.add(thought);
  myM.add(z);
  oscP5.send(myM, myRemoteLocation);
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
      locX = locX + ((width/2) - (canvas/2)); //250 is half of graphic size //map(locX, 0, 500, 0, width); //500 is graphics width
      locY = locY + ((height/2) - (canvas/2)); //map(locY, 0, 500, 0, height); //500 is graphics height
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
  
  if (theOscMessage.checkAddrPattern("/globalTextPosition")==true) {
    if (theOscMessage.checkTypetag("ff")) {
      globalTextPosition.x = theOscMessage.get(0).floatValue();
      globalTextPosition.y = theOscMessage.get(1).floatValue();
      println("globalTextPosition: " + globalTextPosition.x + ", " + globalTextPosition.y);
    }
  }
  
//  if (theOscMessage.checkAddrPattern("/color")==true) {
//    if (theOscMessage.checkTypetag("fff")) {
//      textcolor[0] = theOscMessage.get(0).floatValue();
//      globalTextPosition.y = theOscMessage.get(1).floatValue();
//      println("globalTextPosition: " + globalTextPosition.x + ", " + globalTextPosition.y);
//    }
//  }
  
//  if (theOscMessage.checkAddrPattern("/addText")==true) {
//    if (theOscMessage.checkTypetag("s")) {
//      String message = randMess();
//      animateZone(int(random(10)), message);
//    }
//  }
  
  
  

  // print the address pattern for determing OSC information
  //   println("### received an OSC message.");
     //println("Address pattern: " + theOscMessage.addrPattern() + " and Type Tag: " + theOscMessage.typetag());
  //
}


/**
 Upon receive message, animate particles from the zone location.
 **/
void addUserThought(int z, float x, float y, String t) {
  //int zone = z; //values 0-9, current zone to fire from
  String thought = t; //thought cloud text
  // Variable for heading! (angle)
  float heading = ((PI/5) * z) * -1; //provides correct heading in radians (0-9).
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.25);//0.05
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
  pushMatrix();
    translate(globalTextPosition.x, globalTextPosition.y, 5);
    text(globalText, 0, 20, 400, 200);
  popMatrix();
}





///////////////NOISE BACKGROUND

void initializeImage()
{
  myImage = loadImage(IMAGE_PATH);
  imageW = myImage.width;
  imageH = myImage.height;
  myPixels = new color[imageW * imageH];
  myImage.loadPixels();
  myPixels = myImage.pixels;
  myImage.updatePixels();
}
 
void initializeNoise()
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
  color myColor;
}

