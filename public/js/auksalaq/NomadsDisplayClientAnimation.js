// This class is made from animation code genereated by Adobe Illustrator

//Constructor
function NomadsDisplayClientAnimation() {
      var canvas = document.getElementById('mainui');
      var ctx = canvas.getContext('2d');
      var fps = 20.0;

      

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
            var font = "20px Futura, sans-serif";
            ctx.font = font;
            ctx.fillStyle = "black";
            allClientThoughts.forEach( function (arrayItem, i)
            {
                //change text properties (size, fade out).
                font = arrayItem.size + "px Futura, sans-serif";
                ctx.font = font;
                arrayItem.size += .2;
                ctx.fillStyle = "rgba(0, 0, 0, " + arrayItem.alpha + ")";
                arrayItem.alpha -= 0.02;

                //show text
                ctx.fillText(arrayItem.thought, arrayItem.x, arrayItem.y);

                //life to delete from array
                arrayItem.life -= 0.25; //2 second life at 20fps
                arrayItem.y -= 1;
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

