//PRESS key or click mouse to trigger new text/circle object.

//create Javascript interaction functions with the html page.
interface JavaScript {
  void showZone(int z);
}

//need bind so we can display the Processing sketch in the canvas.
void bindJavascript(JavaScript js) {
  javascript = js;
}
JavaScript javascript;

//global variables
int zones = 10;
ArrayList<ParticleSystem> systems;
int rad = 250; //radius of speaker circle
PFont myFont;
ThoughtSystem ts;
ArrayList<CircleSystem> circles;

void setup() {
 //size(1024, 768);
 size(800,600);
 smooth(); 
 noFill();
 systems = new ArrayList<ParticleSystem>();
 ts = new ThoughtSystem(new PVector(0,0));
 myFont = createFont("Georgia", 32);
 textFont(myFont);
 textAlign(CENTER, TOP); //CENTER doesn't get translated in JS on the page?
// textAlign(CENTER, CENTER); //this is best for Processing offline.
 rectMode(CENTER);
 circles = new ArrayList<CircleSystem>();
}

void draw() {
  background(0);
  displaySpeakerMap();
  
  for (CircleSystem cs: circles) {
    cs.run();
    //ps.addParticle(); 
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
    int zone = int(random(10));
    println(zone);
    if (javascript!=null) {
      javascript.showZone(zone);
    }
    animateZone(zone, message);
  }
}

//called from button on the html page.
void drawNewThought() {
  String message = randMess();
  int zone = int(random(10));
  if (javascript!=null) {
    javascript.showZone(zone);
  }
  animateZone(zone, message);
}

//called from button on the html page.
void drawNewUserThought(String z, String t) {
  animateZone(int(z), t);
//  println(z);
//  println(t); 
}

