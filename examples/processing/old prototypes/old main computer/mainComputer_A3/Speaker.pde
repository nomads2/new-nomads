// Speaker as a Moving Circle

class Speaker {
  PVector loc;
  float lifespan;
  float fade;
  color c1;
  color c2;
  float size;
//  PImage img;
  int num;
  float pul;
  float amt;
  float amtStatic = 0.01;

  Speaker(PVector l, int n) {
    loc = l.get();
    lifespan = 255.0;
    num = n;               //speaker number
    c1 = color(119,93,39); //color(228,174,50);  134,96,94
    c2 = color(157,121,45);
    fade = 0;
    size = 15; //15
    pul = random(1.5,2.5); //random number for pulsing the size
    amt = random(0.0,0.9);
  }

  void run() {
    update();
    display();
  }

  // Method to update location
  void update() {
    //lifespan -= 2.0;
    amt+=amtStatic;
    fade+=0.01;
    if(amt >= 1.0){
      amtStatic *= -1; 
    } else if (amt <= 0.0) {
      amtStatic *= -1;
    }
  }

  // Method to display
  void display() {
    //c1 = cp.getColorValue();//DESIGN DATA
    blendMode(SCREEN); //SCREEN also is good, BLEND is default
    color cL = lerpColor(c1, c2, amt);
    fill(cL, 150/num);
    noStroke();
    float pulse = sin(fade*(num/pul))*pulseslider;  //6
    //float pulse = sin(fade*(num/pul))*6;  //6
    ellipse(loc.x, loc.y, pulse+sizeslider*num, pulse+sizeslider*num);
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


