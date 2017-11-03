function socketStuff() {


    console.log("logging io");
    console.log(io);
    console.log("logging http");
    console.log(httpForSocket);

    httpForSocket.listen(3001, function () {
        console.log('listening on *:3001');
    });

    $(function () {

        var socket = io();
        $('form').submit(function () {
            socket.emit('message', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('message', function (msg) {
            $('#messages').append($('<li>').text(msg));
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

}