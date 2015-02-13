class Circle {
  // Variables.
  float xpos;
  float ypos;
  float fade;
  color c;
  float size;
  float lifespan;

  //construct the circle
  Circle(PVector loc) {
    xpos = loc.x;
    ypos = loc.y;
    fade = 0;
    lifespan = 255;
    c = color(lifespan);
    size = 10;
  }

  //
  void display() {
    noFill();
    stroke(lifespan);
    strokeWeight(size);
    ellipse(xpos, ypos, fade+size, fade+size);
    fade+=2;
    lifespan-=2;
  }
  
  //test if our circle has faded
  boolean isDead() {
    if (fade >= 255) {
      return true;
    } else {
      return false;
    }
  }

}
