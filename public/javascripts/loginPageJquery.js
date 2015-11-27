function register() {
  //alert(document.getElementById("username").value + " " + document.getElementById("password").value);
  var xhttp = new XMLHttpRequest();
  var credentials = {
    username: document.getElementById('username').value,
    password: document.getElementById("password").value
  };
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //document.getElementById('responseContainer').innerHTML = xhttp.responseText;
      alert(xhttp.responseText);
    }
  };
  xhttp.open("POST", "http://localhost:8080/register");
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(credentials));
}

function login() {
  var xhttp = new XMLHttpRequest();
  var credentials = {
    username: document.getElementById('username').value,
    password: document.getElementById("password").value
  };
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      document.getElementById('responseContainer').innerHTML = xhttp.responseText;
      alert(xhttp.responseText);
    }
  };
  xhttp.open("POST", "http://localhost:8080/login");
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(credentials));
}
