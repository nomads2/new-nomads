// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class ThoughtSystem {
  ArrayList<Thought> thoughts;

  ThoughtSystem(PVector location) {
    thoughts = new ArrayList<Thought>();
  }

  void addThought(float x, float y, PVector f, String m) {
    thoughts.add(new Thought(x, y, f, m));
  }


  void display() {
    for (Thought t : thoughts) {
      t.display();
    }
  }

  void applyForce(PVector f) {
    for (Thought t : thoughts) {
      t.applyForce(f);
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

