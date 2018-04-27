"use strict";

var urlgetTeams = "http://localhost:3000/getTeams";
var urlUserDetails = "http://localhost:3000/getUserDetails";
var urlCreateTeam = "http://localhost:3000/newTeam";
var urlSearch = "http://localhost:3000/runSearch";

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

    // listeners
    document.getElementById("searchUser").addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            runSearch();
        }
    });
    /////

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

    var val = document.getElementById("newteam").value;

    var teamid = "team".concat(val);

    fetch(urlCreateTeam, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "name": val,
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {

                var allTeams = document.getElementById("allTeams");

                var team = document.createElement("div");
                team.setAttribute('class', 'team');
                team.setAttribute('id', teamid);
                team.innerHTML = document.getElementById("newteam").value;
                allTeams.appendChild(team);

                team.setAttribute('onclick', showOptions(teamid));

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

function showOptions(teamDivId) {
    var str = teamDivId.toString().split("team");
    var tname = str[1];

    var team = document.getElementById(teamDivId);
}


function runSearch() {
    $('#searchHide').remove();
    var key = document.getElementById("searchUser").value;

    fetch(urlSearch, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "key": key,
        })

    }).then(function (res) {
        if (res.ok) {

            res.json().then(function (data) {
                var json = data.response;
                var length = Object.keys(json).length;
                var userSearchDiv = document.getElementById("usersearch");

                if (length != 0) {
                    for (i = 0; i < length; i++) {
                        if (json[i].idUsers == id) {
                            if (length > 1) {
                                continue;
                            }
                            var lnk = document.createElement("a");
                            lnk.setAttribute('id', 'searchHide');
                            lnk.setAttribute('class', 'searchClass dropdown-item half-rule');
                            lnk.innerHTML = "No matching users found!";
                            lnk.style = "border-bottom: 1px solid #ccc; font-weight: bold; margin-left:0;";
                            userSearchDiv.appendChild(lnk);
                            continue;
                        }
                        var lnk = document.createElement("a");
                        lnk.setAttribute('class', 'searchClass dropdown-item');
                        lnk.setAttribute('id', 'searchHide');
                        lnk.setAttribute("href", "#");
                        lnk.innerHTML = (json[i].Name).concat("  (", json[i].Email, ")");
                        lnk.style = "border-bottom: 1px solid #ccc; font-weight: bold; overflow: visible; width: 100%; height: 20%;";
                        userSearchDiv.appendChild(lnk);

                        lnk.addEventListener('click', function() {
                            var val = lnk.innerHTML;
                            var str = val.split("(");
                            var s = (str[1].split(")"))[0];
                            addMember(s);
                        }, false);
                        
                    }
                }
                else if (length == 0) {
                    var lnk = document.createElement("a");
                    lnk.setAttribute('id', 'searchHide');
                    lnk.setAttribute('class', 'searchClass dropdown-item half-rule');
                    lnk.innerHTML = "No matching users found!";
                    lnk.style = "border-bottom: 1px solid #ccc; font-weight: bold; margin-left:0;";
                    userSearchDiv.appendChild(lnk);
                }

                // show the dropdown
                document.getElementById("searchUserToggle").style.display = "block";

                // if clicked anywhere else, hide the dropdown list
                $(document).on('click', function (e) {
                    if (e.target.id !== 'searchUserToggle') {
                        $('#searchUserToggle').hide();
                    }

                })
                
            });
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

function addMember(memberemail) {
    $('.searchClass.dropdown-item').remove();
    $('.searchClass.dropdown-item.half-rule').remove();
    document.getElementById("searchUser").value = "";

    fetch(urlUserDetails, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": memberemail
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                var member = data.response[0];
                var members = document.getElementById("members");
                if (members.innerHTML) {
                    if (members.innerHTML.includes(member.Name)){
                        return;
                    }
                    members.innerHTML = members.innerHTML + "<kbd id=\"name\" style=\"font-size: 18px; margin-left: 5%; font-family: Courier New; border-radius: 10px;\">".concat(member.Name, "</kbd>");        
                }
                else {
                    members.innerHTML = "<kbd id=\"name\" style=\"font-size: 18px; margin-left: 5%; font-family: Courier New; border-radius: 10px;\">".concat(member.Name, "</kbd>");        
                }
                
                var val = document.getElementById("newteam").value;
            
                fetch(urlCreateTeam, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id": member.idUsers,
                        "name": val,
                    })
            
                }).then(function (res) {
                    if (res.ok) {
                        res.json().then(function (data) {
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

function clearModal() {
    document.getElementById("newteam").value = "";
    document.getElementById("searchUser").value = "";
    $('.searchClass.dropdown-item').remove();
    $('.searchClass.dropdown-item.half-rule').remove();
    $('#searchHide').remove();
    $('#name').remove();
}