/**
Draw generic location of speakers on a circle
**/
void displaySpeakerMap() {
  for(int i=0; i<zones; i++) {
    pushMatrix();
    translate(width/2, height/2); //move to center.
    translate( rad*(sin(radians((i*(360/zones))+180))), rad*(cos(radians((i*(360/zones))+180))) );//move to angle location.
    stroke(128);
    strokeWeight(1);
    fill(0);
    ellipse(0,0,10, 10);
    popMatrix(); 
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
  float heading = ((PI/5) * zone); //provides correct heading in radians (0-9).
//  println(zone + ": " + heading);
  // Offset the angle since we have zones set up vertically.
  float angle = heading - PI/2;
  // Polar to cartesian for force vector!
  PVector force = PVector.fromAngle(angle);
  force.mult(0.1);
  force.mult(-2);
  float psXOrigin = (width/2) + (rad*(cos(radians((zone*(360/zones))-90))));
  float psYOrigin = (height/2) + (rad*(sin(radians((zone*(360/zones))-90))));

  systems.add(new ParticleSystem(thought,new PVector(psXOrigin,psYOrigin), force));
  circles.add(new CircleSystem(1, new PVector(psXOrigin,psYOrigin)));
  
  //then add the thought to the screen
  ts.addThought(new PVector(psXOrigin,psYOrigin),force,thought);
}

///////////////////////////////////////////////
////////////////// CIRCLE /////////////////////
///////////////////////////////////////////////

class Circle {
  // Variables.
  float xpos;
  float ypos;
  float fade;
  color c;
  float size;
  float lifespan;

  //construct the circle
  Circle(PVector loc) {
    xpos = loc.x;
    ypos = loc.y;
    fade = 0;
    lifespan = 255;
    c = color(lifespan);
    size = 10;
  }

  //
  void display() {
    noFill();
    stroke(lifespan);
    strokeWeight(size);
    ellipse(xpos, ypos, fade+size, fade+size);
    fade+=2;
    lifespan-=2;
  }
  
  //test if our circle has faded
  boolean isDead() {
    if (fade >= 255) {
      return true;
    } else {
      return false;
    }
  }
}

///////////////////////////////////////////////
////////////// CIRCLE SYSTEM //////////////////
///////////////////////////////////////////////

// A class to describe a group of Circles
// An ArrayList is used to manage the list of Circles 

class CircleSystem {

  ArrayList<Circle> circles;    // An arraylist for all the particles
  PVector origin;        // An origin point for where particles are birthed
  //PVector force;         // The force/direction of the system

  CircleSystem(int num, PVector v) {
    circles = new ArrayList<Circle>();   // Initialize the arraylist
    origin = v.get();                        // Store the origin point
    //force = f;
    for (int i = 0; i < num; i++) {
      circles.add(new Circle(origin));    // Add "num" amount of particles to the arraylist
    }
  }

  void run() {
    for (int i = circles.size()-1; i >= 0; i--) {
      Circle c = circles.get(i);
      c.display();
      if (c.isDead()) {
        circles.remove(i);
      }
    }
  }

  void addCircle(PVector loc) {
    circles.add(new Circle(loc));
  }

  // A method to test if the particle system still has particles
  boolean dead() {
    if (circles.isEmpty()) {
      return true;
    } 
    else {
      return false;
    }
  }
}

///////////////////////////////////////////////
///////////////// PARTICLE ////////////////////
///////////////////////////////////////////////

class Particle {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float lifespan;
  char letter;

  Particle(PVector l, PVector dir, char c) {
    //acceleration = new PVector(0,0.05);
    acceleration = dir.get();
    velocity = new PVector(random(-1,1),random(-2,0));
    location = l.get();
    lifespan = 255.0;
    letter = c;
  }

  void run() {
    update();
    display();
  }

  // Method to update location
  void update() {
    velocity.add(acceleration);
    location.add(velocity);
    lifespan -= 2.0;
  }

  // Method to display
  void display() {
    stroke(0,lifespan);
    strokeWeight(2);
    fill(128,lifespan);
    //ellipse(location.x,location.y,12,12);
    text(letter,location.x,location.y);
  }
  
  // Is the particle still useful?
  boolean isDead() {
    if (lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}

///////////////////////////////////////////////
///////////// PARTICLE SYSTEM /////////////////
///////////////////////////////////////////////

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles 

class ParticleSystem {

  ArrayList<Particle> particles;    // An arraylist for all the particles
  PVector origin;        // An origin point for where particles are birthed
  PVector force;         // The force/direction of the system
  String thought;        // The thought to explode into character particles.

  ParticleSystem(String t, PVector v, PVector f) {
    particles = new ArrayList<Particle>();   // Initialize the arraylist
    origin = v.get();                        // Store the origin point
    force = f;
    thought = t;
    for (int i = 0; i < thought.length()-1; i++) {
      particles.add(new Particle(origin, force, thought.charAt(i)));    // Add "num" amount of particles to the arraylist
    }
  }

  void run() {
    for (int i = particles.size()-1; i >= 0; i--) {
      Particle p = particles.get(i);
      p.run();
      if (p.isDead()) {
        particles.remove(i);
      }
    }
  }

  void addParticle(char c) {
    particles.add(new Particle(origin, force, c));
  }

  // A method to test if the particle system still has particles
  boolean dead() {
    if (particles.isEmpty()) {
      return true;
    } 
    else {
      return false;
    }
  }
}

///////////////////////////////////////////////
////////////////// THOUGHT ////////////////////
///////////////////////////////////////////////

class Thought {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float lifespan;
  String theThought;

  float r = 50;


  Thought(PVector l, PVector dir, String t) {
    acceleration = dir.get(); //instead of new PVector();
    //velocity = PVector.random2D();
    velocity = dir.get();
    location = l.get();
    lifespan = 255.0;
    theThought = t;
  }

  void run() {
    update();
    display();
  }

  void intersects(ArrayList<Thought> thoughts) {
    for (Thought other : thoughts) {
      if (other != this) {
        PVector dir = PVector.sub(location, other.location);
        if (dir.mag() < r*2) {
          dir.setMag(0.2); 
          applyForce(dir);
        }
      }
    }
  }
  
  //bounce against the walls
  void intersectsWall() {
    if ((location.x + r/2 > width) || (location.x - r/2 < 0)) {
      velocity.x = velocity.x * -1;
    }
    if ((location.y + r/2 > height) || (location.y - r/2 < 0)) {
      velocity.y = velocity.y * -1;
    }
  }

  void applyForce(PVector f) {
    acceleration.add(f);
  }

  // Method to update location
  void update() {
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.mult(0);
    lifespan -= 0.3;
  }

  // Method to display
  void display() {
    stroke(0, lifespan);
    strokeWeight(2);
    fill(247, lifespan);
    //ellipse(location.x, location.y, r*2, r*2);
    
    textSize(r/3);
    textLeading(r/3.5);
    //rectMode(CENTER);
    //textAlign(CENTER, CENTER);
    text(theThought, location.x, location.y, r*3, r*5);
  }

  // Is the particle still useful?
  boolean isDead() {
    if (lifespan < 0.0) {
      return true;
    } 
    else {
      return false;
    }
  }
}

///////////////////////////////////////////////
////////////// THOUGHT SYSTEM /////////////////
///////////////////////////////////////////////

class ThoughtSystem {
  ArrayList<Thought> thoughts;

  ThoughtSystem(PVector location) {
    thoughts = new ArrayList<Thought>();
  }

  void addThought(PVector v, PVector f, String m) {
    thoughts.add(new Thought(v, f, m));
  }


  void display() {
    for (Thought t : thoughts) {
      t.display();
    }
  }

  void applyForce(PVector f) {
    for (Thought t : thoughts) {
      t.applyForce(f);
    }
  }

  void intersection() {
    for (Thought t : thoughts) {
      t.intersects(thoughts);
    }
  }
  
  void bounce() {
    for (Thought t : thoughts) {
      t.intersectsWall();
    }
  }


  void update() {
    for (int i = thoughts.size()-1; i >= 0; i--) {
      Thought t = thoughts.get(i);
      t.update();
      if (t.isDead()) {
        thoughts.remove(i);
      }
    }
  }
}

