function loadScripts() {

    console.log('loadScripts called');

    var checkboxes = [];

    for (i = 0; i < results.length; i++) {

        let person = results[i];
        let checkbox = document.getElementById(person.EmpID);

        if (checkbox != null || checkbox != undefined) {

            checkbox.addEventListener('click', function (e) {
                console.log('a checkbox clicked');
            })

            checkboxes.push(checkbox);
        }
    }

    var headerCheckBoxAdded = document.getElementById('headerCheckBoxAdded');

    try {
        headerCheckBoxAdded.addEventListener('click', function (e) {
            console.log('headerCheckBoxAdded clicked');

            console.log('logging checkboxes array');
            console.log(checkboxes);

            if (headerCheckBoxAdded.hasAttribute('checked')) {
                headerCheckBoxAdded.removeAttribute('checked');

                console.log('has attribute');
                for (i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].removeAttribute('checked');

                }
            } else {
                headerCheckBoxAdded.setAttribute('checked', '');

                console.log('doesnt haz attribute');
                for (i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].setAttribute('checked', '');
                }
            }



        })
    } catch (e) {
        console.log(e);
    }

    var addButton = document.getElementById('addButton');
    addButton.addEventListener('click', function (e) {
        addButtonPressed();
    });

    var removeButton = document.getElementById('removeButton');
    removeButton.addEventListener('click', function (e) {
        removeButtonPressed();
    });

    function addButtonPressed() {
        console.log('addButtonPressed');
    }

    function removeButtonPressed() {
        console.log('removeButtonPressed');
    }

}