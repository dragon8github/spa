var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		jq  : [				
			   __dirname + '/src/js/jq/jquery-1.9.1.js',			   
			   __dirname + '/src/js/jq/jquery.uriAnchor-1.1.3.js'	
			  ],	  
		app : [
			   __dirname + '/src/js/spa.js',
			   __dirname + '/src/js/spa.shell.js',
			   __dirname + '/src/js/spa.util.js',
			   __dirname + '/src/js/spa.chat.js',
			   __dirname + '/src/js/spa.model.js'	   
			  ]		
	},
	output:{
		path     : __dirname + '/build/js',
		filename : '[name].js'
	},
	resolve: {
        alias: {
            css: __dirname + '/src/css/'
        }
    },
	module : {
		loaders : [
		   {test:/\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,loader:"file" },
           {test: /\.css$/,loader: 'style-loader!css-loader'},
           {test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,loader: 'file-loader',query: {name: '[name].[ext]?[hash]'}}
		]
	},
	plugins:[
		 new HtmlWebpackPlugin({
		 	filename : __dirname + "/build/spa.html",//用户后台首页
            template : __dirname+ '/src/spa.html',//模板文件
            inject   : 'head',
            hash     : true,
		 	chunks   : ["jq","app"]
		 })
	]
}