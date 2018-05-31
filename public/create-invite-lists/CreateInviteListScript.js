function loadScripts() {

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