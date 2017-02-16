require("css/spa.css");

spa = (function(){
	var initModule = function ( $container ) {
		spa.shell.initModule( $container );
	};	
	return {
		initModule : initModule
	};
}());
