function loadScripts() {

    var createButton = document.getElementById('createButton');

    createButton.addEventListener('click', function () {
        console.log('logging dataArray')
        console.log(dataArray);

        for (i = 0 ; i < dataArray.length ; i++) {
            postList(dataArray[i]);
        }

        
    })





    function postList(person) {

        console.log(person);
        
        // var xhr = new XMLHttpRequest();

        // if (!xhr) {
        //     alert('Giving up :( Cannot create an XMLHTTP instance');
        //     return false;
        // }

        // xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/createinvitelist", true);

        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(JSON.stringify({
        //     'InvitationListID': 999,
        //     'BadgeNumber': person.iClassNumber  
        // }));
    }

}


