spa.shell = (function () {
	//---------------BEGIN MODULE SCOPE VARIABLES-------------------
	var 	    
	    onClickChat      = function () {},
		onHashchange     = function () {},
		copyAnchorMap    = function () {},
		changeAnchorPart = function () {},	    
		setJqeryMap      = function () {},
	    initModule       = function () {},  
	    jqueryMap = { $container : null },	      
	    stateMap  = { 
	    	$container        : null,
	    	is_chat_retracted : true,
	    	anchor_map        : {} 
	    },
		configMap = {
			template_html        : '<div class="spa-shell-head">\
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
			chat_extend_time     : 1000,
	        chat_retract_time    : 300,
	        chat_extend_height   : 450,
	        chat_retract_height  : 15,
	        chat_extended_title  : 'Click to retract',
	        chat_retracted_title : 'Click to extend',
	        anchor_schema_map    : {
	        	chat : { open :true, closed : true }
	        }
		};
	//---------------END MODULE SCOPE VARIABLES-------------------




    //--------------BEGIN UTILITY METHODS-----------------------
    // 使用jquery的extend()方法来复制对象。
    copyAnchorMap = function () {
    	// 所有的js对象都是按引用传递的，正确的复制一个对象不是件容易的事
    	return $.extend( true, {}, stateMap.anchor_map );
    }    

    // 更新锚点
	changeAnchorPart = function (arg_map) {
		var 
		    anchor_map_revise = copyAnchorMap(),
		    bool_return = true,
		    key_name,
		    key_name_dep;

		// 为什么这样做，请参考手册https://github.com/dragon8github/urianchor
        /*
			$.uriAnchor.setAnchor({
			  page : 'profile',
			  _page : {
			    uname   : 'wendy',
			    online  : 'today'
			  },
			  slider  : 'confirm',
			  _slider : {
			   text   : 'hello',
			   pretty : false
			  },
			  color : 'red'
			});
        */
        for ( key_name in arg_map) {
    		if ( key_name.indexOf( '_' ) === 0 ) { continue; }
    		anchor_map_revise[key_name] = arg_map[key_name];
    		key_name_dep = '_' + key_name;
    		if( arg_map[key_name_dep] ) {
    			anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
    		} else {
    			delete anchor_map_revise[key_name_dep];
    			delete anchor_map_revise['_s' + key_name_dep];
    		}
        }

        try {
        	$.uriAnchor.setAnchor( anchor_map_revise );
        } 
        catch ( error ) {
            $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
            bool_return = false;
        }

        return bool_return;
	}
    //--------------END UTILITY METHODS-----------------------




	//-------------BEGIN DOM METHODS-------------------

	// 将jquery的DOM对象缓存起来
	setJqeryMap = function () {
		var $container = stateMap.$container ;
		jqueryMap = { 
			$container : $container,
			$chat      : $container.find( '.spa-shell-chat' ) 
		};
	};
	
	//-------------END DOM METHODS-------------------






    //-------------BEGIN EVENT HANDLERS--------------

    // 右下角滑块的click事件
    onClickchat = function ( event ) {
    	// 更新URI锚点
    	changeAnchorPart({
    		chat : stateMap.is_chat_retracted ? 'open' : 'closed'
    	})
    	return false;
    }

    // 锚点change事件，通过这个事件来操控一系列的变化
    onHashchange = function ( event ) {
       var 
           anchor_map_previous = copyAnchorMap(),
           anchor_map_proposed,
           _s_chat_previous,
           _s_chat_proposed,
           s_chat_proposed;

       try {
       	  anchor_map_proposed = $.uriAnchor.makeAnchorMap();  // 获取当前uri状态       	  
       }    
       catch ( error ) {       		
       	   $.uriAnchor.setAnchor( anchor_map_previous, null, true ); // 如果出现异常，则将uri还原
       	   return false;
       }
       
       _s_chat_previous    = anchor_map_previous._s_chat;  // 之前的uri状态：如chat=open
       _s_chat_proposed    = anchor_map_proposed._s_chat;  // 现在的uri状态：如chat=closed
       stateMap.anchor_map = anchor_map_proposed;          // 存储替换原本的缓存

       // 必须不一样才有改变的必要不是吗？
       if ( _s_chat_previous !== _s_chat_proposed ) {
       	  s_chat_proposed = anchor_map_proposed.chat;
       	  switch ( s_chat_proposed ) {
       	  	case 'open' : 
       	  	  toggleChat( true );
       	  	  break;
       	  	case 'closed' :
       	  	  toggleChat( false );
       	  	  break;
       	  	default : 
       	  	  toggleChat( false );
       	  	  delete anchor_map_proposed.chat;
       	  	  $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
       	  }
       }

       return false;
    }
    //-------------END EVENT HANDLERS--------------


	//-------------BEGIN PRIVATE METHODS--------------
	// 右下角滑块的click切换效果
	toggleChat = function ( do_extend, callback ) {
		var 
		    px_chat_ht = jqueryMap.$chat.height(),
		    is_open    = px_chat_ht === configMap.chat_extend_height,
		    is_closed  = px_chat_ht === configMap.chat_retract_height,
		    is_sliding = ! is_open && ! is_closed;

        // avoid race condition
		if ( is_sliding ) { return false }
		
		// Begin extend chat slider
		if ( do_extend ) {
			jqueryMap.$chat.animate(
				 { height : configMap.chat_extend_height },
				 configMap.chat_extend_time, 
				 function () {
				 	jqueryMap.$chat.attr(
				 		'title',configMap.chat_extended_title
				 	);
				 	stateMap.is_chat_retracted = false;
				    if ( callback ) { callback( jqueryMap.$chat ) } 
				 }
			);
		    return true;
		} 		

		// Begin retract chat slider
		jqueryMap.$chat.animate(
            { height : configMap.chat_retract_height },
            configMap.chat_retract_time,
            function () {
        		jqueryMap.$chat.attr(
			 		'title',configMap.chat_extended_title
			 	);
			 	stateMap.is_chat_retracted = true;
            	if ( callback ) { callback( jqueryMap.$chat ) } 
            }
		); 

		return true;		
	};
	//-------------END PUBLIC METHODS--------------




	//-------------BEGIN PUBLIC METHODS--------------
	// 初始化
	initModule = function ( $container ) {
	    stateMap.$container = $container;
	    $container.html( configMap.template_html );
	    setJqeryMap();

	    stateMap.is_chat_retracted = true;
	    jqueryMap.$chat
	      .attr( 'title', configMap.chat_retracted_title )
	      .click( onClickchat );

	    $.uriAnchor.configModule({
	    	schema_map : configMap.anchor_schema_map
	    });

	    spa.chat.configModule( {} );
	    spa.chat.initModule( jqueryMap.$chat );

	    $(window)
	       .bind( 'hashchange', onHashchange )
	       .trigger( 'hashchange' );
	};	
	//-------------END PUBLIC METHODS--------------


	return {
		initModule : initModule
	};
}());