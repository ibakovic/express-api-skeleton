var moviesTemplate = "{{#each movies}}" + " {{this.title}} {{this.user}} <br>" + " {{/each}}";
var usersTemplate = "<ul>{{#each users}} <li>{{this.username}} <br> {{this.password}}</li> <br>{{/each}}</ul>";
module.exports = {
	moviesTemplate: moviesTemplate,
	usersTemplate: usersTemplate
};