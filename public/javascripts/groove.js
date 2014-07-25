var socket = io.connect();
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });