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
  color lineC;
  //thoughtLifespan is Global

  ArrayList<SoundWave> soundwaves;

  Thought(float x, float y, PVector dir, String t, float l, int z) {
    acceleration = new Vec3D(0.025, 0.025, 0.1);//dir.get(); //instead of new PVector();
    //velocity = PVector.random2D();
    velocity = new Vec3D(dir.x, dir.y, 1.5);//dir.get();
    location = new Vec3D(x,y,10);//new PVector(x, y);
    swV = new Vec3D(velocity.x, velocity.y, 0);
    lifespan = l;
    theThought = t;
    zone = z;
    soundwaves  = new ArrayList<SoundWave>();
    addSoundWaves( 3, z ); //number and zone
    //lineC = color(0.5, 0.5, 0);
    lineC = color(0, 0.2);
  }

//  void run() {
//    update();
//    display();
//  }

  void intersects(ArrayList<Thought> thoughts) {
    for (Thought other : thoughts) {
      if (other != this) {
        Vec3D dir = location.sub(other.location);
        if (dir.magnitude() < r*1.5) {
          dir.normalizeTo(0.02); 
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
    colorMode(RGB, 255.0);
    fill(255,231,210, (lifespan/thoughtLifespan)*255);  //rgb mode 1.0
   
    textSize(thoughtSize); //thoughtSize is Global, default 20.0
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
//    text(theThought, location.x, location.y, pow((thoughtLifespan/lifespan),3)); //z axis causes flickering!!!
    pushMatrix();
      translate(0,0,15); //eleveate text above speakers. +pow((thoughtLifespan/lifespan),3)
      text(theThought, location.x, location.y, location.z);
    popMatrix();
    colorMode(RGB, 1.0);
  }
  
  //display thoughts as shifting left column sidebar
  void displayAsSidebar(int index) {
    //set up text 
    colorMode(RGB, 255.0);
    //fill(255,231,210, 200);
    fill(255,238,97, 200);
    //strokeWeight(2);
    textSize(thoughtSize-2);
    textLeading(thoughtSize-4);
    rectMode(CORNER);
    textAlign(LEFT);
    pushMatrix();
      translate(0,10,15); //eleveate text above speakers. 
      translate(25, index*40, 0);
      text(theThought, 0, 0, 200, 40);
    popMatrix();
    colorMode(RGB, 1.0); //reset colormode
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
  float lifespan() {
    return lifespan; 
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
          //stroke(lineC, map(d, 0.0, pow(1500,2), 1.0, 0.1) ); //rgb mode is 1.0
          stroke(lineC, pow((ti.lifespan()/thoughtLifespan), 3)); //alpha of line determined by lifespan (ti better than tc)
          line(tc.x(),tc.y(),tc.z(),ti.x(),ti.y(),ti.z());
        }
      }
    }
    blendMode(ADD);
  }
  
  
  void addSoundWaves( int _amt, int _zonen ){
    PVector speakerLoc = new PVector(0,0);
    speakerLoc.x = (width/2) + rad*(sin(radians((_zonen*(360/zones))))); //number of speakers and rad are global
    speakerLoc.y = (height/2) + rad*(cos(radians((_zonen*(360/zones))+180)));
    //PVector speakerOffset = new PVector(0,0);
//    speakerOffset.x = 40*(sin(radians((_zone*(360/zones)))));
//    speakerOffset.y = 40*(cos(radians((_zone*(360/zones)))));
//    speakerLoc.x = speakerLoc.x - speakerOffset.x;
//    speakerLoc.y = speakerLoc.y - speakerOffset.y;
    
    int dist = 25;
   // PVector waveOffset = new PVector(0,0);
     
    
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
  
//  void addSoundWaves( int _amt, int _zone ){
//    PVector speakerLoc = new PVector(0,0);
//    speakerLoc.x = (width/2) + rad*(sin(radians((_zone*(360/zones))+180))); //zones and rad are global
//    speakerLoc.y = (height/2) + rad*(cos(radians((_zone*(360/zones))+180)));
//    PVector speakerOffset = new PVector(0,0);
//    speakerOffset.x = 40*(sin(radians((_zone*(360/zones))+180)));
//    speakerOffset.y = 40*(cos(radians((_zone*(360/zones))+180)));
//    speakerLoc.x = speakerLoc.x - speakerOffset.x;
//    speakerLoc.y = speakerLoc.y - speakerOffset.y;
//    
//    int dist = 25;
//    PVector waveOffset = new PVector(0,0);
//    
//    for( int i=0; i<_amt; i++ ){
//      waveOffset.x = (i*dist)*(sin(radians((_zone*(360/zones))+180)));
//      waveOffset.y = (i*dist)*(cos(radians((_zone*(360/zones))+180)));
//      //instead of location.x,y (the text location), use the speaker location as starting point for soundwave (based upon zone)
//      soundwaves.add( new SoundWave( new Vec3D(speakerLoc.x+waveOffset.x, speakerLoc.y+waveOffset.y, 0), new Vec3D(velocity.x, velocity.y, 0), _zone ) );
//    }
//  }

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

