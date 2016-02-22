
//Constructor
function NomadsMobileClient(initCallback) {
	//Public member variables
	
	this.user = {};
	this.socket = io.connect();
	this.initCallback = initCallback;

	//Socket Listeners
	this.socket.on('connect', function(data){});
	this.socket.on('user_confirmed', function(data){console.log("User Confirmed "+data);});
  
  //add to global thought object when any user sends a message.
  // only use this function for Desktops. NO PHONES. Too much info and too slow.
  // this.socket.on('client_update', function(data){
  //   allClientThoughts.push({
	 //    "thought":data.messageText, 
	 //    "x":data.x,
	 //    "y":data.y,
	 //    "life":255,
	 //    "size":16,
	 //    "alpha":1.0
	 //  });
  // });

	this.socket.on('message', function(data){
		console.log("data received ", data);
		if(data.type = "poemMessage"){
    	allClientThoughts.push({
	    	"thought":data.messageText, 
		    "x":100,
		    "y":100,
		    "life":255,
		    "size":16,
		    "alpha":1.0
		  });
  	}
  });

	//Private functions
	geo_success_callback = function(p){
	  latitude = parseFloat(p.coords.latitude);
	  longitude = parseFloat(p.coords.longitude);
	  console.log("Lat/Long = " + latitude + " " + longitude);
	  initCallback();
	}

	geo_error_callback = function(p){
	    // p.message : error message
	    console.log("callback: Geolocation is not available");
	    latitude = 0;
	  	longitude = 0;
	    initCallback();
	}

}

NomadsMobileClient.prototype = {
	constructor:NomadsMobileClient,

	geolocate:function(){
		// Geolocation Initialisation
		if(typeof(geoPosition)=='undefined'){
			// You cannot use Geolocation in this device
  	  console.log("Geolocation is not available");
  	  latitude = 0;
	  	longitude = 0;
  	  initCallback();
  	  return;
		}
		if(geoPosition.init()){  
    	geoPosition.getCurrentPosition(geo_success_callback, geo_error_callback,{enableHighAccuracy:true});
  	}else{
  	  // You cannot use Geolocation in this device
  	  console.log("Geolocation is not available");
  	  latitude = 0;
	  	longitude = 0;
  	  initCallback();

  	}
	},

	login:function(username, callback){
		var messageToSend = {};
    this.user.id = messageToSend.id = "nomads_" + username + "_" + Math.floor(Math.random()*1000);
    this.user.username = messageToSend.username = username;
    messageToSend.type = 'newUser';
    messageToSend.latitude = latitude; //changed to latitude, not this.latitude to work in server.js
    messageToSend.longitude = longitude;
    var date = new Date();
    d = date.getMonth()+1+"."+date.getDate()+"."+date.getFullYear()+ " at " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    messageToSend.timestamp = d;
    this.socket.emit('newuser', messageToSend);
    if(typeof(callback)!='undefined'){
    	callback();
    }
	},

	sendMessage:function(messageText, location, CanvasX, CanvasY, type, callback){
		var messageToSend = {};
		messageToSend.id = this.user.id;
		messageToSend.username = this.user.username;
		messageToSend.type = type;
		messageToSend.messageText = messageText;
		messageToSend.location = location //remove zone from message. "Zone X". convert to float.
		messageToSend.latitude = latitude; //since we have this stored, send lat/long with each message
    messageToSend.longitude = longitude;
    messageToSend.x = CanvasX;
    messageToSend.y = CanvasY;
		var date = new Date();
    d = date.getMonth()+1+"."+date.getDate()+"."+date.getFullYear()+ " at " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    messageToSend.timestamp = d;
		this.socket.emit('message', messageToSend);
		//also fire processing on user's own page.
		//var pjs = Processing.getInstanceById('animationUserText');
    //pjs.drawNewUserThought(location, messageText);
		if(typeof(callback)!='undefined'){
    	callback();
    }
	}
}

