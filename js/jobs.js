/*-------------------------------------------------------------------------------
// Jobs page
-------------------------------------------------------------------------------*/
var jobDisplayOptions = {
    date: "latest", //latest(default), oldest
    type: "All", //Any(default), Full-Time, Part-Time
};

var jobs = [];
var displayedJobs = [];

document.addEventListener('DOMContentLoaded', function () {//Once the jobs page has been loaded
 
    for (var i = 0; i < jobsDatabase.length; i++) {
        var singleJobListing = '';
        for (var j = 0; j < locationsDatabase.length; j++) {
            if (jobsDatabase[i].locationId == locationsDatabase[j].id) {
                singleJobListing = { job: jobsDatabase[i], location: locationsDatabase[j] };
                jobs.push(singleJobListing);
            }
        }
        
    }


});

function populateJobsList() {
    jobs.forEach(function (jobToList) {
        //console.log(jobDisplayOptions.type + " " + jobToList.type);

        if (jobDisplayOptions.type == 'All') {
            //console.log("Display selction is:" + jobDisplayOptions.type);
            appendToJobListing(jobToList);
        }
        else if (jobDisplayOptions.type == jobToList.job.type) {
            //console.log("Display selction is:" + jobDisplayOptions.type + "and listed job type is: " + jobToList.type)
            appendToJobListing(jobToList);
        }
    });
}

function appendToJobListing(listingToAppend) {
    var dateDisplayptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    announcementDate = new Date(listingToAppend.job.creationDate).toLocaleDateString("en-US", dateDisplayptions);
    var startingDate = new Date(listingToAppend.job.startingDate);
    var now = new Date();

    if (startingDate.getTime() < now.getTime()) {
        startingDate = 'As soon as possible';
    }
    else {
        startingDate = startingDate.toLocaleDateString("en-US", dateDisplayptions);
    }

    htmlJob = `<div class="job-listing-wrapper" data-job-type="${listingToAppend.job.type}">` +
        `<p class="job-listing-date">Posted on: ${announcementDate}.</p>` +
        `<h2 class="job-listing-header" >${listingToAppend.location.locationName}</h2 >` +
        `<p class="job-listing-info">${listingToAppend.job.position}, ${listingToAppend.job.type}.</p>` +
        `<p class="job-listing-info">Hourly wage: ${listingToAppend.job.hourlyWage} DKK.</p>` +
        `<p class="job-listing-start" >Job start: ${startingDate}.</p >` +
        `<button style="width:100%;" onclick='openJobModal(${JSON.stringify(listingToAppend)});'>View more</button></div >`;
    document.getElementById("job-list-container").insertAdjacentHTML('afterbegin', htmlJob);


}

function clearJobList() {
    document.getElementById('job-list-container').innerHTML = "";
}

function sortJobsAsc() {
    document.getElementById('active-sorting-date').innerHTML = 'Oldest first';
    jobs.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.job.creationDate) - new Date(a.job.creationDate);
    });
    clearJobList();
    populateJobsList();
}

function sortJobsDesc() {
    document.getElementById('active-sorting-date').innerHTML = 'Latest first';
    jobs.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.job.creationDate) - new Date(b.job.creationDate);
    });
    clearJobList();
    populateJobsList();
}

function hideJobs() {
    document.getElementById('job-list-container').innerHTML = '';
}


function showFullTimeOnly() {
    document.getElementById('active-sorting-job-type').innerHTML = 'Full-Time';
    hideJobs();
    jobDisplayOptions.type = 'Full-Time';
    populateJobsList();
}


function showPartTimeOnly() {
    document.getElementById('active-sorting-job-type').innerHTML = 'Part-Time';
    hideJobs();
    jobDisplayOptions.type = 'Part-Time';
    populateJobsList();
}

function showAnyJobType() {
    document.getElementById('active-sorting-job-type').innerHTML = 'All';
    hideJobs();
    jobDisplayOptions.type = 'All';
    populateJobsList();
}

document.addEventListener('DOMContentLoaded', function () {
    sortJobsDesc();
});

/*-------------------------------------------------------------------------------
// Job listing modal
-------------------------------------------------------------------------------*/

function openJobModal(listedJobObject) {

    var title = listedJobObject.job.position + ' sought at ' + listedJobObject.location.locationName;
    document.getElementById('modal-job-title').innerHTML = title;
    document.getElementById('modal-description').innerHTML = listedJobObject.job.fullDescription;
    document.getElementById('gmap_canvas').src = 'https://maps.google.com/maps?q=' + listedJobObject.location.address + '%20' + listedJobObject.location.streetNumber + '%20' + listedJobObject.location.zip + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
    if (isUserLoggedIn()) { //If the visitor is a logged in user ->
        document.getElementById('modal-apply').style.display = 'inline-block'; //We show the "Apply now" button in the jobs modal
        document.getElementById('modal-login-redirect').style.display = 'none'; //We show the "Apply now" button in the jobs modal

        document.getElementById('modal-apply').onclick = function () {
            currentUser.applyForJob(listedJobObject.job.id);
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







    