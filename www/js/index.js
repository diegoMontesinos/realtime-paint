'use strict';

/****************
 * Canvas logic *
 ****************/

// Canvas and painters
var canvas, context;

var painting;
var selfPainter;

var painters = {};

function setupPaintCanvas () {
  canvas = $('#paint-canvas');

  context = canvas[0].getContext('2d');
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width(), canvas.height());

  selfPainter = new UserPainter(context);

  canvas.on('mousedown', onCanvasMouseDown);
  canvas.on('mousemove', onCanvasMouseMove);
  canvas.on('mouseup', onCanvasMouseUp);
  canvas.on('mouseleave', onCanvasMouseUp);
}

function onCanvasMouseDown (event) {
  painting = true;

  var x = event.offsetX;
  var y = event.offsetY;

  selfPainter.updateCursor(x, y);
}

function onCanvasMouseMove (event) {
  if (!painting) {
    return;
  }

  var x = event.offsetX;
  var y = event.offsetY;

  selfPainter.paint(x, y);
  selfPainter.updateCursor(x, y);
}

function onCanvasMouseUp () {
  painting = false;
  selfPainter.updateCursor(undefined, undefined);
}

/*******************
 * WebSocket logic *
 *******************/

// WebSocket
var wsURL = 'ws://localhost:1881';
var connection;

function setupWebSocket () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  connection = new WebSocket (wsURL);

  // ¿Que pasa cuando la conexion se abre?
  connection.onopen = onConnectionOpen;

  // ¿Que pasa cuando la conexion tiene un error?
  connection.onerror = onConnectionError;

  // ¿Que pasa cuando recibo un mensaje del servidor?
  connection.onmessage = onConnectionMessage;
}

function onConnectionOpen () {
}

function onConnectionError () {
}

function onConnectionMessage (event) {

  // El payload es el contenido del mensaje
  var payload = event.data;

  // Parseamos el payload y lo guardamos como el mensaje
  var message = JSON.parse(payload);
  console.log(message);

  var type = message.type;
  var data = message.data;
}

$(document).ready(function () {
  setupPaintCanvas();
  setupWebSocket();
});
