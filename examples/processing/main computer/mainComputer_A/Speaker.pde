// Speaker as a Moving Circle

class Speaker {
  PVector loc;
  float lifespan;
  float fade;
  color c;
  float size;
//  PImage img;
  int num;

  Speaker(PVector l, int n) {
    loc = l.get();
    lifespan = 255.0;
    num = n;               //speaker number
    //c = color(228,174,50);
    c = color(157,121,45);
    fade = 0;
    size = 15;
    
  }

  void run() {
    update();
    display();
  }

  // Method to update location
  void update() {
    //lifespan -= 2.0;
    fade+=0.01;
//    if(fade>=6.28){
//      fade=0; 
//    }
  }

  // Method to display
  void display() {
    blendMode(SCREEN); //SCREEN also is good, BLEND is default
    fill(c, 225/num);
    noStroke();
//    stroke(255/num*2);
//    strokeWeight(size*10);
    float pulse = sin(fade*(num/1.5))*3;
    ellipse(loc.x, loc.y, pulse+size*num, pulse+size*num);
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


