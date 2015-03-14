// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles 

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


