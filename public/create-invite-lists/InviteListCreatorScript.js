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
            if (groupNameDropdown.value == 'Choose...'){
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
            
            comment.innerText = 'Titties';
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

            for (i = 0 ; i < departments.length; i++){
                var option = document.createElement("option");
                option.text = departments[i].Department;
                option.value = departments[i].Department;
                groupNameDropdown.appendChild(option);
            }

                
        } else if (groupCategory =='Division'){

        } else if (groupCategory =='Site Location'){

        } else if (groupCategory == 'Building'){

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
                    bootbox.alert(xhr.responseText);
                }
            }
        };

    }

}


