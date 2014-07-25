var socket = io.connect('http://localhost:3000/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });