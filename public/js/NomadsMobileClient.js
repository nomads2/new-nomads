
//Constructor
function NomadsMobileClient(initCallback) {
	//Public member variables
	this.latitude = '';
	this.longitude = '';
	this.user = {};
	this.socket = io.connect();
	this.initCallback = initCallback;

	//Socket Listeners
	this.socket.on('connect', function(data){});
	this.socket.on('user_confirmed', function(data){console.log("User Confirmed "+data);});

	//Private functions
	geo_success_callback = function(p){
	  latitude = parseFloat(p.coords.latitude);
	  longitude = parseFloat(p.coords.longitude);
	  console.log("Lat/Long = " + latitude + " " + longitude);
	  this.initCallback();
	}

	geo_error_callback = function(p){
	    // p.message : error message
	    console.log("Geolocation is not available");
	    this.initCallback();
	}

}

NomadsMobileClient.prototype = {
	constructor:NomadsMobileClient,

	geolocate:function(){
		// Geolocation Initialisation
		if(geoPosition.init()){  
    	geoPosition.getCurrentPosition(geo_success_callback, geo_error_callback,{enableHighAccuracy:true});
  	}else{
  	  // You cannot use Geolocation in this device
  	  console.log("Geolocation is not available");
  	  this.initCallback();
  	}
	},

	login:function(username, callback){
		var messageToSend = {};
    this.user.id = messageToSend.id = "nomads_" + username + "_" + Math.floor(Math.random()*1000);
    this.user.username = messageToSend.username = username;
    messageToSend.type = 'newUser';
    messageToSend.latitude = latitude; //changed to latitude, not this.latitude to work in server.js
    messageToSend.longitude = longitude;
    messageToSend.timestamp = new Date();
    this.socket.emit('newuser', messageToSend);
    if(typeof(callback)!='undefined'){
    	callback();
    }
	},

	sendMessage:function(messageText, location, type, callback){
		var messageToSend = {};
		messageToSend.id = this.user.id;
		messageToSend.username = this.user.username;
		messageToSend.type = type;
		messageToSend.messageText = messageText;
		messageToSend.location = location //remove zone from message. "Zone X". convert to float.
		messageToSend.latitude = latitude; //since we have this stored, send lat/long with each message
    messageToSend.longitude = longitude;
		messageToSend.timestamp = new Date();
		this.socket.emit('message', messageToSend);
		if(typeof(callback)!='undefined'){
    	callback();
    }
	}
}

