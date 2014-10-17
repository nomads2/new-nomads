/*sendOSC as a bundle - example from Jon's Carbon Feed project
  var languageBundle = new Array();
  languageBundle["/length"] = tweetLen;
  languageBundle["/avgLength"] = avg_textLength;
  languageBundle["/lang"] = tweetLang;
  languageBundle["/avgLangSum"] = avg_langSum;
  sendOSCBundle(languageBundle);
*/  

/**
 * Send multidimensional array as an OSC bundle (keys are addresses)
 */
function sendOSCBundle(bundle) {
  var oscBundle = new Array();

  for (var k in bundle){
    if (bundle.hasOwnProperty(k)) {
      var tmpItem = { address: k, args: bundle[k] };
      oscBundle.push(tmpItem);
    }
  }
  //console.log(oscBundle);

  var buf;
  buf = osc.toBuffer(
  {
    oscType: "bundle",
    elements:
     oscBundle
  });
  return udp.send(buf, 0, buf.length, outport, "localhost");
};