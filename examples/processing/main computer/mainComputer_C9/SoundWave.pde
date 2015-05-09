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
  color c;
  
  Vec3D acceleration;
  Vec3D velo;
  
  SoundWave( Vec3D _loc, Vec3D _vel, int _zone ) {
    radius  = random(30, 85);
    startLoc = new Vec3D( _loc.add( new Vec3D().randomVector().scaleSelf( random(5.0) ) ) );
    vel = new Vec3D( _vel.scale( random ( 20.0, 40.0) ) );  //scale up speed
    //vel = new Vec3D( _vel.scale( .5 ).addSelf( new Vec3D().randomVector().scaleSelf( random( 10.0 ) ) ) );
    age = 0;
    lifeSpan = (int)(radius);
    zone = _zone;
    c = color(1,1,0.7);//color(0.6156862745098, 0.47450980392157, 0.17647058823529); //157, 121, 45
  }
  
  void exist() {
    setPosition();
    render();
    setAge();
  }
  
  void setPosition() {
    startLoc.addSelf( vel );  
  }
  
  void render() {
    blendMode(BLEND);
    stroke(c, agePer);
    strokeWeight(2);
    noFill();
    float percentage = ((float)(zone)) / ((float)(zones)); //have to cast as floats to not get 0
    float angle = PI+HALF_PI-(TWO_PI*percentage);//starting location point
    angle = angle + HALF_PI+QUARTER_PI; //rotate angle to match inner circle
    float arcX = angle; //zones is global (10)  PI+HALF_PI+
    float arcY = angle + HALF_PI;//+QUARTER_PI; //arc is HALF_PI long
    arc(startLoc.x, startLoc.y, radius, radius, arcX, arcY); 
  }
  
  void setAge() {
    age++;
    radius+=2;
    if(age > lifeSpan) {
      ISDEAD = true;
    } else {
      agePer = 1.0 - age/(float)lifeSpan;
    }
  }
  
}
