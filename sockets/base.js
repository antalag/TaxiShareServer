module.exports = function (io) {
  'use strict';
  io.on('connection', function (socket) {
    socket.on('message', function (from, msg,to    ) {
      io.sockets.emit('broadcast:'+to, {
        payload: msg,
        source: from,
      });
      io.sockets.emit('broadcast:'+from, {
        payload: msg,
        source: from,
      });
    });
  });
};
