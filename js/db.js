//In this file:

/**
    * Databases
    * ------
    * Databases functions
    * ------
    * Classes
* */

/*-------------------------------------------------------------------------------
// Databases
-------------------------------------------------------------------------------*/
var localUsersDatabase = [];
var localMessagesDatabase = [];
var joinedMessagesDatabase = [];
var joinedUsersDatabase = [];


var usersDatabase = [
    {
        id: 1,
        username: 'employeeUsername',
        password: 'password',
        name: 'Name',
        lastName: 'Lastname',
        birthDate: 'Wed Aug 21 1996 17:00:12 GMT+0100',
        sex: 'Male',
        registerDate: 'Fri Mar 01 2019 16:21:12 GMT+0100',
        managing: [],
        employed: []
    },

    {
        id: 2,
        username: 'managerUsername',
        password: 'password',
        name: 'Name',
        lastName: 'Lastname',
        birthDate: 'Wed Aug 21 1996 17:00:12 GMT+0100',
        sex: 'Male',
        registerDate: 'Fri Mar 01 2019 16:21:12 GMT+0100',
        managing: [1],
        employed: []
    },
    {
        id: 3,
        username: 'username',
        password: 'password',
        name: 'Name',
        lastName: 'Lastname',
        birthDate: 'Wed Aug 21 1996 17:00:12 GMT+0100',
        sex: 'Male',
        registerDate: 'Fri Mar 01 2019 16:21:12 GMT+0100',
        managing: [],
        employed: []
    }

];

var locationsDatabase = [
    {
        id: 1,
        locationName: 'Fish place',
        category: 1,
        managedBy: 1,
        address: 'Howitzvej',
        streetNumber: 1,
        city: 'Frederiksberg',
        zip: 2000
    },
    {
        id: 2,
        locationName: 'Cocktails Place',
        category: 1,
        managedBy: 1,
        address: 'Fasanvej',
        streetNumber: 2,
        city: 'Frederiksberg',
        zip: 2000
    },
    {
        id: 3,
        locationName: 'Pizza Place',
        category: 1,
        managedBy: 1,
        address: 'Smallgade',
        streetNumber: 2,
        city: 'Frederiksberg',
        zip: 2000
    }

];

var jobsDatabase = [
    {
        id: 1, //Unique ID of the job
        locationId: 2,
        position: "Bartender", //Name of the open position
        type: "Full-Time", //Either Full-Time or Part-Time
        creationDate: "Fri Mar 01 2019 16:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "Mon Apr 01 2019 20:30:12 GMT+0100", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "We are looking for... ", // Optional, longer description for the modal
    },
    {
        id: 2,
        locationId: 3,
        position: "Cook", 
        type: "Part-Time", 
        creationDate: "Fri Mar 01 2019 10:21:12 GMT+0100", 
        startingDate: "Tue Apr 02 2019 20:30:12 GMT+0100", 
        image: "", 
        fullDescription: "We are looking for... ", 
    },

    {
        id: 3, 
        locationId: 1,
        position: "Cook",
        type: "Part-Time",
        creationDate: "Thu Mar 14 2019 10:21:12 GMT+0100",
        startingDate: "0",
        image: "",
        fullDescription: "We are looking for... ",
    }
];

var messagesDatabase = [
    {
        id: 1, //Unique id of the message
        senderId: 1, //Id of the sending user
        recipientsId: [2, 3], //Id(s) of the recipients
        text: 'Hello, this is a test message.',
        locationId: '',
        date: '',
        seen: []

    }
];



/*-------------------------------------------------------------------------------
// Functions
-------------------------------------------------------------------------------*/

function writeToLocalStorage(itemToWrite, key) {
    localStorage.setItem(key, JSON.stringify(itemToWrite));
}

function getFromLocalStorage(itemToWrite, key) {
    return JSON.parse(localStorage.getItem(key));
}


