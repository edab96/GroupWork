
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
            return false;
        }

    }

    alert('Invalid login credentials. Try again!');
    
}



function isUserLoggedIn() {
    if (sessionStorage.getItem('user') != null) { //If we find any user in the session storage, we set the logged in user to that one
        loggedUser = sessionStorage.getItem('user');
        return true;
    }
    else if (localStorage.getItem('user') != null) { //If we find any user in the local storage, we set the logged in user to that one
        loggedUser = localStorage.getItem('user');
        return true;
    }
    else { //Otherwise, we could not detect a logged in user
        return false; 
    }
}

function logout() { //We empty the logged in user from the both local and session storages, then we force a page refresh
    sessionStorage.removeItem('user');
    localStorage.removeItem('user'); 
    window.location.reload(false);
}

function initializeDb() {
    localMessagesDatabase = JSON.parse(localStorage.getItem('localMessagesDatabase'));
    localUsersDatabase = JSON.parse(localStorage.getItem('localUsersDatabase'));

    if (localUsersDatabase == null) {
        localUsersDatabase = [];
        joinedUsersDatabase = usersDatabase;
    }
    else {
        joinedUsersDatabase = usersDatabase.concat(localUsersDatabase);
    }   

    if (localMessagesDatabase == null) {
        localMessagesDatabase = [];
        joinedMessagesDatabase = messagesDatabase;
    }
    else {
        joinedMessagesDatabase = messagesDatabase.concat(localMessagesDatabase);
    }   
    db = new Database();
}


function verifySession() {
    if (isUserLoggedIn()) {
        // If the user is logged in, we display the "registered user" version of the menu
        document.getElementById('profile-nav').style.display = 'inline-block';
        document.getElementById('logout-nav').style.display = 'inline-block';
        document.getElementById('login-nav').style.display = 'none';
        document.getElementById('signup-nav').style.display = 'none';

        currentUser = new User(loggedUser); //We set the currentUser to the logged in user
        newNotifications = currentUser.getNotifications(); // We check if the user has new notifications
        if (newNotifications > 0) { //If yes, we display them in the HTML element
            document.getElementById('notifications-counter').innerHTML = newNotifications;
            document.getElementById('notifications-counter').style.display = 'block';
        }
        else { //If no, we hide the the HTML element
            document.getElementById('notifications-counter').innerHTML = '';
            document.getElementById('notifications-counter').style.display = 'none';
        }
    
    }
    else { // If the user is not logged in, we display the "visitor" version of the menu
        document.getElementById('profile-nav').style.display = 'none';
        document.getElementById('logout-nav').style.display = 'none';
        document.getElementById('login-nav').style.display = 'inline-block';
        document.getElementById('signup-nav').style.display = 'inline-block';

    }
}

document.addEventListener('DOMContentLoaded', function () { //This function is fired upon page load
    console.log('Page has been loaded');
    verifySession();
    initializeDb();
    toggleNotificationsDisplayTrigger = document.getElementById("notifications-trigger");
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

document.addEventListener('click', function (event) { //This function gets fired  every time the user clicks anywhere on a page
 
    var isClickInside = toggleNotificationsDisplayTrigger.contains(event.target);

    if (document.getElementById("notifications-panel").contains(event.target)) { //If the user clicks inside the notifications pop up we do nothing
        return;
    }

    if (isClickInside) { // If the user clicks on the notification menu item, then -> we hide the notification pop up
        if (notificationsBoxOpen) { //We hide the notifications pop up if it was open
            hideNotifications();
            notificationsBoxOpen = false;
        }
        else {                  //We show the notifications pop up if it was not open
            showNotifications();
            notificationsBoxOpen = true;
        }

    } else { //If the user has click anywhere else on the page rather than the previous two cases, we hide the notifications pop up
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








    