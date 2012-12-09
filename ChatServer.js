var net = require('net');
 
var sockets = [];


/*
 * Callback method executed when data is received from a socket
 */
function receiveData(socket, data) {
	data = data.toString('utf8').replace(/\r\n/, '');
	console.log("got data "+data);
	for(var i = 0; i < sockets.length; i++) {
		//this is to filter out the self
		if (sockets[i] !== socket) {
			sockets[i].write(data);
		}
	}
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n');
	socket.on('data', function(data) {
		receiveData(socket, data);
	})
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 8888
server.listen(8888);
