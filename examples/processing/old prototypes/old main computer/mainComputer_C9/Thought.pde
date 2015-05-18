// Simple Particle System -- THOUGHT CLOUD

class Thought {
  Vec3D location;
  Vec3D velocity;
  Vec3D acceleration;
  float lifespan;
  String theThought;
  float r = 50;
  int zone;
  color lineC;
  //thoughtLifespan is Global

  ArrayList<SoundWave> soundwaves;

  Thought(float x, float y, PVector dir, String t, float l, int z) {
    acceleration = new Vec3D(0.025, 0.025, 0.1);//dir.get(); //instead of new PVector();
    //velocity = PVector.random2D();
    velocity = new Vec3D(dir.x, dir.y, 0.1);//dir.get();
    location = new Vec3D(x,y,10);//new PVector(x, y);
    lifespan = l;
    theThought = t;
    zone = z;
    soundwaves  = new ArrayList<SoundWave>();
    addSoundWaves( 10, z ); //number and zone
    lineC = color(0.5, 0.5, 0);
  }

  void run() {
    update();
    display();
  }

  void intersects(ArrayList<Thought> thoughts) {
    for (Thought other : thoughts) {
      if (other != this) {
        Vec3D dir = location.sub(other.location);
        if (dir.magnitude() < r*2) {
          dir.normalizeTo(0.05); 
          applyForce3D(dir);
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
    if ((location.z < 0)) {
      velocity.z = velocity.z * -1;
    }
  }

  void applyForce3D(Vec3D f) {
    acceleration.addSelf(f); 
  }

  // Method to update location
  void update() {
    velocity.addSelf(acceleration);
    //location.addSelf(velocity.x, velocity.y, pow((thoughtLifespan/lifespan),3));
    location.addSelf(velocity);//pow((thoughtLifespan/lifespan),0.5));
    acceleration.scaleSelf(0);
    lifespan -= 0.5;
  }

  // Method to display
  void display() {
    blendMode(BLEND);
    iterateWaveExist(); //draw wave before text
    
    //
    stroke(0, lifespan);
    strokeWeight(2);
    fill(0.01, lifespan/thoughtLifespan);  //rgb mode 1.0
   
    textSize(thoughtSize); //thoughtSize is Global, default 20.0
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
//    text(theThought, location.x, location.y, pow((thoughtLifespan/lifespan),3)); //z axis causes flickering!!!
    pushMatrix();
      translate(0,0,15); //eleveate text above speakers. +pow((thoughtLifespan/lifespan),3)
      text(theThought, location.x, location.y, location.z);
    popMatrix();
    
  }
  
  void iterateWaveExist(){
    for( Iterator it = soundwaves.iterator(); it.hasNext(); ){
      SoundWave s = (SoundWave) it.next();
      if( !s.ISDEAD ){
        s.exist();
      } else {
        it.remove();
      }
    }
  }
  
  float x() {
    return location.x; 
  }
  float y() {
    return location.y; 
  }
  float z() {
    return location.z; 
  }
  
  //draw lines between text (within a certain distance) //2D
  void displayLines(ArrayList<Thought> thoughts){
    blendMode(BLEND);
    for (int i = 0; i < thoughts.size(); i++) {
      Thought ti = thoughts.get(i);
      
      for (int c = i+1; c < thoughts.size(); c++) {  
        Thought tc = thoughts.get(c);
   
        float d = sq(tc.x() - ti.x()) + sq(tc.y() - ti.y()) + sq(tc.z() - ti.z());
        if( d < pow(1500,2)  ) {
          strokeWeight(1);
          stroke(lineC, map(d, 0.0, pow(1500,2), 1.0, 0.1) ); //rgb mode is 1.0
          line(tc.x(),tc.y(),tc.z(),ti.x(),ti.y(),ti.z());
        }
      }
    }
    blendMode(ADD);
  }
  
  
  void addSoundWaves( int _amt, int _zone ){
    for( int i=0; i<_amt; i++ ){
      soundwaves.add( new SoundWave( new Vec3D(location.x, location.y, 0), new Vec3D(velocity.x, velocity.y, 0), _zone ) );
    }
  }

  // Is the thought still useful?
  boolean isDead() {
    if (lifespan < 0.0) {
      return true;
    } 
    else {
      return false;
    }
  }
}

