// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Using Generics now!  comment and annotate, etc.

class SpeakerSystem {
  ArrayList<Speaker> speakers;
  PVector origin;

  SpeakerSystem(int num, PVector loc) {
    origin = loc.get();
    speakers = new ArrayList<Speaker>();
    for (int i = 1; i <= num; i++) {
      speakers.add(new Speaker(origin, i));    // Add "num" amount of particles to the arraylist
    }
  }

//  void addSpeaker(PVector l) {
//    speakers.add(new Speaker(l));
//  }

  void run() {
    for (int i = speakers.size()-1; i >= 0; i--) {
      Speaker s = speakers.get(i);
      s.run();
      if (s.isDead()) {
        speakers.remove(i);
      }
    }
  }
}

