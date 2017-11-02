$(function () {


    console.log("logging stuff in socketStuff.js:");
    console.log(express);
    console.log(app);
    console.log(http);
    console.log(io);
    

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