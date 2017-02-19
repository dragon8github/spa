const spa_model = require('../src/js/spa/spa.model.js');

spa_model.initModule();  // 初始化数据，伪造数据

var people_db = spa_model.people.get_db();

var peopleList = people_db().get();

console.log(peopleList);

people_db().each( function (person, index) {
	console.log(person.name, index);
})
