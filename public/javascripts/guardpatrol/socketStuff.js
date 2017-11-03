function socketStuff() {


    console.log("logging io");
    console.log(io);

    $(function () {

        var socket = io.connect("http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/guardpatrols");
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