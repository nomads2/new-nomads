// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

class Particle {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float lifespan;
  char letter;
  PImage img;

  Particle(PVector l, PVector dir, char c, PImage img_) {
    //acceleration = new PVector(0,0.05);
    acceleration = dir.get();
    velocity = new PVector(random(-1,1),random(-2,0));
    location = l.get();
    lifespan = 255.0;
    letter = c;
    img = img_;
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
//    stroke(0,lifespan);
//    strokeWeight(2);
//    fill(128,lifespan);
//    ellipse(location.x,location.y,12,12);
//    text(letter,location.x,location.y);
    imageMode(CENTER);
    tint(lifespan); //need to show this
    image(img, location.x, location.y, 32, 32);
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


