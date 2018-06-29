function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function () {
        backButtonPressed();
    })

    var yesButton = document.getElementById('yesButton');
    yesButton.addEventListener('click', function () {
        yesButtonPressed();
    })

    var noButton = document.getElementById('noButton');
    noButton.addEventListener('click', function () {
        noButtonPressed();
    })


    var groupCategoryDropdown = document.getElementById('groupCategoryDropdown');

    var groupNameDropdown = document.getElementById('groupNameDropdown');

    var header = document.getElementById('header')
    
    var comment = document.getElementById('comment')

    var question = 0;

    var groupCategory = '';

    var groupName = '';

    var yesSelected = false;

    var peopleList = [];

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function yesButtonPressed(){
        yesSelected = true;
        checkOption();
    }

    function noButtonPressed(){
        yesSelected = false;
        checkOption();
    }

    function backButtonPressed(){
        question--;
        checkQuestion();
    }

    function buttonPressed(){
        
        if (question ==1) {
            if (groupCategoryDropdown.value == ''){
                bootbox.alert('Please select a choice from the dropdown.')
            } else {
                question ++
                checkQuestion();
            }
        } else if (question ==3){
            if (groupNameDropdown.value == ''){
                bootbox.alert('Please select a choice from the dropdown.')
            } else {
                question ++
                checkQuestion();
            }
        } else {
            question++;
            checkQuestion();
        }
    }

    function checkQuestion(){
        if (question ==0){
            groupCategoryDropdown.style.display = 'none';
            backButton.style.display = 'none'

            button.innerText = 'Begin'
            comment.innerText = 'You can follow this wizard to quickly create an invite list.'
        } 
        else if (question == 1 ){
            groupCategoryDropdown.style.display = 'block';
            backButton.style.display = 'block';
            button.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'

            button.innerText = 'Next'
            comment.innerText = 'What do you want to add to the list?'
        } else if (question == 2){
            groupCategoryDropdown.style.display = 'none';
            groupNameDropdown.style.display = 'none';
            backButton.style.display = 'block';
            button.style.display = 'block';

            button.innerText = 'Next'
            comment.innerText = 'You are making a list for a ' + groupCategoryDropdown.value + '.';
            groupCategory = groupCategoryDropdown.value;
        } else if (question == 3){

            getGroups();

            backButton.style.display = 'block'
            button.style.display = 'block';
            groupNameDropdown.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'

            comment.innerText = 'Which ' + groupCategory + ' do you want to add?'
        } else if (question == 4){
            groupName = groupNameDropdown.value;
            getPeople();

            backButton.style.display = 'none'
            button.style.display = 'none';
            groupNameDropdown.style.display = 'none';
            noButton.style.display = 'block'
            yesButton.style.display = 'block'

            comment.innerText = 'Do you want to add any other groups?'
        } else if (question == 5){
            noButton.style.display = 'none'
            yesButton.style.display = 'none'
            prompt();
        }
    }

    function checkOption(){

        console.log(question);
        console.log(yesSelected);

        if (question == 4) {
            if (yesSelected) {
                question = 1;
                checkQuestion();
            } else {
                question++;
                checkQuestion();
            }
        }
    }

    function getGroups(){
        if (groupCategory == 'Department'){

            for (i = groupNameDropdown.options.length - 1 ; i >= 0; i--){
                groupNameDropdown.remove(i);
            }

            for (i = 0 ; i < departments.length; i++){
                var option = document.createElement("option");
                option.text = departments[i].Department;
                option.value = departments[i].Department;
                groupNameDropdown.appendChild(option);
            }

                
        } else if (groupCategory =='Division'){

            for (i = groupNameDropdown.options.length - 1 ; i >= 0; i--){
                groupNameDropdown.remove(i);
            }

            for (i = 0 ; i < divisions.length; i++){
                var option = document.createElement("option");
                option.text = divisions[i].Division;
                option.value = divisions[i].Division;
                groupNameDropdown.appendChild(option);
            }            

        } else if (groupCategory =='Site Location'){

            for (i = groupNameDropdown.options.length - 1 ; i >= 0; i--){
                groupNameDropdown.remove(i);
            }

            for (i = 0 ; i < siteLocations.length; i++){
                var option = document.createElement("option");
                option.text = siteLocations[i].SiteLocation;
                option.value = siteLocations[i].SiteLocation;
                groupNameDropdown.appendChild(option);
            }    

        } else if (groupCategory == 'Building'){

            for (i = groupNameDropdown.options.length - 1 ; i >= 0; i--){
                groupNameDropdown.remove(i);
            }

            for (i = 0 ; i < buildings.length; i++){
                var option = document.createElement("option");
                option.text = buildings[i].Building;
                option.value = buildings[i].Building;
                groupNameDropdown.appendChild(option);
            }    

        }
    }

    function getPeople(){

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("GET", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/invitelistcreator/" + groupCategory + '/' + groupName , true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);
                    
                    for (i = 0; i< json.length ; i++){
                        peopleList.push(json[i]);
                    }

                    console.log(peopleList);

                }
            }
        };

    }

    function postInvites(){

    }

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
                    var json = JSON.parse(xhr.responseText);
                    console.log(json);
                    var listID = json[0].InvitationListID;
                    for (i = 0; i < peopleList.length; i++) {

                        postList(peopleList[i], listID);
                    }
                }
            }
        };
    }

    function postList(person, listID) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/postinvitee", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'InvitationListID': listID,
            'BadgeNumber': person.iClassNumber,
            'LastName': person.LastName,
            'FirstName': person.FirstName,
            'EmailAddress': person.EmailAddr

        }));


        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    question == 0;
                    checkQuestion();            
                }
            }
        };


    }

}


