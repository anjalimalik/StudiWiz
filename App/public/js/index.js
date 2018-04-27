"use strict";

var urlLogin = "http://localhost:3000/login";

function onload_index() {
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
                alert("HERE2");
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
