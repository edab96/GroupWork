
/*-------------------------------------------------------------------------------
// Profile page only related js
-------------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('username').innerHTML = currentUser.username;
    document.getElementById('full-name').innerHTML = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('birthday').innerHTML = new Date(currentUser.birthDate).toLocaleDateString("en-US");
    document.getElementById('sex').innerHTML = currentUser.sex;

    if (currentUser.managerOf.length > 0) {
        var html = '';
        currentUser.managerOf.forEach(function (managedLocation) {
            var locationObject = getObject(locationsDatabase, managedLocation);
            html += `<b>${locationObject.locationName}</b> - <i>${locationObject.address} ${locationObject.streetNumber}, ${locationObject.zip} ${locationObject.city}</i><br> `;
        });
        document.getElementById('managed-locations').innerHTML = html;
        document.getElementById('manager-panel').style.display = 'block';
    }
});