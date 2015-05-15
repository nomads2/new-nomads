//MAIN computer -- Matthew's visual.

////DESIGN CONTROLS
//import controlP5.*;
//ControlP5 cp5;
//public int pulseslider = 15;
//public int sizeslider = 12;
//public ColorPicker cp;

//EMITTER particles
import toxi.geom.*;
import java.util.*;
PGL pgl;
Vec3D gravity;
boolean ALLOWPERLIN = true;     // add perlin noise flow field vector?
boolean ALLOWTRAILS = true;     // render particle trails?
PImage particleImg;
int counter;

//OSC library and vars
import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;

int zones = 10;
ArrayList<ParticleSystem> systems;
int rad = 280; //radius of speaker circle
PFont myFont;
ThoughtSystem ts;
PImage[] imgs;
PImage bg;

ArrayList<SpeakerSystem> speakers;

void setup() {
  size(1024, 768, P3D);
  smooth(4);
  noFill();

  //  colorMode( RGB, 1.0 ); //openGL uses 0.0 - 1.0 RGB colors
  // More OpenGL necessity.
  pgl         = ((PGraphicsOpenGL) g).pgl; 
  particleImg = loadImage( "particle2.png" ); 

  imgs = new PImage[5];
  imgs[0] = loadImage("corona.png");
  imgs[1] = loadImage("emitter.png");
  imgs[2] = loadImage("particle.png");
  imgs[3] = loadImage("texture.png");
  imgs[4] = loadImage("reflection.png");
  systems = new ArrayList<ParticleSystem>();
  ts = new ThoughtSystem(new PVector(width/2, 50));
  myFont = createFont("Georgia", 32);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  bg  = loadImage( "NewNomads_backgroundImage_simple.png" );
  speakers = new ArrayList<SpeakerSystem>();
  addSpeakers(5);

  //addControlP5(); //DESIGN DATA
  
  oscP5 = new OscP5(this, 6790);                          // OSC input port
  myRemoteLocation = new NetAddress("127.0.0.1", 41236);  // OSC output port
}

void draw() { 

  
  //blendMode(ADD); // Additive blending!
  background(0);
  imageMode(CENTER);
  noTint(); //otherwise will fade
  colorMode( RGB, 255.0 );
  image(bg, width/2, height/2, 587, 587); //bg image

  //show ten circles where speakers are located
  //displaySpeakerMap();  

  //circles around the main speakers
  for (SpeakerSystem ss: speakers) {
    ss.run();
  }
  blendMode(ADD);//return Blend Mode back to ADD
  
  for (ParticleSystem ps: systems) {
    ps.run();
  }

  // Turns on additive blending so we can draw a bunch of glowing images without
  // needing to do any depth testing.
//  perspective( PI/3.0, (float)width/(float)height, 1, 5000 );
  pgl.depthMask(false);
  pgl.enable( PGL.BLEND );
  pgl.blendFunc(PGL.SRC_ALPHA, PGL.ONE);
  colorMode( RGB, 1.0 );
  counter ++;
  
  //display the thoughtSystem
  ts.update();
  ts.intersection();
  ts.bounce();
  ts.display();
}

void keyPressed() {
  if (key == 'z' || key == 'Z') {
    //we will know the zone and text, so fire with these as vars
    String message = randMess();
    animateZone(int(random(10)), message);
  }

  if ( key == 'p' || key == 'P' )
    ALLOWPERLIN  = !ALLOWPERLIN;

  if ( key == 't' || key == 'T' )
    ALLOWTRAILS  = !ALLOWTRAILS;
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
    speakers.add(new SpeakerSystem(7, origin)); //5 circles to each speaker location.
  }
}


String randMess() {
  String[] facts = {
    "It wasn't bliss. What was bliss but the ordinary life?", 
    "That's when she found the tree", 
    "the dark, crabbed branches bearing up such speechless bounty", 
    "It's neither red nor sweet.", 
    "It doesn't melt or turn over, break or harden,", 
    "so it can't feel pain, yearning, regret.", 
    "Now your tongue grows like celery between us", 
    "I was sick, fainting in the smell of teabags"
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
  //applyForce(force);
  force.mult(-1.5);
  float psXOrigin = (width/2) + rad*(sin(radians((zone*(360/zones))+180)));
  float psYOrigin = (height/2) + rad*(cos(radians((zone*(360/zones))+180)));
  //systems.add(new ParticleSystem(thought, new PVector(psXOrigin, psYOrigin), force, imgs));

  //then add the thought to the screen
  ts.addThought(psXOrigin, psYOrigin, force, thought);
}

// This method should be nicer, but it isnt. I use getRads to get a perlin noise
// based angle in radians based on the x and y position of the object asking for it.
// Perlin noise is supposed to give you back a number between 0 and 1, but it wont
// necessarily give you numbers that range from 0 to 1.  A usual result is more like
// .25 to .75.
//
// So the point of this method is to try to normalize the values to a 
// range of 0 to 1.  It's not perfect, and I still get weird results.
// For instance, the mult variable is supposed to be the multiplier for the range.
// So if i wanted a random angle between 0 and TWO_PI, I would set the mult = TWO_PI. 
// But when I do that, I find the Perlin noise tends to give me a left-pointing angle.
// To counteract, I end up setting the mult to 10.0 in order to increase the chances
// that I get a nice range from at least 0 to TWO_PI.
float minNoise = 0.499;
float maxNoise = 0.501;
float getRads(float val1, float val2, float mult, float div) {
  float rads = noise(val1/div, val2/div, counter/div);

  if (rads < minNoise) minNoise = rads;
  if (rads > maxNoise) maxNoise = rads;

  rads -= minNoise;
  rads *= 1.0/(maxNoise - minNoise);

  return rads * mult;
}

void renderImage(PImage img, Vec3D _loc, float _diam, color _col, float _alpha ) {
  pushMatrix();
  translate( _loc.x, _loc.y, _loc.z );
  tint(red(_col), green(_col), blue(_col), _alpha);
  imageMode(CENTER);
  image(img, 0, 0, _diam, _diam);
  popMatrix();
}

/*
* automatically start Processing in fullscreen mode (2.0+)
 */
//boolean sketchFullScreen() {
//  return true;
//}


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
  println(theOscMessage.typetag());
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
      locX = map(locX, 0, 500, 0, width); //500 is graphics width
      locY = map(locY, 0, 500, 0, height); //500 is graphics height
      //add new thought 
      addUserThought(zoneNum, locX, locY, thought);
    }
  }

  // print the address pattern for determing OSC information
  //   println("### received an OSC message.");
     println("Address pattern: " + theOscMessage.addrPattern() + " and Type Tag: " + theOscMessage.typetag());
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
  force.mult(0.05);
  force.mult(-1.5);
  //then add the thought to the screen
  ts.addThought(x, y, force, thought);
}

