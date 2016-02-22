/**
 * OSC plugin using node and osc-min.
 * @author Jon Bellona
 * @author Travis Thatcher - added udp listening for OSC from Max 
 */


// GLOBAL vars
var osc = require('osc-min');
var dgram = require('dgram');
var callback;
udpcallback = function(message){
  console.log("message callback thang",message);
  callback(message);
}

var client = dgram.createSocket('udp4', function(msg, rinfo) {
 
  // parse message
  msg = osc.fromBuffer(msg);
  
  // send args to browser
  console.log("message to send",msg);  
  udpcallback(msg); 
 
});

var outport = 6789; //Max/MSP sound
var outport2 = 6790; //Prcoessing visual
var inport = 6791; //From Max/MSP

client.bind(6791); //Listen for incoming OSC messages

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
  client.send(buf, 0, buf.length, outport, "localhost");
  return client.send(buf, 0, buf.length, outport2, "localhost");
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
  client.send(buf, 0, buf.length, outport, "localhost");
  return client.send(buf, 0, buf.length, outport2, "localhost");
};

exports.setOscCallback = function(OSCcallback){
  callback = OSCcallback;
}

