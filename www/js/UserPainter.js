'use strict';

(function (global) {

  var UserPainter = function (context) {
    this.context = context;
    this.cursor  = {};
    this.color   = '#000000';
  };

  UserPainter.prototype.updateCursor = function (x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
  };

  UserPainter.prototype.paint = function (x, y) {
    if (!this.cursor.x || !this.cursor.y) {
      return;
    }

    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.moveTo(this.cursor.x, this.cursor.y);
    this.context.lineTo(x, y);
    this.context.stroke();
  };

  UserPainter.prototype.sendCursorThrough = function (connection) {
    var message = {
      x     : this.cursor.x,
      y     : this.cursor.y,
      color : this.color
    };

    connection.send(JSON.stringify(message));
  };

  global.UserPainter = UserPainter;
})(this);
