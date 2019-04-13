
/*-------------------------------------------------------------------------------
// Login only related js
-------------------------------------------------------------------------------*/
function loginUser() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    for (i = 0; i < usersDatabase.length; i++) {
        if (usersDatabase[i].username == username && usersDatabase[i].password == password) {
            alert('User logged in');
            loginSuccessful = true;

            if (document.getElementById("stayLogged").checked == true) {
                localStorage.setItem('user', username); // Stores the logged user in the local storage, which does not get cleared when the browser is closed
            }
            else {
                sessionStorage.setItem('user', username); // Stores the logged user in the session storage, which gets cleared when the browser is closed
            }

            location = 'jobs.html';
            return false;
        }

    }

    alert('Invalid login credentials. Try again!');

}

document.addEventListener('DOMContentLoaded', function () {
    if (isUserLoggedIn()) {
        window.location = 'jobs.html';
    }

});