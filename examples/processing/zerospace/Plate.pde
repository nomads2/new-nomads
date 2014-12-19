class Plate {
  // Variables.
  float fade; //to get rid of object
  float offset; //don't know fully purpose?
  color c;
  int colorpicker;
  float seedVal;
  float rodLength;
  float rl = 90;
  PVector rodRotation;
  float size; //size of text box
  String thought;
  //color to pick from when creating the plate. 
  color [] colors = {
    #db3f0f, #ffb05c, #771400, #7f4a10, #e34702, #0acbb6, #47a16d, #4fb000, #699d9a, #e6f65e, #3b36b8, #25b0f1, #657ad4, #93f3fc, #005f82
  };

  //construct the object (cp must be 0-15)
  Plate(int cp, String t) {
    fade = 0;
    c = colors[cp];
    rodRotation = new PVector(random(radians(360)), random(radians(360)), random(radians(360)));
    rodLength = random(rl,rl+2); //based upon status count?
    seedVal = random(1000);
    offset = random(250, 300);
    size = 50;
    thought = t;
  }

  //
  void display() {
    stroke(c, 100);
    fill(c, 130);
    
    //LENGTH OF EACH ARM
    rodLength=(sin((float(frameCount)+offset*3)/rl)*5)+(rl*2.5);

    pushMatrix();
    
    //Rod Line
    rotateX(rodRotation.x);
    rotateY(rodRotation.y);
    rotateZ(rodRotation.z);
    line(0, 0, rodLength, 0);

    //End Plate
    pushMatrix();
    
    translate(rodLength, 0, 0);
    rotateY(radians(90));
    
    // Subdivisions of each arm (little rows of boxes per strand)
    for (int p=1; p>0; p--) {
      rotateX((noise(grower/6))/95); //uses a global var! (eee!)
      rotateY((noise(grower/7))/95);   
      pushMatrix();
        box(size, size, size/8);
        
        pushMatrix();
        translate(0,0,size/10); //push text in front of box
        //TEXT
        fill(255);
        textSize(size/5);
        textLeading(size/8);
        rectMode(CENTER);
        text(thought, 0, 0, size*1.25, size*1.25); //do I need to change rectMode?  or into a text block?
        popMatrix();
      popMatrix();
    }

    popMatrix();
    popMatrix();
    
    noiseSeed(int(seedVal)); //why do I need this?
    rodRotation.x += (noise(seedVal)-.5)/100;
    rodRotation.y += (noise(seedVal)-.5)/100;
    rodRotation.z += (noise(seedVal)-.5)/100;
    
    //fade should be a minute or so (fr = 40, 0.1 at 1 sec = 4, 255/4 = 63.75sec)
    fade+=0.07;
    fade+=globalTweak;
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
  
//  float getX() {
//    return xpos; 
//  }
//  
//  float getY() {
//    return ypos; 
//  }

}
