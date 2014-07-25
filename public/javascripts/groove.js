var socket = io.connect('http://www.vocalet.com/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });