var Handlebars = require('handlebars');
function myFunction() {
	var template = Handlebars.compile('<div>Hello tag</div>');
    document.getElementById("demo").innerHTML = template;
}