var socket = io.connect('http://vocalet.com:5000/');
socket.on('data', function (data) {
    $("#current").text(data.cur);
 });