"use strict";

var urlLogin = "http://localhost:3000/login";

var mylist;
var i;
var close;
var list;

// main

function onload_main() {


    mytasks_onclick();
}

function login() {
    var email = emailLogin.value;
    var pass = passLogin.value;

    fetch(urlLogin, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "pass": pass
        })

    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                var u = 'dashboard.html?email='.concat(email);
                window.location.href = u;
            }.bind(this));
        }
        else {
            alert("Error: Login unsuccessful!");
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
    mylist = document.getElementsByTagName("LI");
    for (i = 0; i < mylist.length; i++) {
        var span = document.createElement("SPAN");
        span.className = "close";
        span.innerHTML = "\u00D7";
        mylist[i].appendChild(span);
    }

    close = document.getElementsByClassName("close");

    list = document.querySelector('ul');
}

function document_ready() {
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
