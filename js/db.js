// JavaScript source code



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

function getValueFromDb(property, database, key, value) {
    for (i = 0; i < database.length; i++) {
        
        if (database[i][key] == value) {
            return database[i][property];
        }
    }
}


class User {
    constructor(username) {
        this.username = username;
        this.id = getValueFromDb('id', usersDatabase, 'username', username);
        this.password = getValueFromDb('password', usersDatabase, 'username', username);
        this.firstName = getValueFromDb('name', usersDatabase, 'username', username);
        this.lastName = getValueFromDb('lastName', usersDatabase, 'username', username);

    }

    sendMessage(recipients, text, locationId) {

        var recipientsIds = [];
        recipientsIds.push(recipients);
        console.log('dbg');
        var authorId = this.id;
        var messageDate = new Date();
        var messageId = getLatestDbId(messagesDatabase) + 1;

        var messageToSend = {
            id: messageId,
            author: authorId,
            recipientsId: recipientsIds,
            locationId: locationId,
            date: messageDate

        }
        messagesDatabase.push(messageToSend);
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

    getSeenMessages() {
        var receivedMessages = this.getReceivedMessages();
        var unseenMessages = [];
        var currentUserId = this.id;
        console.log('hi');

        receivedMessages.forEach(function (singleMessage) {
            singleMessage.seen.forEach(function (seenBy) {

                if (seenBy == currentUserId) {
                    unseenMessages.push(singleMessage);
                }
            });
        });
        return unseenMessages;
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

function sortObjectsArray(objectsArray, key) {
    objectsArray.sort(function (a, b) {
        return a.key - b.key;
    });
}

function getLatestDbId(objectsArray) {
    sortObjectsArray(objectsArray, 'id');
    console.log(objectsArray[objectsArray.length - 1]);
    return objectsArray[objectsArray.length - 1].id;
    }

var locationsDatabase = [
    {
        id: 1,
        locationName: 'Forno',
        type: 1,
        address: 'Howitzvej',
        streetNumber: 1,
        city: 'Frederiksberg',
        zip: 2000
    },
    {
        id: 2,
        locationName: 'Pasta',
        type: 1,
        address: 'Fasanvej',
        streetNumber: 2,
        city: 'Frederiksberg',
        zip: 2000
    }

];

var jobsDatabase = [
    {
        id: 1, //Unique ID
        locationId: 2,
        locationName: "Some cafe", //Name of the restaurant
        locationType: "Cafe", //Whether Restaurant, Fast-food, Cafe,
        position: "Bartender", //Name of the open position
        type: "Full-Time", //Either Full-Time or Part-Time
        address: "Howitzvej", //Street name
        streetNumber: 60, //streetNumber number
        city: "Frederiksberg",
        zip: "2000",
        creationDate: "Fri Mar 01 2019 16:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "Mon Apr 01 2019 20:30:12 GMT+0100", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "We are looking for... ", // Optional, longer description for the modal
    },
    {
        id: 2, //Unique ID
        locationId: 2,
        locationName: "Some Restaurant", //Name of the restaurant
        locationType: "Restaurant", //Whether Restaurant, Fast-food, Cafe,
        position: "Cook", //Name of the open position
        type: "Part-Time", //Either Full-Time or Part-Time
        address: "Howitzvej", //Street name
        streetNumber: "602", //streetNumber number
        city: "Frederiksberg2",
        zip: "2000",
        creationDate: "Fri Mar 01 2019 10:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "Tue Apr 02 2019 20:30:12 GMT+0100", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "We are looking for... ", // Optional, longer description for the modal
    },

    {
        id: 3, //Unique ID
        locationId: 3,
        locationName: "Some Fast-Food", //Name of the restaurant
        locationType: "Fast-Food", //Whether Restaurant, Fast-food, Cafe,
        position: "Cook", //Name of the open position
        type: "Part-Time", //Either Full-Time or Part-Time
        address: "Fasanvej", //Street name
        streetNumber: "1", //streetNumber number
        city: "Frederiksberg",
        zip: "2000",
        creationDate: "Thu Mar 14 2019 10:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "0", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "We are looking for... ", // Optional, longer description for the modal
    }
];

var messagesDatabase = [ 
    {
        id: 1, //Unique id of the message
        senderId: 1, //Id of the sending user
        recipientsId: [2, 3], //Id(s) of the recipients
        locationId: '',
        date: '',
        seen: []

    }
]