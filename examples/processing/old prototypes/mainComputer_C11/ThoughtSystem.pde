// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class ThoughtSystem {
  ArrayList<Thought> thoughts;

  ThoughtSystem(PVector location) {
    thoughts = new ArrayList<Thought>();
  }

  void addThought(float x, float y, PVector f, String m, float l, int z) {
    //x y position, zone, message, lifespan, zone
    thoughts.add(new Thought(x, y, f, m, l, z));
  }


  void display() {
    int i = 0;
    for (Thought t : thoughts) {
      t.displayLines(thoughts); //connect lines btw. thoughts 
      t.display(); //draw text on top of lines
      t.displayAsSidebar(i); //display thoughts as running sidebar - left column
      i+=1;
    }
  }

//  void applyForce(PVector f) {
//    for (Thought t : thoughts) {
//      t.applyForce(f);
//    }
//  }
  void applyForce(Vec3D f) {
    for (Thought t : thoughts) {
      t.applyForce3D(f);
    }
  }

  void intersection() {
    for (Thought t : thoughts) {
      t.intersects(thoughts);
    }
  }
  
  void bounce() {
    for (Thought t : thoughts) {
      t.intersectsWall();
    }
  }


  void update() {
    for (int i = thoughts.size()-1; i >= 0; i--) {
      Thought t = thoughts.get(i);
      t.update();
      if (t.isDead()) {
        thoughts.remove(i);
      }
    }
  }
}

