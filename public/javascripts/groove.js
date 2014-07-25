var socket = io.connect('http://www.vocalet.com:3000/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });