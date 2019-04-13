
/*-------------------------------------------------------------------------------
// Sign up only related js
-------------------------------------------------------------------------------*/
var isNameValid = false;
var isUsernameValid = false;
var isEmailValid = false;
var isPasswordValid = false;


function validateName(input) {
    var feedback = document.getElementById('name-input-feedback');

    if (input.value.length < 4) {
        feedback.innerHTML = 'This field needs to be longer than 4 characters'
        input.style.border = '1px solid #e7a3a3';
        isNameValid = false;
    }
    else if (/\d/.test(input.value)) {
        feedback.innerHTML = 'This field cannot contain numbers.'
        isNameValid = false;
    }
    else {
        feedback.innerHTML = ''
        input.style.border = '';
        isNameValid = true;
    }
}


function validateEmail(input) {
    var feedback = document.getElementById('email-input-feedback');

    document.getElementById('email').value.indexOf('.')
    if (input.value.length < 4 || (input.value.indexOf('.') == -1) || (input.value.indexOf('@') == -1) || (input.value[input.value.length - 1] == '.') || (input.value[input.value.length - 2] == '.')) {
        feedback.innerHTML = 'This is not a valid email.';
        isEmailValid = false;
    }
    else {
        feedback.innerHTML = '';
        input.style.border = '';
        isEmailValid = true;
    }
}

function validateUsername(input) {
    var feedback = document.getElementById('username-input-feedback');

    if (input.value.length < 5) {
        feedback.innerHTML = 'Username must be longer than 5 characters.';
        isUsernameValid = false;
    }
    else {
        feedback.innerHTML = '';
        input.style.border = '';
        isUsernameValid = true;
    }
}

function validatePassword(input) {
    var feedback = document.getElementById('password-input-feedback');

    if (input.value.length < 8) {
        feedback.innerHTML = 'Password must be at least 8 characters long.';
        isPasswordValid = false;
    }
    else {
        feedback.innerHTML = '';
        input.style.border = '';
        isPasswordValid = true;
    }
}
function signupUser() {
    var feedback = document.getElementById('registration-feedback');

    var firstName = document.getElementById('firstname').value;
    var lastName = document.getElementById('lastname').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var sex = document.getElementById('sex-select').value;
    var birthDate = new Date(document.getElementById('birthDate-select').value);
    var id = getLatestDbId(usersDatabase) + 1;
    var today = new Date();

    if (document.getElementById('signup-tos').checked == false) {
        feedback.innerHTML = 'You need to accept TOS in order to sign up!';
    }
    else if (!isNameValid || !isUsernameValid || !isPasswordValid) {
        feedback.innerHTML = 'Please complete all fields correctly';
    }

    else {
        usersDatabase.push(new UserBeta(username, id, email, password, firstName, lastName, sex, birthDate, today, new Array(), new Array()));
        localStorage.setItem('localUsersDatabase', JSON.stringify(usersDatabase));
        sessionStorage.setItem('user', username);

        feedback.innerHTML = '';
        feedback.style.color = 'green';
        feedback.innerHTML = 'Succesfully signed up!<br>You will be redirected in some seconds.';
        setTimeout(function () { window.location = 'jobs.html'; }, 3000);
    }

}


document.addEventListener('DOMContentLoaded', function () {
    if (isUserLoggedIn()) {
        window.location = 'jobs.html';
    }

});