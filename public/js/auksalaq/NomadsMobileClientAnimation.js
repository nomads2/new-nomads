// This class is made from animation code genereated by Adobe Illustrator

//Constructor
function NomadsMobileClientAnimation() {
  var canvas = document.getElementById('mainui');
  var ctx = canvas.getContext('2d');
  var fps = 20.0;

  console.log('animation started');

  init = function(){

    // Set main canvas and context references
    canvas = document.getElementById('mainui');
    ctx = canvas.getContext('2d');
    // Set animation timer
    setInterval(drawFrame, (1000 / fps));
  }      

  updateAnimations = function() {
    // Update animation clocks
    //updateAllClocks();
  }

  drawFrame = function() {

    // Update animations
    updateAnimations();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw(ctx);

    // Add dynamic objects from users (text)
    // has to be in this draw loop, otherwise won't display
    // display User Text objects that get deleted after X time.
    // allClientThoughts[]
    var font = "22px Futura, sans-serif";
    ctx.font = font;
    ctx.fillStyle = "white";
    allClientThoughts.forEach( function (arrayItem, i)
    {
      //change text properties (size, fade out).
      font = arrayItem.size + "px Futura, sans-serif";
      ctx.font = font;
      arrayItem.size += .5;
      ctx.fillStyle = "rgba(255, 255, 255, " + arrayItem.alpha + ")";
      arrayItem.alpha -= 0.005;

      //show text
      ctx.fillText(arrayItem.thought, arrayItem.x, arrayItem.y);

      //life to delete from array
      arrayItem.life -= 0.05; //2 second life at 20fps
      arrayItem.y -= arrayItem.vectorY;
      if(arrayItem.life <= 0.0){
        if (i > -1) {
            allClientThoughts.splice(i, 1);
        }
      }
    });
  }

   draw = function(ctx) {

    // layer1/Linked File
    ctx.save();
    //ctx.transform(1.000, 0.000, -0.000, 1.000, 303.4, 315.5);
    var background = document.getElementById('background');  
    ctx.drawImage(background, 0, 0);
    ctx.restore();
  }

  init();

}

