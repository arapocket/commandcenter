function loadScripts() {

    var createButton = document.getElementById('createButton');
    var invitationListID = ''
    createButton.addEventListener('click', function () {
        console.log('logging dataArray')
        console.log(dataArray);
        invitationListID = createID();

        prompt();

    })


    function prompt() {
        bootbox.hideAll();

        bootbox.prompt("Enter a name for the invite list.", function (nameInput) {
            if (nameInput === null) {
            } else {
                let cleanNameInput = nameInput.replace(/[^a-zA-Z0-9 ]/g, "");
                bootbox.prompt('Enter a description for the invite list.', function (descriptionInput) {
                    if (descriptionInput === null) {

                    } else {
                        let cleanDescriptionInput = descriptionInput.replace(/[^a-zA-Z0-9 ]/g, "");

                        let xhr = new XMLHttpRequest();

                        if (!xhr) {
                            alert('Giving up :( Cannot create an XMLHTTP instance');
                            return false;
                        }

                        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/saveroute", true);

                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            "InvitationListID": invitationListID,
                            "ListName": cleanNameInput,
                            "ListComment": cleanDescriptionInput
                        }));

                        for (i = 0; i < dataArray.length; i++) {

                            postList(dataArray[i]);
                        }

                        bootbox.hideAll();

                        bootbox.alert('Invite list has been created!');
                    }
                });

            }
        });
    }


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


