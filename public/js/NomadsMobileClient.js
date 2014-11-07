
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
  	}
	},

	login:function(username, callback){
		var messageToSend = {};
		this.user.username = messageToSend.username = username;
    this.user.id = messageToSend.id = "nomads_" + username + "_" + Math.floor(Math.random()*1000);
    messageToSend.timestamp = new Date();
    messageToSend.type = 'newUser';
    messageToSend.latitude = this.latitude;
    messageToSend.longitude = this.longitude;
    this.socket.emit('newuser', messageToSend);
    if(typeof(callback)!='undefined'){
    	callback();
    }
	},

	sendMessage:function(messageText, location, type, callback){
		var messageToSend = {};
		messageToSend.username = this.user.username;
		messageToSend.id = this.user.id;
		messageToSend.messageText = messageText;
		messageToSend.location = location;
		messageToSend.type = type;
		messageToSend.timestamp = new Date();
		this.socket.emit('message', messageToSend);
		if(typeof(callback)!='undefined'){
    	callback();
    }
	}
}
