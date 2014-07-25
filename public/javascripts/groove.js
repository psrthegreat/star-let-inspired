var socket = io.connect('vocalet.com/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });