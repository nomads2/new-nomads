// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

class Thought {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float lifespan;
  String theThought;
  float r = 50;

  ArrayList<Spark> sparks;

  Thought(float x, float y, PVector dir, String t) {
    acceleration = dir.get(); //instead of new PVector();
    //velocity = PVector.random2D();
    velocity = dir.get();
    location = new PVector(x, y);
    lifespan = 255.0;
    theThought = t;
    sparks  = new ArrayList<Spark>();
    addSparks( t.length()*2 ); //25
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
          dir.setMag(0.01); 
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
    lifespan -= 0.5;
  }

  // Method to display
  void display() {
    stroke(0, lifespan);
    strokeWeight(2);
    fill(0.9, lifespan/255);  //rgb mode 1.0
    //ellipse(location.x, location.y, r*2, r*2);
    
    //textSize(r/3*(128/lifespan));
    textSize(r/3*(255/lifespan));
    textLeading(r/3.5*(255/lifespan));
    rectMode(CENTER);
//    text(theThought, location.x, location.y, r*3.4*(128/lifespan), r*5);
    text(theThought, location.x, location.y, (255/lifespan));
    
    iterateListExist();
    pgl.disable( PGL.TEXTURE_2D );
    if( ALLOWTRAILS )
      iterateListRenderTrails();
  }
  
  void iterateListExist(){
    for( Iterator it = sparks.iterator(); it.hasNext(); ){
      Spark s = (Spark) it.next();
      if( !s.ISDEAD ){
        s.exist();
      } else {
        it.remove();
      }
    }
  }
  
  void iterateListRenderTrails(){
    for( Iterator it = sparks.iterator(); it.hasNext(); ){
      Spark s = (Spark) it.next();
      s.renderTrails();
    }
  }
  
  void addSparks( int _amt ){
    
    for( int i=0; i<_amt; i++ ){
      sparks.add( new Spark( new Vec3D(location.x, location.y, 0), new Vec3D(velocity.x, velocity.y, 0) ) );
    }
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

