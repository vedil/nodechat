var net = require('net');
 
var sockets = [];
var users = {};

/*
 * Callback method executed when data is received from a socket
 */
function receiveData(socket, data) {
	var dataToCompare = data.toString('utf8').replace(/\r\n/, '');
	//console.log("got data "+dataToCompare +" sockets  ="+sockets.length);
	
	if(dataToCompare.lastIndexOf("@PM") == 0)
	{
		//assuming that the message will be sent as @PM userId:this is test message
		var seperatorIndex = dataToCompare.indexOf(':');
		var userId = dataToCompare.substring(4, seperatorIndex);
		console.log("handle private message userId "+userId);
		users[userId].write("user "+userId +" sent: "+dataToCompare.substring(seperatorIndex));
		
	}else{
		console.log("got data "+dataToCompare +" sockets  ="+sockets.length);
		broadcast(socket, data);
	}
	
	
}

function broadcast(socket, data)
{
	console.log("broad casting got data "+data +" sockets  ="+sockets.length);
	for(var i = 0; i < sockets.length; i++) {
		//this is to filter out the self
		if (sockets[i] !== socket) {
			sockets[i].write(socket.name+" sent: "+data);
		}
	}
}

function identifySocket(socket, data)
{
	console.log("socket = "+socket + " data = "+data);
	var name = data.toString('utf8').replace(/\r\n/, '');
	console.log("inside identify sock  data "+data);
	users[name] =  socket;
	//after identifying the socket on data for chat is enabled
	//var flag = socket.removeListener('data', onData);
	//console.log("after removing listener "+flag);
	socket.removeAllListeners('data');
	socket.on('data', function(data) {
		receiveData(socket, data);
	})
	
	socket.name = name;
}

function onData(data)
{
	identifySocket(socket, data);
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n ');
	socket.write("private message can be sent by command like this @PM userId:this is test message")
	socket.write('no:of sockets '+sockets.length +"\n");
	socket.write("Enter the name to identify:");
	socket.on('data', function (data){identifySocket(socket, data);});
	
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 8888
server.listen(8888);
