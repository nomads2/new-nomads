//FOR TESTING/DESIGNING

void addControlP5() {
  cp5 = new ControlP5(this);
  ControlP5.printPublicMethodsFor(ControllerProperties.class);

  //see Speaker Tab
  cp = cp5.addColorPicker("picker")
          .setPosition(20, 50)
          .setColorValue(color(134,96,94))
          ;
  //see Speaker Tab       
  cp5.addSlider("pulseslider")
     .setPosition(20,150)
     .setSize(100,10)
     .setRange(0,20)
     .setValue(15)
     ;
  //see Speaker Tab
  cp5.addSlider("sizeslider")
     .setPosition(20,165)
     .setSize(100,10)
     .setRange(5,40)
     .setValue(12)
     ;
}
