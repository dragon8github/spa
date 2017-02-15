/**
  # initModule
  Example   : spa.chat.initModule( $("#div_id") );
  Arguments : $(document)  
  Returns   : true on success, false on failure
  Throws    : none
  Action    : 

  # setSliderPosition
  Example   : spa.chat.setSliderPosition( 'closed' );
  Arguments : * position_type - 'closed', 'opened', or 'hidden';
  			  * callback
  Returns   : true or false
  Throws    : none
  Action    : 
*/
spa.chat = (function () {
	//---------------BEGIN MODULE SCOPE VARIABLES-------------------
	var 
		onClickToggle     = function () {},
		getEmSize         = function () {},
		setPxSizes        = function () {},
		setSliderPosition = function () {},
		setJqueryMap      = function () {},
		initModule        = function () {},
		configModule      = function () {},		
		stateMap  = { $container : null },
		jqueryMap = {},
		stateMap  = {
			$append_target   : null,
			position_type    : 'closed',
			px_per_em        : 0,
			slider_hidden_px : 0,
			slider_closed_px : 0,
			slider_opened_px : 0
		},
		configMap = {
			template_html : '<div class="spa-shell-head">\
									   <div class="spa-shell-head-logo"></div>\
									   <div class="spa-shell-head-acct"></div>\
									   <div class="spa-shell-head-search"></div>\
									 </div>\
									 <div class="spa-shell-main">\
									   <div class="spa-shell-main-nav"></div>\
									   <div class="spa-shell-main-content"></div>\
									 </div>\
									 <div class="spa-shell-foot"></div>\
									 <div class="spa-shell-chat"></div>\
									 <div class="spa-shell-modal"></div>\
							',
			settable_map : {
				slider_open_time    : true,
				slider_close_time   : true,
				slider_opened_em    : true,
				slider_closed_em    : true,
				slider_opened_title : true,
				slider_closed_title : true,

				chat_model          : true,
				people_model        : true,
				set_chat_anchor     : true         
			},		

			slider_open_time    : 250,
			slider_close_time   : 250,
			slider_opened_em    : 16,
			slider_closed_em    : 2,
			slider_opened_title : "click to close",
			slider_closed_title : "click to open",

			chat_model      : null,
			people_model    : null,
			set_chat_anchor : null
		};
	//---------------END MODULE SCOPE VARIABLES-------------------	




	//--------------BEGIN UTILITY METHODS-----------------------
	getEmSize = function ( elem ) {
		return Number(
			getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
		);
	}

	setPxSizes = function () {
		var 
			px_per_em,
			opened_height_em;

		px_per_em = getEmSize( jqueryMap.$slider.get(0) );

		opened_height_em = configModule.slider_opened_em;

		stateMap.px_per_em = px_per_em;
		stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
		jqueryMap.$sizer.css({
			height : ( opened_height_em - 2 ) * px_per_em
		});
	};
	//--------------END UTILITY METHODS-----------------------



	//-------------BEGIN DOM METHODS-------------------
	setJqueryMap = function () {
		var			
			$append_target = stateMap.$append_target,
			$slider        = $append_target.find( '.spa-chat' );
			
		jqueryMap = {
			$slider : $slider,
			$head   : $slider.find( '.spa-chat-head' ),
			$toggle : $slider.find( '.spa-chat-head-toggle' ),
			$title  : $slider.find( '.spa-chat-head-title' ),
			$sizer  : $slider.find( '.spa-chat-sizer' ),
			$msgs   : $slider.find( '.spa-chat-msg' ),
			$box    : $slider.find( '.spa-chat-box' ),
			$input  : $slider.find( '.spa-chat-input input[type=text]' )
		};
	};	

	setSliderPosition = function ( position_type, callback ) {
		var 
			height_px,
			animate_time,
			slider_title,
			toggle_text;

		if( stateMap.position_type === position_type ) {
			return true;
		}

		switch ( position_type ) {
			case 'opened' :
				height_px    = stateMap.slider_closed_px;
				animate_time = configMap.slider_open_time;
				slider_title = configMap.slider_opened_title;
				toggle_text  = '=';
				break;	
			case 'hidden' : 
				height_px    = 0;
				animate_time = configMap.slider_open_time;
				slider_title = '';
				toggle_text  = '+';
				break;	
			case 'closed' : 
				height_px    = stateMap.slider_closed_px;
				animate_time = configMap.slider_close_time;
				slider_title = configMap.slider_closed_title;
				toggle_text  = '+';
			break;
			default  : return false;		
		}

		stateMap.position_type = '';

		jqueryMap.$slider.animate(
			{height : height_px},
			animate_time,
			function () {
				jqueryMap.$toggle.prop( 'title', slider_title );
				jqueryMap.$toggle.text( toggle_text );
				stateMap.position_type = position_type;
				if( callback ) { callback(jqueryMap.$slider); }
			}
		);
		return true;
	};
	//-------------END DOM METHODS-------------------



	//---------------------- BEGIN EVENT HANDLERS-----------------------
	onClickToggle = function () {
		var set_chat_anchor = configMap.set_chat_anchor;
		if ( stateMap.position_type === 'opened' ) {
			set_chat_anchor( 'closed' );
		} else if ( stateMap.position_type === 'closed' ) {
			set_chat_anchor( 'opened' );
			return false;
		}
	};
	//---------------------- END EVENT HANDLERS-----------------------



	configModule = function ( input_map ) {
		spa.util.setConfigMap({
			input_map    : input_map,
			settable_map : configMap.settable_map,
			configMap    : configMap
		});
		return true;
	};

	initModule = function ( $append_target ) {
		$append_target.append( configMap.template_html );
		stateMap.$append_target = $append_target;
		setJqueryMap();
		setPxSizes();

		jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
		jqueryMap.$head.click( onClickToggle );
		stateMap.position_type = 'closed';
		return true;
	};

	return {
		setSliderPosition : setSliderPosition,
		configModule      : configModule,
		initModule        : initModule
	}

})()