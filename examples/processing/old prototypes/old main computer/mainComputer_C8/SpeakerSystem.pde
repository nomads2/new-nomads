// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class SpeakerSystem {
  ArrayList<Speaker> speakers;
  PVector origin;

  SpeakerSystem(int num, PVector loc, int size, color c, int m) {
    origin = loc.get();
    speakers = new ArrayList<Speaker>();
    for (int i = 1; i <= num; i++) {
      speakers.add(new Speaker(origin, i, size, c, m)); // Add "num" amount of particles to the arraylist
    }
  }

  void run() {
    pushMatrix();
    for (int i = speakers.size()-1; i >= 0; i--) {
      translate(0,0,2); //elevate each speaker up by 1 z value.
      Speaker s = speakers.get(i);
      s.run();
      if (s.isDead()) {
        speakers.remove(i);
      }
    }
    popMatrix();
  }
}

