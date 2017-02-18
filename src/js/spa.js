require("css/spa.css");
const spa_shell = require('./spa.shell.js'); 

const spa = (function(){
	var initModule = function ( $container ) {
		spa_shell.initModule( $container );
	};	
	return {
		initModule : initModule 
	};
})();


module.exports = spa;
