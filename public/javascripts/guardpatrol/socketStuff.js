$(function () {

    console.log(io);
    console.log(http);
    console.log(app);
    
    var socket = io();
    $('form').submit(function(){
    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
    });
    socket.on('message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
    });
    });