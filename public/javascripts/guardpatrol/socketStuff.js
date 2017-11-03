function socketStuff() {


    console.log("logging io");
    console.log(io);
    console.log("logging fuck");
    console.log(fuck);
    

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