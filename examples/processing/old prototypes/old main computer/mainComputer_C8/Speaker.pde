// Speaker as a Moving Circle

class Speaker {
  PVector loc;
  float lifespan;
  float fade;
  color c1;
  color c2;
  float size;
  int num;
  float pul;
  float amt;
  float amtStatic = 0.01;
  int mode;
    //png colors
  //inner ven dark (119,93,39)
  //outer ven light (157, 121, 45)
  //ouside ven ligth (225,172, 50)

  Speaker(PVector l, int n, int s, color c, int m) {
    loc = l.get();
    lifespan = 255.0;
    num = n;               //speaker number
    c1 = c; //color(119,93,39); //color(228,174,50);  134,96,94
    c2 = color(92,84,36); //color(157,121,45);
    fade = 0;
    size = s; //15
    pul = random(1.5,2.5); //random number for pulsing the size
    amt = random(0.0,0.9);
    mode = m; //display mode SCREEN = 1, BLEND = 2;
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
    switch(mode) {  //SCREEN also is good, BLEND is default
      case 1: blendMode(ADD); break; //SCREEN
      case 2: blendMode(BLEND); break; //BLEND
    }
    color cL = lerpColor(c1, c2, amt);
    fill(cL, 255/num); //numerator makes it lighter or darker
    noStroke();
    float pulse = sin(fade*(num/pul))*6;  //6
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


