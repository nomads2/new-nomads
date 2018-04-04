
//Constructor
function NomadsMobileClient(initCallback) {
	//Public member variables
	
	user = {};
	this.socket = io.connect();
	this.initCallback = initCallback;
	loggedin = false;
	latitude = 0;
	longitude = 0;

	//Socket Listeners
	this.socket.on('connect', function(data){});
	this.socket.on('user_confirmed', function(data){
		if(data.id == user.id){
			console.log("User Confirmed "+data);	
			loggedin = true;
		}

	});
  
  this.socket.on("disconnect", function() {
  	//https://github.com/LearnBoost/socket.io-client/issues/251
  	console.log("reconnecting");
    socket.socket.reconnect();
  });

  //add to global thought object when any user sends a message.
  // only use this function for Desktops. NO PHONES. Too much info and too slow.
  this.socket.on('client_update', function(data){
		console.log("data received ", data);
		if(data.type == 'poemMessage'){
			
			var xLoc = 300 - (10*(data.messageText.length/2));
			var yLoc = Math.random()*200+200;
    	allClientThoughts.push({
	    	"thought":data.messageText, 
		    "x":xLoc,
		    "y":yLoc,
		    "life":1000,
		    "size":12,
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
		console.log('logging in');
		var messageToSend = {};
    user.id = messageToSend.id = "nomads_" + username + "_" + Math.floor(Math.random()*1000);
    user.username = messageToSend.username = username;
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
		if(!loggedin){
			console.log('not logged in');
			return;
		}
		var messageToSend = {};
		messageToSend.id = user.id;
		messageToSend.username = user.username;
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

