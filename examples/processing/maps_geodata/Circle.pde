class Circle {
  // Variables.
  float xpos;
  float ypos;
  float fade;
  color c;
  float size;

  //construct the circle
  Circle(float lat, float lon) {
    xpos = lat;
    ypos = lon;
    fade = 0;
    c = color(0);
    size = 1;
  }

  //
  void display() {
//    noFill();
    fill(fade, 0, 0, map(fade, 0, 255, 255, 0));
    stroke(fade, 0, 0, map(fade, 0, 255, 255, 0));
    strokeWeight(size);
    ellipse(xpos, ypos, size++, size++);
    fade+=10;
//    println("circle pos: " + xpos + ", " + ypos);
  }
  
  //test if our circle has faded
  boolean faded() {
    if (fade >= 255) {
      return true;
    } else {
      return false;
    }
  }

}
