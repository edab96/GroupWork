//In this file:

/**
    * Databases
    * ------
    * Databases functions
* */

/*-------------------------------------------------------------------------------
// Databases
-------------------------------------------------------------------------------*/
var usersDatabase = [
    new User('username', 1, 'username@username.com', 'username', 'FirstName', 'LastName', 'Male', 'Mon Jan 1 1990', 'Sat, 13 Apr 2019 09:06:10 GMT+0100', [], []),
    new User('manager', 2, 'username@username.com', 'manager', 'FirstName', 'LastName', 'Male', 'Mon Jan 1 1990', 'Sat, 13 Apr 2019 09:06:10 GMT+0100', [1,2,3], [])
];

var locationsDatabase = [
    new Location(1, 'Fish place', 1, 'Howitzvej', 1, 'Frederiksberg', 2000),
    new Location(2, 'Cocktails place', 1, 'Fasanvej', 1, 'Frederiksberg', 2000),
    new Location(3, 'Pizza place', 1, 'Smallegade', 1, 'Frederiksberg', 2000)
];

var jobsDatabase = [
    new Job(1, 2, 'Bartender', 'Full-Time', 'Fri Mar 01 2019 16:21:12 GMT+0100', 'Wed Aug 21 2019 20:30:12 GMT+0100', 'We are looking for... '),
    new Job(2, 3, 'Cook', 'Part-Time', 'Thu Mar 07 2019 10:21:12 GMT+0100', 'Tue Apr 02 2019 20:30:12 GMT+0100', 'We are looking for... '),
    new Job(3, 1, 'Cook', 'Part-Time', 'Thu Mar 14 2019 10:21:12 GMT+0100', '0', 'We are looking for... '),
];

var messagesDatabase = [
    new Message(1, 1, [1, 2], 'Hello, this is a first test messsage.', '', '', []),
    new Message(2, 1, [1, 2], 'Hello, this is a second test messsage.', '', '', [])
];

/*-------------------------------------------------------------------------------
// Database functions
-------------------------------------------------------------------------------*/

function writeToLocalStorage(objectToWrite, key) {
    localStorage.setItem(key, JSON.stringify(objectToWrite));
}

function saveMessagesLocally() {
    localStorage.setItem('localMessagesDatabase', JSON.stringify(messagesDatabase));
}

function saveUsersLocally() {
    localStorage.setItem('localUsersDatabase', JSON.stringify(usersDatabase));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function getObject(database, id) {
    for (i = 0; i < database.length; i++) {
        if (database[i].id == id) {
            return database[i];
        }
    }
}

function getValueFromDb(property, database, key, value) {
    for (i = 0; i < database.length; i++) {

        if (database[i][key] == value) {
            return database[i][property];
        }
    }
}

/*function getLocationManager(locationId) {
    for (var i = 0; i < usersDatabase.length; i++) {
        var user = usersDatabase[i];
        for (var j = 0; j < user.managerOf.length; j++) {
            managedLocation = user.managerOf[j];
            if (managedLocation == locationId) {
                return user;
            }
        }

    }*/

function getLocationManager(locationId) {
    var matchedUser;
    usersDatabase.forEach(function (user) {
        user.managerOf.forEach(function (managedLocation) {
            if (managedLocation == locationId) {
                matchedUser = user;
            }
        })
    });
    return matchedUser;
}

function sortObjectsArray(objectsArray, key) {
    objectsArray.sort(function (a, b) {
        return a.key - b.key;
    });
}

function getLatestDbId(objectsArray) {
    sortObjectsArray(objectsArray, 'id');
    return objectsArray[objectsArray.length - 1].id;
}
