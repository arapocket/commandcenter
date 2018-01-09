function toggle(source) {

    console.log('toggle this called');

    checkboxes = document.getElementsByName('person');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = '';
    }
}