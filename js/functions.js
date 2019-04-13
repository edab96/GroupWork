
//Global vars
var loggedUser = '';
var notificationsButton;
var notificationsBoxHidden = true;


/*-------------------------------------------------------------------------------
// Shared session functions
-------------------------------------------------------------------------------*/

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



function initializeDb() {
    var localMessagesDatabase = JSON.parse(localStorage.getItem('localMessagesDatabase'));
    var localUsersDatabase = JSON.parse(localStorage.getItem('localUsersDatabase'));

    if (localUsersDatabase == null) {
        console.log('No local users database has been found. Default hardcoded one will be used.');
    }
    else { /*Local storage saves class instances as plain objects. To use methods of the class "User" on our users database,
            we need to parse each user object into an instance of the class User.
            We go from:
            'usersDatabase = [  {username: 'username1', password: 'password1', ...},
                                {username: 'username2', password: 'password2', ...}
                             ];'
            To:
            'usersDatabase = [  new User('username1', 'password1', ...), 
                                new User('username2', 'password2', ...)
                             ];'
            */
        for (var i = 0; i < localUsersDatabase.length; i++) {
            localUsersDatabase[i] = new UserBeta(localUsersDatabase[i].username, localUsersDatabase[i].id, localUsersDatabase[i].email, localUsersDatabase[i].password, localUsersDatabase[i].firstName, localUsersDatabase[i].lastName, localUsersDatabase[i].sex, localUsersDatabase[i].birthDate, localUsersDatabase[i].registerDate, localUsersDatabase[i].managerOf, localUsersDatabase[i].employeeOf);
        }
        // After we have parsed the localUsersDatabase correctly, 
        // we assign it to the usersDatabase variable, overwriting the default one
        usersDatabase = localUsersDatabase;
        console.log('Local users database has been found. Default one will be overwritten.');
    }

    if (localMessagesDatabase == null) {
        console.log('No messages users database has been found. Default hardcoded one will be used.');
    }
    else { // We parse Local Storage array of objects as an array of instances of the class Message
        for (var i = 0; i < localMessagesDatabase.length; i++) {
            localMessagesDatabase[i] = new Message(localMessagesDatabase[i].id, localMessagesDatabase[i].senderId, localMessagesDatabase[i].recipientsId, localMessagesDatabase[i].text, localMessagesDatabase[i].locationId, localMessagesDatabase[i].date, localMessagesDatabase[i].seenBy);
        }
        messagesDatabase = localMessagesDatabase;
        console.log('Local messages database has been found. Default one will be overwritten.');
    }

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
        else { //If not, we hide the the HTML element
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
    initializeDb();
    verifySession();
    notificationsButton = document.getElementById("notifications-trigger");

});


/*-------------------------------------------------------------------------------
// Notification system
-------------------------------------------------------------------------------*/

function showNotifications() {
    var seenMessagesToDisplay = currentUser.getSeenMessages();
    var unseenMessagesToDisplay = currentUser.getUnseenMessages();
    console.log(unseenMessagesToDisplay);

    document.getElementById("listed-notifications-unseen").innerHTML = '';
    document.getElementById("listed-notifications-seen").innerHTML = '';

    unseenMessagesToDisplay.forEach(function (message) {
        var sender = getValueFromDb('firstName', usersDatabase, 'id', message.senderId);
        var htmlMessage = `<li class="listed-notification unseen"><p><b>${sender}</b> sent you a message: '<i>${message.text}</i></p></li>`;
        document.getElementById("listed-notifications-unseen").insertAdjacentHTML('afterbegin', htmlMessage);

        messagesDatabase.forEach(function (dbMessage) {
            if (message.id == dbMessage.id) {
                dbMessage.setToSeenBy(currentUser.id);
            }
        });
    });
    saveMessagesLocally();

    seenMessagesToDisplay.forEach(function (message) {
        var sender = getValueFromDb('firstName', usersDatabase, 'id', message.senderId);
        var htmlMessage = `<li class="listed-notification seen"><p><b>${sender}</b> sent you a message: '<i>${message.text}</i></p></li>`;
        document.getElementById("listed-notifications-seen").insertAdjacentHTML('afterbegin', htmlMessage);
    })

    document.getElementById('notifications-panel').classList.remove("hidden");
    document.getElementById('notifications-counter').style.display = 'none';

}

function hideNotifications() {
    document.getElementById('notifications-panel').classList.add("hidden");
}

document.addEventListener('click', function (event) { //This function gets fired  every time the user clicks anywhere on a page

    var clickedOnNotifications = notificationsButton.contains(event.target);


    if (document.getElementById("notifications-panel").contains(event.target)) { //If the user clicks inside the notifications pop up we do nothing
        return;
    }


    if (clickedOnNotifications) { // If the user clicks on the notification menu item, then -> we hide the notification pop up
        if (notificationsBoxHidden) { //We hide the notifications pop up if it was open
            showNotifications();
            notificationsBoxHidden = true;
        }
        else {                  //We show the notifications pop up if it was not open
            writeToLocalStorage();
            hideNotifications();
            notificationsBoxHidden = false;
        }

    } else { //If the user has click anywhere else on the page rather than the previous two cases, we hide the notifications pop up
        hideNotifications();
        notificationsBoxHidden = true;
    }

});






