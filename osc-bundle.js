/**
 * OSC plugin using node and osc-min.
 * @type {[type]}
 */


// GLOBAL vars
var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');
var outport = 6789;


/**
 * Send multidimensional array as an OSC bundle (keys are addresses)
 * @author  Jon Bellona
 * @requires osc-min, dgram, udp4
 */
function sendOSCBundle(bundle) {
  var oscBundle = new Array();

  //convert keys from array into OSC addresses, push into oscBundle
  for (var k in bundle){
    if (bundle.hasOwnProperty(k)) {
      var tmpItem = { address: k, args: bundle[k] };
      oscBundle.push(tmpItem);
    }
  }
  console.log(oscBundle);

  //take oscBundle and send out as OSC message
  var buf;
  buf = osc.toBuffer(
  {
    oscType: "bundle",
    elements:
      oscBundle
  });
  return udp.send(buf, 0, buf.length, outport, "localhost");
};


function heartbeat() {
  var languageBundle = new Array();
  languageBundle["/length"] = Math.random(100);
  languageBundle["/avgLength"] = 24.6;
  languageBundle["/lang"] = 'english';
  sendOSCBundle(languageBundle);
}
// setInterval(heartbeat, 2000);

////////////////////////////////////////////
// //example: sendOSC as a bundle
// var languageBundle = new Array();
// languageBundle["/length"] = 50;
// languageBundle["/avgLength"] = 24.6;
// languageBundle["/lang"] = 'english';
// sendOSCBundle(languageBundle);