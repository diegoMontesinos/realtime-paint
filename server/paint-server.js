'use strict';

// Globals
var WebSocket = require('ws');
var WS_PORT = 1881;

var clients = [];
var colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FF00C7',
  '#C300FF',
  '#00DDFF',
  '#FF9900'
];

/*****************************
 * WebSocketServer Callbacks *
 *****************************/

function onListening () {
  console.log((new Date()) + ' Server is listening on port ' + WS_PORT);
}

function onConnection (connection, request) {
  var ip = request.connection.remoteAddress;
  console.log((new Date()) + ' Connection from ' + ip + '.');

  clients.push(connection);

  connection.color = colors.shift();
  sendColorTo(connection);

  // Registramos los callbacks a la conexion recibida

  // ¿Que pasa cuando el usuario nos envia un mensaje?
  connection.on('message', function (message) { onMessage(connection, message); });

  // ¿Que pasa cuando el usuario se desconecta?
  connection.on('close', function () { onClose(connection); });
}

function sendColorTo (connection) {
  var msg = JSON.stringify({
    type : 'color',
    data : connection.color
  });

  connection.send(msg);
}

function onMessage (connection, message) {
  console.log((new Date()) + ' Received Message: ' + message);

  broadcast({
    type : 'cursor',
    data : JSON.parse(message)
  });
}

function broadcast (messageToSend) {
  for (var i = 0; i < clients.length; i++) {
    var client = clients[i];
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messageToSend));
    }
  }
}

function onClose (connection) {
  console.log((new Date()) + ' Peer disconnected.');

  broadcast({
    type : 'disconnected',
    data : connection.color
  });

  colors.push(connection.color);
  clients.splice(clients.indexOf(connection), 1);
}

/***************
 * Main script *
 ***************/

var wsServer = new WebSocket.Server({
  port: WS_PORT
});

// ¿Que pasa cuando el servidor inicia y escucha en el puerto?
wsServer.on('listening', onListening);

// ¿Que pasa cuando llega una nueva conexion?
wsServer.on('connection', onConnection);
