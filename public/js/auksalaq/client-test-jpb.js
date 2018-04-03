/**
 * Test functions for server.
 */

$(document).ready(function() {   

  var socket = io.connect();

  var localUser = {
		name: "nomads_" + Math.floor(Math.random()*100000)
  }

  // on connection to server
	socket.on('connect', function() {
		//setup user object
    // localUser.message = new Array();
		socket.emit('newuser', localUser);
	});


  // listen for interactions on the page. (text, locations)
  $('#sender').bind('click', function() {
    localUser.message = { 
      type: 'text',
      value: new Date()
    };
    socket.emit('message', localUser);     
  });

  //listen for message from the server.
  socket.on('data_received', function(data){
   $('#receiver').append('<li>' + data + '</li>');  
  });
});