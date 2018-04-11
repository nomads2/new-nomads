
//Constructor
function NomadsMobileClient(initCallback, changeClientMode) {
	//Public member variables
	
	user = {};
	this.socket = io.connect();
	this.initCallback = initCallback;
	this.changeClientMode = changeClientMode;
	loggedin = false;
	latitude = 0;
	longitude = 0;

	//Socket Listeners
	this.socket.on('connect', function(data){});
	this.socket.on('auksalaq_user_confirmed', function(data){
		if(data.id == user.id){
			console.log("User Confirmed "+data + " " + data.mode);	
			loggedin = true;
			changeClientMode(data.mode);
		}

	});
  
  this.socket.on("disconnect", function() {
  	//https://github.com/LearnBoost/socket.io-client/issues/251
  	console.log("reconnecting");
    socket.socket.reconnect();
  });

  //add to global thought object when any user sends a message.
  // only use this function for Desktops. NO PHONES. Too much info and too slow.
  this.socket.on('auksalaq_client_update', function(data){
		console.log("data received ", data);
		if(data.type == 'aukthought'){
			
			//var xLoc = GRAPHICSW - data.messageText.length - (Math.random()*data);
			//var yLoc = Math.random()*200+20;
    	allClientThoughts.push({
	    	"thought":data.messageText, 
		    "x":data.x,
		    "y":data.y,
		    "life":4000,
		    "size":12,
		    "alpha":1.0,
		    "vectorX":data.rX,
		    "vectorY":data.rY
		  });
  	}

  	if(data.type == 'aukchatmessage'){
  		console.log('got chat message '+data.messageText);
  		if($('chat-log')!=null){
  			$('#chat-log').append("<li>"+data.messageText + "</li>");
  			var dy = $('#chat-log').height() - $('#mainui').height();
  			if(dy>0){
  				$('#chat-log').css('top',-dy-20+'px');
  			}
  		}
  	}
  });

  this.socket.on('auksalaq_mode', function(data){
  	console.log('mode change to '+data);
  	changeClientMode(data);
  	//change inteface to new mode
  	//initCallback(data);
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
    this.socket.emit('auksalaq_newuser', messageToSend);
    if(typeof(callback)!='undefined'){
    	callback();
    }
	},

	sendMessage:function(messageText, type, x, y, callback){
		if(!loggedin){
			console.log('not logged in');
			return;
		}
		var messageToSend = {};
		rX = Math.floor(random()*2);
	  rY = Math.floor(random()*2);

	  if(rX==1){
	    rX = .5;
	  }else {
	    rX= -.5;
	  }

	  if(rY==1){
	    rY = .5;
	  }else {
	    rY = -.5;
	  }

		messageToSend.id = user.id;
		messageToSend.username = user.username;
		messageToSend.type = type;
		messageToSend.messageText = messageText;
		
    messageToSend.x = x;
    messageToSend.y = y;
    messageToSend.rX = rX;
    messageToSend.rY = rY;
		var date = new Date();
    d = date.getMonth()+1+"."+date.getDate()+"."+date.getFullYear()+ " at " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    messageToSend.timestamp = d;
		this.socket.emit('auksalaq_message', messageToSend);
		//also fire processing on user's own page.
		//var pjs = Processing.getInstanceById('animationUserText');
    //pjs.drawNewUserThought(location, messageText);
		if(typeof(callback)!='undefined'){
    	callback();
    }
	},

	changeMode:function(mode){
		this.socket.emit('auksalaq_mode', mode);	
	}
}

