function loadScripts() {

    var createButton = document.getElementById('createButton');
    var invitationListID = ''
    createButton.addEventListener('click', function () {
        console.log('logging dataArray')
        console.log(dataArray);
        invitationListID = createID();

        for (i = 0 ; i < dataArray.length ; i++) {
            postList(dataArray[i]);
        }

        
    })





    function postList(person) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/createinvitelist", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'InvitationListID': invitationListID,
            'BadgeNumber': person.Cardnumber,
            'LastName': person.LastName,
            'FirstName': person.FirstName,
            'EmailAddress': person.EmailAddress

        }));
    }

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

}


