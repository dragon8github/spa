const spa_fake = (function(){
	'use strict';
	var getPeopleList;

	getPeopleList = function () {
		return [
			{
				name    : 'Betty',
				_id     : 'id_01',
				css_map : {
					'background-color' : 'rgb(128, 128, 128)',
					'top'              : 20,
					'left'             : 20
				}
			},
			{
				name    : 'Mike',
				_id     : 'id_02',
				css_map : {
					'background-color' : 'rgb(128, 255, 128)',
					'top'              : 60,
					'left'             : 20
				}
			},
			{
				name    : 'Pebbles',
				_id     : 'id_03',
				css_map : {
					'background-color' : 'rgb(128, 192, 192)',
					'top'              : 100,
					'left'             : 20
				}
			},
			{
				name    : 'Wilma',
				_id     : 'id_04',
				css_map : {
					'background-color' : 'rgb(192, 128, 128)',
					'top'              : 140,
					'left'             : 20
				}
			},
		]
	};

	return {
		getPeopleList : getPeopleList
	};

})();

module.exports = spa_fake;