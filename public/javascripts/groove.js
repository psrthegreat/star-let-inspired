var socket = io.connect('http://localhost:5000/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });