var net = require('net');
 
var sockets = [];
var users = {};

/*
 * Callback method executed when data is received from a socket
 */
function receiveData(socket, data) {
	var dataToCompare = data.toString('utf8').replace(/\r\n/, '');
	console.log("got data "+dataToCompare +" users ="+users);
	
	if(dataToCompare.lastIndexOf("@PM") == 0)
	{
		console.log("handle private message");
	}else{
		broadcast(socket, data);
	}
	
	
}

function broadcast(socket, data)
{
	for(var i = 0; i < sockets.length; i++) {
		//this is to filter out the self
		if (sockets[i] !== socket) {
			sockets[i].write(data);
		}
	}
}

function identifySocket(socket, data)
{
	var name = data.toString('utf8').replace(/\r\n/, '');
	//console.log("got data "+data);
	users[name] =  socket;
	//after identifying the socket on data for chat is enabled
	socket.on('data', function(data) {
		receiveData(socket, data);
	})
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n Enter the name to identify');
	socket.on('data', function(data){ identifySocket(socket, data)})
	
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 8888
server.listen(8888);
