/**
 * Parse a text string for relationships, create a tag cloud
 *
 * @author Jon Bellona
 * @email <jon@jpbellona.com>
 * @uri http://jpbellona.com
 */

//OSC library and vars
import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;

//grabbed an explanation of MothersDay off of Wikipedia.
PFont font;
ArrayList thoughts;
String alphabet = "abcdefghijklmnopqrstuvwxyz";

void setup() {
  size(600, 600, P3D);
  background(0);

  font = loadFont("CapitalsRegular-33.vlw");
  textFont(font);
  frameRate(10);
  noFill();
  stroke(255);
  textAlign(CENTER);
  smooth();

  thoughts = new ArrayList();

  // OSC input port
  oscP5 = new OscP5(this, 6789);
  // OSC output port
  myRemoteLocation = new NetAddress("127.0.0.1", 41236);
}

void draw() {
  background(0);

  //create a thought cloud. 
  //i.e. loop through the words and display them on the screen.

  for (int i = thoughts.size()-1; i >= 0; i--) { 
    // An ArrayList doesn't know what it is storing so we have 
    // to cast the object coming out
    Thought t  = (Thought) thoughts.get(i);
    t.display();
    if (t.faded()) {
      // Items can be deleted with remove()
      thoughts.remove(i);
    }
  }

  //draw lines between all thoughts
  drawLines();
}

void mousePressed() {
  // A new Thought object
  String thought = "";
  int letters = int(random(1, 14));
  for (int i=0; i<letters; i++) {
    int rand = int(random(26));
    char randChar = alphabet.charAt(rand);
    thought += str(randChar);
  }
  println(thought);

  thoughts.add(new Thought(mouseX, mouseY, thought));
}



/* 
 * draw lines between all active circles
 */
void drawLines() {

  for (int i = thoughts.size()-1; i >= 0; i--) { 
    Thought t  = (Thought) thoughts.get(i);

    //draw a line between all other thoughts
    for (int j = thoughts.size()-1; j >= 0; j--) {
      Thought t2  = (Thought) thoughts.get(j);
      if ((t.getX() != t2.getX()) && (t.getY() != t2.getY())) {
        stroke(250, 250, 250, 50);
        strokeWeight(1);
        line(t.getX(), t.getY(), t2.getX(), t2.getY());
        //stroke(0, 0, 0, 125);
      }
    }
  }
}

/*
 * incoming OSC messages
 *
 * @author Jon Bellona
 * @since simpleopenni 0.26
 */
void oscEvent(OscMessage theOscMessage) {
  println(theOscMessage.typetag());
  if (theOscMessage.checkAddrPattern("/thought")==true) {

    if (theOscMessage.checkTypetag("sss")) {
      // parse theOscMessage and extract the values from the osc message arguments.
      String location = theOscMessage.get(1).stringValue();
      String thought = theOscMessage.get(2).stringValue();
      //todo: account for zones...

      thoughts.add(new Thought(random(width), random(height), thought));
    }
  }

  // print the address pattern for determing OSC information
  //   println("### received an OSC message.");
  //   println("Address pattern: " + theOscMessage.addrPattern() + " and Type Tag: " + theOscMessage.typetag());
  //
}

