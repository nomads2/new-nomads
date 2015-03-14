// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

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


