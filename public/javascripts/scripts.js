function confirmDelete() {
    return confirm('Are you sure you want to delete this?')
}

function comparePasswords() {
    var pw1 = document.getElementById('password').value;
    var pw2 = document.getElementById('confirm').value;
    var msg = document.getElementById('pwMsg')
    if (pw1 != pw2) {
        pwMsg.innerText = "Passwords do not match"
        pwMsg.className = "text-danger"
        return false;
    }
    else {
        pwMsg.innerText = '';
        pwMsg.className = '';
        return true;
    }
}