function socketStuff() {


    console.log("logging io");
    console.log(io);

    $(function () {


        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };
        

        var socket = io("http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/guardpatrols", connectionOptions);        
        console.log("logging socket");
        console.log(socket);
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