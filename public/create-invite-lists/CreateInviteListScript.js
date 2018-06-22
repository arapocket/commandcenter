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
                var cleanNameInput = nameInput.replace(/[^a-zA-Z0-9 ]/g, "");
                bootbox.prompt('Enter a description for the invite list.', function (descriptionInput) {
                    if (descriptionInput === null) {

                    } else {
                        var cleanDescriptionInput = descriptionInput.replace(/[^a-zA-Z0-9 ]/g, "");

                        let xhr = new XMLHttpRequest();

                        if (!xhr) {
                            alert('Giving up :( Cannot create an XMLHTTP instance');
                            return false;
                        }

                        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/postinvitelist", true);

                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            "InvitationListID": invitationListID,
                            "ListName": cleanNameInput,
                            "ListComment": cleanDescriptionInput
                        }));

                        xhr.onload = function () {
                            if (xhr.readyState === xhr.DONE) {
                                if (xhr.status === 200) {
                                    getLastInviteList();
                                }
                            }
                        };



                        bootbox.hideAll();

                        bootbox.alert('Invite list has been created!');
                    }
                });

            }
        });
    }


    function getLastInviteList() {

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("GET", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/lastinvitelist", true);

        xhr.send(null);

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            }
        };



        // for (i = 0; i < dataArray.length; i++) {

        //     postList(dataArray[i]);
        // }
    }


    function postList(person) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/postinvitee", true);

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


