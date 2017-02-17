require("css/spa.css");
let spa_shell = require('./spa.shell.js'); 
let spa = (function(){
	var initModule = function ( $container ) {
		spa_shell.initModule( $container );
	};	
	return {
		initModule : initModule 
	};
}());


spa.initModule( $('#spa') );

