/**
 * OSC plugin using node and osc-min.
 * @author Jon Bellona
 */


// GLOBAL vars
var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');
var outport = 6789; //Max/MSP sound
var outport2 = 6790; //Prcoessing visual

/**
 * Dynamically send any size array as a single OSC message
 *
 * @param {string} [url] OSC address e.g. '/datatype user location message'
 * @param {string int float} [data] data value to send
 */
exports.sendOSC = function(url, data) {
  var buf;
  var argArray = new Array();
  for (var k in data){
    if (data.hasOwnProperty(k)) {
      argArray.push(data[k]);
    }
  }
  buf = osc.toBuffer({
    address: "" + url + "",
    args: 
      argArray
  });
  udp.send(buf, 0, buf.length, outport, "localhost");
  return udp.send(buf, 0, buf.length, outport2, "localhost");
};

/**
 * Send multidimensional array as an OSC bundle (keys are addresses)
 * @author  Jon Bellona
 * @requires osc-min, dgram, udp4
 */
exports.sendOSCBundle = function(bundle) {
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
  udp.send(buf, 0, buf.length, outport, "localhost");
  return udp.send(buf, 0, buf.length, outport2, "localhost");
};


// function heartbeat() {
//   var languageBundle = new Array();
//   languageBundle["/length"] = Math.random(100);
//   languageBundle["/avgLength"] = 24.6;
//   languageBundle["/lang"] = 'english';
//   sendOSCBundle(languageBundle);
// }
// setInterval(heartbeat, 2000);

////////////////////////////////////////////
// //example: sendOSC as a bundle
// var languageBundle = new Array();
// languageBundle["/length"] = 50;
// languageBundle["/avgLength"] = 24.6;
// languageBundle["/lang"] = 'english';
// sendOSCBundle(languageBundle);