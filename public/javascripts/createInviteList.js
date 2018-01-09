function loadScripts() {


    var checkboxes = document.getElementsByName('person');
    var checkallbox = document.getElementById('checkallbox');

    checkallbox.addEventListener('click', function(e){
        console.log('checkallbox clicked');

        for (var i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = '';
        }

    })


}