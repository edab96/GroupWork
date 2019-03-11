// JavaScript source code

var usersDatabase = [
    {
        id: 1000,
        username: 'employeeUsername',
        password: 'password',
        name: 'Name',
        lastname: 'Lastname',
        birthDate: 'Wed Aug 21 1996 17:00:12 GMT+0100',
        sex: 'Male',
        registerDate: 'Fri Mar 01 2019 16:21:12 GMT+0100',
        managing: [],
        employed: []
    },

    {
        id: 1000,
        username: 'managerUsername',
        password: 'password',
        name: 'Name',
        lastname: 'Lastname',
        birthDate: 'Wed Aug 21 1996 17:00:12 GMT+0100',
        sex: 'Male',
        registerDate: 'Fri Mar 01 2019 16:21:12 GMT+0100',
        managing: [1000],
        employed: []
    }

];

var locationsDatabase = [
    {
        locationId: 1000,
        locationName: 'Forno',
        type: 1,
        address: 'Howitzvej',
        houseNumber: 1,
        city: 'Frederiksberg',
        zip: 2000
    },
    {
        locationId: 1001,
        locationName: 'Pasta',
        type: 1,
        address: 'Fasanvej',
        houseNumber: 2,
        city: 'Frederiksberg',
        zip: 2000
    }

];

var jobsDatabase = [
    {
        id: 10202303, //Unique ID
        locationName: "Some cafe", //Name of the restaurant
        locationType: "Cafe", //Whether Restaurant, Fast-food, Cafe,
        position: "Bartender", //Name of the open position
        type: "Full-Time", //Either Full-Time or Part-Time
        address: "Howitzvej", //Street name
        houseNumber: 60, //Civic number
        city: "Frederiksberg",
        zip: "2000",
        creationDate: "Fri Mar 01 2019 16:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "Mon Apr 01 2019 20:30:12 GMT+0100", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "This is a test. This box... ", // Optional, longer description for the modal
    },
    {
        locationName: "Some Restaurant", //Name of the restaurant
        locationType: "Restaurant", //Whether Restaurant, Fast-food, Cafe,
        position: "Cook", //Name of the open position
        type: "Part-Time", //Either Full-Time or Part-Time
        address: "Howitzvej", //Street name
        civic: "602", //Civic number
        city: "Frederiksberg2",
        zip: "2000",
        creationDate: "Fri Mar 01 2019 10:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "Tue Apr 02 2019 20:30:12 GMT+0100", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "This is a test. This box... ", // Optional, longer description for the modal
    },

    {
        locationName: "Some Fast-Food", //Name of the restaurant
        locationType: "Fast-Food", //Whether Restaurant, Fast-food, Cafe,
        position: "Cook", //Name of the open position
        type: "Part-Time", //Either Full-Time or Part-Time
        address: "Fasanvej", //Street name
        civic: "1", //Civic number
        city: "Frederiksberg",
        zip: "2000",
        creationDate: "Thu Mar 14 2019 10:21:12 GMT+0100", //Javascript Date object. It is the date the job announcement has been posted
        startingDate: "0", //Javascript Date object. It is the date of job start
        image: "", //Optional, url image for the modal
        fullDescription: "This is a test. This box... ", // Optional, longer description for the modal
    }
];