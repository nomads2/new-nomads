new-nomads
==========

This is V2 of the Nomads codebase.  =)

HOW TO RUN:
install Node: http://nodejs.org/download/
in  /usr/local/bin/node
npm installed at /usr/local/bin/npm
Make sure that /usr/local/bin is in your $PATH (printf "%s\n" $PATH).
cd to new-nomads folder
npm install
node server.js
it will be "Listening on http://127.0.0.1:8081"
in Safari go to http://127.0.0.1:8081
in Max udpreceive 6789
/newuser contains userID user messageType geolocation.lat geolocation.long timestamp
/object contains userID user messageType message zone geolocation.lat geolocation.long timestamp
/thought contains userID zone message 
/geolocation contains lat lon

Look in the interface_mockups folder for some interface design ideas.

TODO:
  * play phone audio when user submits a message in a zone.
  * settings in processing to receive?
  * add in error check message.
  * IP address or Lat/Long with user sign in.

OSC Architecture
 * text messages 
 "/thought username location message"  3 index array

 * point message
 "/pointer username starting X starting Y ending X ending Y" 5 index array

<<<<<<< Updated upstream

External Libs
=============
<a href="https://github.com/estebanav/javascript-mobile-desktop-geolocation">geoPosition.js</a> by Esteban Acosta Villafañe - Javascript library for Geolocation fallback.

License
==========

The MIT License (MIT) Copyright (c) 2014 IMRG University of Virginia McIntire Department of Music

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
=======
 Processing
 * Lat/Long - show on map, connect
 * thought cloud
>>>>>>> Stashed changes
