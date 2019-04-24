
/*-------------------------------------------------------------------------------
// Classes
-------------------------------------------------------------------------------*/


class User {
    constructor(username, id, email, password, firstName, lastName, sex, birthDate, registerDate, managerOf, employeeOf) {
        this.username = username;
        id == null ? this.id = getValueFromDb('id', usersDatabase, 'username', username) : this.id = id;
        email == null ? this.email = getValueFromDb('email', usersDatabase, 'username', username) : this.email = email;
        password == null ? this.password = getValueFromDb('password', usersDatabase, 'username', username) : this.password = password;
        firstName == null ? this.firstName = getValueFromDb('firstName', usersDatabase, 'username', username) : this.firstName = firstName;
        lastName == null ? this.lastName = getValueFromDb('lastName', usersDatabase, 'username', username) : this.lastName = lastName;
        sex == null ? this.sex = getValueFromDb('sex', usersDatabase, 'username', username) : this.sex = sex;
        birthDate == null ? this.birthDate = getValueFromDb('birthDate', usersDatabase, 'username', username) : this.birthDate = birthDate;
        registerDate == null ? this.registerDate = getValueFromDb('registerDate', usersDatabase, 'username', username) : this.registerDate = registerDate;
        managerOf == null ? this.managerOf = getValueFromDb('managerOf', usersDatabase, 'username', username) : this.managerOf = managerOf;
        employeeOf == null ? this.employeeOf = getValueFromDb('employeeOf', usersDatabase, 'username', username) : this.employeeOf = employeeOf;
    }

    logout() { //We empty the logged in user from the both local and session storages, then we force a page refresh
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        window.location.reload(false);
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
        var receivedMessages = this.getReceivedMessages(); //Each Message class instance has the following structure: new Message(id, senderId, arrayOfRecipientsId, TextMessage, locationId(optional), date, ArrayOfUsersWhoHaveSeenIt),
        var seenMessages = []; // Seen messages is initialized as an empty array. It will be a subset of "receivedMessages".
        var currentUserId = this.id;
        receivedMessages.forEach(function (singleMessage) { // We loop through each message of "receivedMessages".
            singleMessage.seenBy.forEach(function (seenBy) {
                if (seenBy == currentUserId) { //If the current user is present in the "ArrayOfUsersWhoHaveSeenIt", then
                    seenMessages.push(singleMessage); // we push the current message into the subset "seenMessages".
                }
            });
        }); // We do this for every message present in "receivedMessages".
        return seenMessages; //Once finished, we return the subset "seenMessages".
    }


    getUnseenMessages() { // This method is very similar to getSeenMessages(), but it is slightly more complex. 
        var receivedMessages = this.getReceivedMessages(); //Each Message class instance has the following structure: new Message(id, senderId, arrayOfRecipientsId, TextMessage, locationId(optional), date, ArrayOfUsersWhoHaveSeenIt),
        var currentUserId = this.id;
        var unseenMessages = []; // This variable will be a subset of "receivedMessages"
        var messageSeenByUser = false; //Dummy variable
        receivedMessages.forEach(function (singleMessage) { //We loop through each message of "receivedMessages"
            singleMessage.seenBy.forEach(function (seenBy) { //For each message, we go through each userId in the "ArrayOfUsersWhoHaveSeenIt"
                if (seenBy == currentUserId) {
                    messageSeenByUser = true;
                }
            });
            //After we have looped through EVERY userID in the "ArrayOfUsersWhoHaveSeenIt", we can state whether a certain userId has seen the current message.
            if (!messageSeenByUser) {
                unseenMessages.push(singleMessage); // If yes, we push the current message into the subset "unseenMessages"
            }
            messageSeenByUser = false; // Dummy variable reset for the next loop
        }); // We move to the next message in the "receivedMessages" group

        return unseenMessages; //Once we have checked every single message, we return the final "unseenMessages" subset
    }

    getNotifications() { // This method only returns the NUMBER of received messages not yet seen by the user.
        var notifications = 0; // Notifications are initialized as zero
        var currentUserId = this.id;
        var messages = this.getReceivedMessages();
        messages.forEach(function (singleMessage) {
            notifications++; //Each time we loop through a received a message, the notifications are increased by 1.
            singleMessage.seenBy.forEach(function (seenBy) {
                if (seenBy == currentUserId) {
                    notifications--; //If then we find out the user has seen the message, we decrease notitifications by 1.
                }
            });
        });

        return notifications;
    }

    sendMessage(recipientsIds, text, locationId = null) {
        var recipients = [];
        if (typeof (recipientsIds) == 'number') { //If there is a single recipient (e.g. recipientIds = 1)
            recipients.push(recipientsIds);
        }
        else if (Array.isArray(recipientsIds)) { //If there are multiple recipients (e.g. recipientIds = [1,2])
            recipients = recipientsIds;
        }
        var senderId = this.id;
        var messageDate = new Date();
        var messageId = getLatestDbId(messagesDatabase) + 1;

        messagesDatabase.push(new Message(messageId, senderId, recipients, text, locationId, messageDate, []));
        saveMessagesLocally();
    }

    applyForJob(jobId) {
        var locationId = getValueFromDb('locationId', jobsDatabase, 'id', jobId);
        var jobPosition = getValueFromDb('position', jobsDatabase, 'id', jobId);
        var locationName = getValueFromDb('locationName', locationsDatabase, 'id', locationId);
        console.log('Location ID: ' + locationId);
        var employer = getLocationManager(locationId);
        var employerName = employer.firstName + ' ' + employer.lastName;

        this.sendMessage([employer.id], `Hello ${employerName}, I would like to apply as a ${jobPosition} at '${locationName}'.`, locationId);
        console.log(`Succesfully applied at ${locationName}`);
        document.getElementById('job-modal-main').style.display = 'none';
        document.getElementById('job-modal-success').style.display = 'block';
    }


}

class Message {
    constructor(id, senderId, recipientsId, text, locationId = '', date, seenBy) {
        this.id = id;
        this.senderId = senderId;
        this.recipientsId = recipientsId;
        this.text = text;
        this.locationId = locationId;
        this.date = date;
        this.seenBy = seenBy;
    }

    setToSeenBy(userId) {
        this.seenBy.push(userId);
        saveMessagesLocally;
    }

}

class Location {
    constructor(id, locationName, category, address, streetNumber, city, zip) {
        this.id = id;
        this.locationName = locationName;
        this.category = category;
        this.address = address;
        this.streetNumber = streetNumber;
        this.city = city;
        this.zip = zip;
    }
    
}

class Job {
    constructor(id, locationId, position, type, hourlyWage, creationDate, startingDate, fullDescription) {
        this.id = id;
        this.locationId = locationId;
        this.position = position;
        this.type = type;
        this.hourlyWage = hourlyWage;
        this.creationDate = creationDate;
        this.startingDate = startingDate;
        this.fullDescription = fullDescription;
    }

}
