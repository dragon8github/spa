const spa_fake = require('./spa.fake.js');
const TAFFY = require('taffy');
const spa_model = (function () {
	'use strict';
	var 
		isFakeData = true,
		initModule = function () {},
		makePerson = function () {},
		configMap  = { anon_id : 'a0' },
		stateMap   = {
			anon_user      : null,
			people_cid_map : {},
			people_db      : TAFFY()
		},
		personProto = {
			get_is_user : function () {
				return this.cid === stateMap.user.cid; 
			},
			get_is_anon : function () {
				return this.cid === stateMap.anon_user.cid;
			}
		},
		people = {
			get_db      : function () { return stateMap.people_db },
			get_cid_map : function () { return stateMap.people_cid_map; }
		};

	makePerson = function ( person_map ) {
		var 
			person,
			cid     = person_map.cid,
			css_map = person_map.css_map,
			id      = person_map.id,
			name    = person_map.name;

		if ( cid === undefined || !name ) {
			throw 'client id and name require';
		}

		person = Object.create( personProto );
		person_map.cid     = cid;
		person_map.css_map = css_map;
		person_map.name    = name;

		if ( id ) { person.id = id; }

		stateMap.people_cid_map[ cid ] = person;

		stateMap.people_db.insert( person );

		return person;
	};

	initModule = function () {
		var 
			i,
			people_list,
			person_map;

		stateMap.anon_user = makePerson({
			cid  : configMap.anon_id,
			id   : configMap.anon_id,
			name : 'anonymous'
		});

		stateMap.user = stateMap.anon_user;

		if ( isFakeData ) {
			people_list = spa_fake.getPeopleList();
			for ( i = 0; i < people_list.length; i++ ) {
				person_map = people_list[ i ];
				makePerson({
					cid     : person_map._id,
					id      : person_map._id,
					css_map : person_map.css_map,
					name    : person_map.name
				});
			}
		}
	};

	return {
		initModule : initModule,
		people     : people
	};

})();

module.exports = spa_model;