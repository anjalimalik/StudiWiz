"use strict";

var urlgetTeams = "http://localhost:3000/getTeams";
var urlUserDetails = "http://localhost:3000/getUserDetails";
var urlCreateTeam = "http://localhost:3000/newTeam";

var mylist;
var i;
var close;
var list;

var id = -1;
var email;

// main
function onload_main() {

    document.getElementById("mytasks").style.display = "none";
    document.getElementById("teams").style.display = "none";

    var url = window.location.href;
    var str = url.split("?email=");
    email = str[1];

    if (email == null || email == "" || email == "undefined") {
        alert("You have to be logged in first!");
        window.location.href = "index.html";
    } else if (email.includes("#")) {
        email = email.replace("#", "");
    }

    fetch(urlUserDetails, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                console.log("Inside res.ok. User ID retrieved");
                id = data.response[0].idUsers;
            }.bind(this));
        }
        else {
            console.log("Error: Cannot get UserID");
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });
}

function mytasks_onclick() {
    document.getElementById("mytasks").style.display = "block";
    document.getElementById("teams").style.display = "none";

    mylist = document.getElementsByTagName("LI");
    for (i = 0; i < mylist.length; i++) {
        var span = document.createElement("SPAN");
        span.className = "close";
        span.innerHTML = "\u00D7";
        mylist[i].appendChild(span);
    }

    close = document.getElementsByClassName("close");

    list = document.querySelector('ul');
    tasks_listeners();
}

function tasks_listeners() {
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);

    for (var i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

function add_onclick() {
    var li = document.createElement("li");

    var inputValue = document.getElementById("newtask").value;

    var t = document.createTextNode(inputValue);
    li.appendChild(t);

    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("items").appendChild(li);
    }
    document.getElementById("newtask").value = "";

    var span = document.createElement("SPAN");

    span.className = "close";
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    for (var i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

function showTeams() {

    $('.team').remove();

    document.getElementById("mytasks").style.display = "none";
    document.getElementById("teams").style.display = "block";

    fetch(urlgetTeams, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "id": id
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                var teamDiv = document.getElementById("allTeams");

                var json = data.response;

                for (var k = 0; k < Object.keys(data.response).length; k++) {
                    var team = document.createElement("div");
                    team.setAttribute('class', 'team');
                    team.innerHTML = json[k].TeamName;
                    teamDiv.appendChild(team);
                }

            }.bind(this));
        }
        else {
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });
}

function createTeam_onclick() {

    fetch(urlCreateTeam, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "name": document.getElementById("newteam").value,
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {

                var allTeams = document.getElementById("allTeams");

                var team = document.createElement("div");
                team.setAttribute('class', 'team');
                team.innerHTML = document.getElementById("newteam").value;
                allTeams.appendChild(team);

            }.bind(this));
        }
        else {
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });
}
