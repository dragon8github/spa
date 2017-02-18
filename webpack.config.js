var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		jq  : [				
				   __dirname + '/src/js/jq/jquery-1.9.1.js',		
				   __dirname + '/src/js/jq/jquery.uriAnchor-1.1.3.js',
				   __dirname + '/src/js/jq/jquery.event.gevent.js',
				   __dirname + '/src/js/jq/jquery.event.ue.js',			   	
				   __dirname + '/src/js/jq/taffy.js'			   	
			  ],	  
		app : [
				   'webpack-dev-server/client?http://127.0.0.1:8894',
				   __dirname + '/src/js/main.js'
			  ]		
	},
	output:{
		publicPath : "http://127.0.0.1:8894/",
		path       : __dirname + '/build/js',
		filename   : '[name].js'
	},
	resolve: {
        alias: {
            css: __dirname + '/src/css/',
            jq : __dirname + '/src/js/jq/jquery-1.9.1.js'
        }
    },
	module : {
		loaders : [
		   {test:/\.js$/,loader:"babel-loader", query: { compact:true },exclude: /node_modules/},
		   {test:/\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,loader:"file" },
           {test: /\.css$/,loader: 'style-loader!css-loader'},
           {test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,loader: 'file-loader',query: {name: '[name].[ext]?[hash]'}}
		]
	},
	plugins:[
		 new HtmlWebpackPlugin({
		 	// filename : __dirname + "/build/spa.html",//用户后台首页
		 	filename : "spa.html", // 配合热编译故意这样编写，这样才可以访问localhost:port/spa.html
            template : __dirname + '/src/spa.html',//模板文件
            inject   : {
            	head : ['common',"jq"],
            	body : ["app"]
            },
            hash     : true,
		 	chunks   : ["app","jq",'common']
		 }),
		 //提取出公共的代码
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",  
            chunks:["jq","app"]
        })
	]
}