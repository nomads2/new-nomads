
//http://stackoverflow.com/questions/14096138/find-the-point-on-a-circle-with-given-center-point-radius-and-degree

int zones = 10;
ArrayList<ParticleSystem> systems;
int rad = 280; //radius of speaker circle
PFont myFont;
ThoughtSystem ts;
PImage[] imgs;
PImage bg;

ArrayList<SpeakerSystem> speakers;

void setup() {
  size(1024, 768, P2D);
  smooth(); 
  noFill();
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
}

void draw() {
  blendMode(ADD); // Additive blending!
  background(0);
  imageMode(CENTER);
  noTint(); //otherwise will fade
  image(bg, width/2, height/2, 587, 587); //bg image

  //displaySpeakerMap();  //show ten circles where speakers are located
  
  for (SpeakerSystem ss: speakers) {
    ss.run(); 
  }

  for (ParticleSystem ps: systems) {
    ps.run();
    //ps.addParticle();
  }

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
  PVector origin = new PVector(0,0);
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
  systems.add(new ParticleSystem(thought, new PVector(psXOrigin, psYOrigin), force, imgs));

  //then add the thought to the screen
  ts.addThought(psXOrigin, psYOrigin, force, thought);
}

/*
* automatically start Processing in fullscreen mode (2.0+)
 */
//boolean sketchFullScreen() {
//  return true;
//}

