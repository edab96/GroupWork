
//Global vars
var loggedUser = '';
var toggleNotificationsDisplayTrigger;
var notificationsBoxOpen = false;

/*-------------------------------------------------------------------------------
// Login and session functions
-------------------------------------------------------------------------------*/

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

function logOut() {
    localStorage.removeItem('user');
}

function verifySession() {
    if (isUserLoggedIn()) {
        document.getElementById('profile-nav').style.display = 'block';
        document.getElementById('login-nav').style.display = 'none';
        console.log(`Currently logged in as: ${loggedUser}`);
        console.log('Local storage: ' + localStorage.getItem('user' + ' Session storage: ' + sessionStorage.getItem('user')));
        currentUser = new User(loggedUser);
        newNotifications = currentUser.getNotifications(); // We check if the user has new notifications
        if (newNotifications > 0) {
            document.getElementById('notifications-counter').innerHTML = newNotifications;
            document.getElementById('notifications-counter').style.display = 'block';
        }
        else {
            document.getElementById('notifications-counter').innerHTML = '';
            document.getElementById('notifications-counter').style.display = 'none';
        }


    }
    else {
        document.getElementById('profile-nav').style.display = 'none';
        document.getElementById('login-nav').style.display = 'block';

    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Page has been loaded');
    verifySession();
    db = new Database();
    toggleNotificationsDisplayTrigger = document.getElementById("notifications-trigger");

    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    }
    catch (e) {
        return false;
    }


});


/*-------------------------------------------------------------------------------
// Notification system
-------------------------------------------------------------------------------*/

function showNotifications() {
    document.getElementById('notifications-panel').classList.remove("hidden");
    document.getElementById('notifications-counter').style.display = 'none';

    document.getElementById("listed-notifications").innerHTML = '';
    var messagesToDisplay = currentUser.getUnseenMessages();
    messagesToDisplay.forEach(function (message) {
        var sender = getValueFromDb('name', usersDatabase, 'id', message.senderId);
        var htmlMessage = `<li class="listed-notification unseen"><p><b>${sender}</b> sent you a message: '<i>${message.text}</i></p></li>`;
        document.getElementById("listed-notifications").insertAdjacentHTML('afterbegin', htmlMessage);
    })
}

function hideNotifications() {
    document.getElementById('notifications-panel').classList.add("hidden");
}

document.addEventListener('click', function (event) {
    //console.log('clicked');

    var isClickInside = toggleNotificationsDisplayTrigger.contains(event.target);

    if (document.getElementById("notifications-panel").contains(event.target)) {
        return;

    }

    if (isClickInside) {
        if (notificationsBoxOpen) {
            hideNotifications();
            notificationsBoxOpen = false;
        }
        else {
            showNotifications();
            notificationsBoxOpen = true;
        }

    } else {
        hideNotifications();
        notificationsBoxOpen = false;
    }
});




/*-------------------------------------------------------------------------------
// Jobs page
-------------------------------------------------------------------------------*/
var jobDisplayOptions = {
    date: "latest", //latest(default), oldest
    type: "All", //Any(default), Full-Time, Part-Time
};

function openJobModal(jobId, employerId, locationId, title, description, address, streetNumber, zip) {
    document.getElementById('modal-job-title').innerHTML = title;
    document.getElementById('modal-description').innerHTML = description;
    document.getElementById('gmap_canvas').src = 'https://maps.google.com/maps?q=' + address + '%20' + streetNumber + '%20' + zip + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
    if (isUserLoggedIn()) { //If the visitor is a logged in user ->
        document.getElementById('modal-apply').style.display = 'inline-block'; //We show the "Apply now" button in the jobs modal
        document.getElementById('modal-login-redirect').style.display = 'none'; //We show the "Apply now" button in the jobs modal

        document.getElementById('modal-apply').onclick = function () {
            console.log('Applying at ' + locationId + ' manager is: ' + employerId);
            currentUser.applyForJob(jobId, employerId, locationId);
        }

    }
    else { //Otherwise, if the visitors is not logged in, we do the opposite
        document.getElementById('modal-apply').style.display = 'none';
        document.getElementById('modal-login-redirect').style.display = 'inline-block';
    }

    document.body.classList.add('modal-open');
    document.getElementById('jobs-modal').style.display = 'block';
}

function closeJobModal() {
    document.getElementById('jobs-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('job-modal-main').style.display = 'block';
    document.getElementById('job-modal-success').style.display = 'none';

}








    