function getValueFromDb(property, database, key, value) {
    for (i = 0; i < database.length; i++) {
        
        if (database[i][key] == value) {
            return database[i][property];
        }
    }
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

/*-------------------------------------------------------------------------------
// Classes
-------------------------------------------------------------------------------*/
class User {
    constructor(username) {
        this.username = username;
        this.id = getValueFromDb('id', joinedUsersDatabase, 'username', username);
        this.password = getValueFromDb('password', joinedUsersDatabase, 'username', username);
        this.firstName = getValueFromDb('name', joinedUsersDatabase, 'username', username);
        this.lastName = getValueFromDb('lastName', joinedUsersDatabase, 'username', username);

    }

    sendMessage(recipients, text, locationId) {

        var recipientsIds = [];
        recipientsIds.push(recipients);
        console.log('dbg');
        if (locationId == '') {
            locationId = null;
        }
        var authorId = this.id;
        var messageDate = new Date();
        var messageId = getLatestDbId(messagesDatabase) + 1;

        var messageToSend = {
            id: messageId,
            author: authorId,
            recipientsId: recipientsIds,
            text: text,
            locationId: locationId,
            date: messageDate

        }
        joinedMessagesDatabase.push(messageToSend);
        writeToLocalStorage(localMessagesDatabase, 'localMessagesDatabase');

    }

    
    getReceivedMessages() {
        var receivedMessages = [];
        var currentUserId = this.id;
        messagesDatabase.forEach(function (singleMessage) {
            singleMessage.recipientsId.forEach(function (recipient) {

                if (recipient == currentUserId) {
                    receivedMessages.push(singleMessage);
                }
            })
            
        
        });
        return receivedMessages;
    }


    applyForJob(jobId, employerId, locationId) {
        console.log('Location id is ' + locationId);
        var locationName = getValueFromDb('locationName', locationsDatabase, 'id', locationId);
        var employerName = getValueFromDb('name', usersDatabase, 'id', employerId);
        var jobPosition = getValueFromDb('position', jobsDatabase, 'id', jobId);
        this.sendMessage([employerId], `Hello ${employerName}, I would like to apply as a ${jobPosition} at ${locationName}.`, locationId);
        console.log(`Succesfully applied at ${locationName}`);
        document.getElementById('job-modal-main').style.display = 'none';
        document.getElementById('job-modal-success').style.display = 'block';
    }


    getUnseenMessages() {
        var receivedMessages = this.getReceivedMessages();
        var unseenMessages = [];
        var messageSeenByUser = false; //Dummy variable
        var currentUserId = this.id;
        receivedMessages.forEach(function (singleMessage) {
            singleMessage.seen.forEach(function (seenBy) {

                if (seenBy == currentUserId) {
                    messageSeenByUser = true;
                }
            });

            if (!messageSeenByUser) {
                unseenMessages.push(singleMessage);
            }
            messageSeenByUser = false; // Dummy variable reset for the next loop
       
        });
        return unseenMessages;
    }

    getSeenMessages() {
        var receivedMessages = this.getReceivedMessages();
        var seenMessages = [];
        var currentUserId = this.id;
        receivedMessages.forEach(function (singleMessage) {
            singleMessage.seen.forEach(function (seenBy) {

                if (seenBy == currentUserId) {
                    seenMessages.push(singleMessage);
                }
            });
        });
        return seenMessages;
    }

    getNotifications() {
        var notifications = 0;
        var currentUserId = this.id;
        var messages = this.getReceivedMessages();
        messages.forEach(function (singleMessage) {
            notifications++;
            singleMessage.seen.forEach(function (seenBy) {
                if (seenBy == currentUserId) {
                    notifications--;
                }
            })
        })
        return notifications;
    }
}


class Database { // This class is used to store data either in the local or in the session storage. 
    //The HTML Storage is fully supported in Chrome, but it may not be in other browsers.
    // Local and Session storages will be used to store user input data in the absence of a proper database system such as MySql.
    // The stored data will be unique to the browser that has been used to open the website. This database is not centralized.
    constructor() {
        this.usersDatabase = usersDatabase; //Hardcoded user database from db.js
        this.locationsDatabase = locationsDatabase; //Hardcoded location database from db.js
        this.jobsDatabase = jobsDatabase; //Hardcoded jobs database from db.js

        this.sessionStorage = sessionStorage; //Session storage gets cleared when the browser closes
        this.localStorage = localStorage; //Local storage is persistent on the browser used to open the website
    }

    getLocation(locationId) {
        for (var i = 0; i < locationsDatabase.length; i++) {
            if (locationsDatabase[i].id == locationId) {
                return locationsDatabase[i];
            }
        }
            }
    createLocation() {
        locationId = getLatestDbId(this.locationsDatabase) + 1; //Generates a new ID for the location to create. It does do by taking the highest ID the the database and increasing it by 1.

    }

    createJobListing(locationId, position, positionType, startingDate, fullDescription) {
        var newJobId = getLatestDbId(this.jobsDatabase) + 1; //Generates a new ID for the job to create. It does do by taking the highest ID the the database and increasing it by 1.
        var creationDate = new Date();

        var createdJob = {
            id: newJobId, //Unique ID of the job
            locationId: locationId,
            type: positionType, //Either Full-Time or Part-Time
            creationDate: creationDate,
            startingDate: startingDate, //Javascript Date object. It is the date of job start
            image: "",
            fullDescription: fullDescription // Longer description for the jobs modal
        }

        jobsDatabase.push(createdJob);
        this.localStorage.setItem('persistentJobsDatabase', JSON.stringify(jobsDatabase));

    }

 }


//Deprecated
/*class Location {
    constructor(locationId) {
        this.locationId = locationId;
    }

    getLocation()
    {
        for (i = 0; i < locationsDatabase.length(); i++) { //We loop through every object in the locationsDatabase array
            if (locationsDatabase[i].locationId == this.locationId) { //If the location id of the location we are looping through matches the constructor location id, we have a match
                return locationsDatabase[i]; // We return the matched 
            }
        }

        return false; // No locations have been found that match the input location Id. The method returns false
    }
    
}*/