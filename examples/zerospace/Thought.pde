class Thought {
  // Variables.
  float fade; //to get rid of object
  float size; //size of text box
  String thought;

  //construct the object
  Thought(String t) {
    fade = 0;
    size = 50;
    thought = t;
  }

  //displays object (text)
  void display() {
    fill(247, 247);
    textSize(size/3);
    textLeading(size/3.5);
    rectMode(CORNER);
    text(thought, 0, 0, size*6, size*1.5);

    fade+=0.75;
    fade+=globalFade; //0 until user hits 'E' on keyboard
  }
  
  //test if our object has faded
  boolean faded() {
    if (fade >= 255) {
      return true;
    } else {
      return false;
    }
  }
  
  float getSize() {
    return size; 
  }

}
