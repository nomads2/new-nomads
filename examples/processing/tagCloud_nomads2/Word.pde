class Thought {
  // Variables.
  float xpos;
  float ypos;
  float fade;
  color c;
  float size;
  String thought;

  //construct the circle
  Thought(float x, float y, String t) {
    xpos = x;
    ypos = y;
    fade = 0;
    c = color(0);
    size = 20;
    thought = t;
  }

  //
  void display() {
//    noFill();
//    stroke(fade);
//    strokeWeight(size);
//    ellipse(xpos, ypos, fade+size, fade+size);
//    fade+=2;
    fill(252, 247, 240);
    textSize(14);
    text(thought, xpos, ypos);
  }
  
  //test if our circle has faded
  boolean faded() {
    if (fade >= 255) {
      return true;
    } else {
      return false;
    }
  }
  
  float getX() {
    return xpos; 
  }
  
  float getY() {
    return ypos; 
  }

}
