// JavaScript source code

//Global vars
var loggedUser = '';

var jobDisplayOptions = {
    date: "latest", //latest(default), oldest
    type: "All", //Any(default), Full-Time, Part-Time
};

function loginUser() {

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var loginSuccessful = false;

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


            location = 'home.html';
        }

    }

    if (loginSuccessful !== true) {
        alert('Invalid login credentials. Try again!');
    }

}



function isUserLoggedIn() {
    if (sessionStorage.getItem('user') != null) {
        loggedUser = sessionStorage.getItem('user');
        return true;
    }
    else if (localStorage.getItem('user') != null) {
        loggedUser = localStorage.getItem('user');
        return true;
    }
    else {
        return false;
    }
}



function verifySession() {
    if (isUserLoggedIn()) {
        document.getElementById('profile-nav').style.display = 'block';
        document.getElementById('login-nav').style.display = 'none';
        console.log(`Currently logged in as: ${loggedUser}`);
        console.log('Local storage: ' + localStorage.getItem('user' + ' Session storage: ' + sessionStorage.getItem('user');));
    }
    else {
        document.getElementById('profile-nav').style.display = 'none';
        document.getElementById('login-nav').style.display = 'block';

    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Page has been loaded');
    verifySession();

});