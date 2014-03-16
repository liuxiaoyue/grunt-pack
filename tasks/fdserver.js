/*
 * fdserver
 * https://github.com/xiaoyue3/gruntplugin
 *
 * Copyright (c) 2014 xiaoyue
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');
var Path = require('path');
var rootpath = process.cwd();
var utils = require('js-combine-pack');
var tool = utils.tool;
var toolOptions = tool.config;

var findFiles = tool.findFiles;
var findalldeps = tool.findalldeps;

var byline = tool.lineStream;
var dStream = tool.depsStream;

function isJs(path) {
	return Path.extname(path) === '.js';
}

function isDirPath(path) {
	return Path.lastIndexOf('/') === path.length - 1;
}

module.exports = function(grunt) {
	grunt.registerMultiTask('fdserver', 'a simple, efficient, convenient RIA development environment', function() {
	    var options = this.options({
		   	// baseUrl : 'test/',
	     //    projectName : 'blog7',
	     //    reset : true,
	     //    minify: true
	    });

	    if (options.baseUrl) {
			toolOptions.baseUrl = Path.resolve(rootpath, options.baseUrl);
		}
		if (options.projectName) {
			toolOptions.projectName = options.projectName;
		}

	    this.files.forEach(function(f) {
	      	var confList, jsListCon, jsList;
	      	toolOptions.publishUrl = f.dest;
	      	
		    f.src.filter(function(path) {
		        if (grunt.file.exists(path)) {
					return true;
				} else {
					return false;
				}
		    }).forEach(function(path) {
		    	if(grunt.file.isDir(path)){
		    		jsList = findFiles.allFilesList(path);
		    		jsListCon = findFiles.allFilesCon(jsList, path);
		    		confList = findFiles.confList(jsList);
		    		// findalldeps(toolOptions, false, confList, jsListCon);
		    		var jsDepsMap = {};
					confList.forEach(function(value,key){	
						confList[key] = value.replace(toolOptions.baseUrl,'');
					});

					var loadDeps = function(config,confList,jsMap,jsDepsMap){
						
						//confList = confList.slice(0,1);
						if(confList && confList.length){
							var confFile = confList.shift();

							var lineStream = new byline();
							var depsStream  = new dStream();

							var confStream = fs.createReadStream(Path.join(config.baseUrl,confFile));
							confStream.pipe(lineStream);
							//lineStream.pipe(process.stdout);
							lineStream.pipe(depsStream);
							// console.log('111' + JSON.stringify(jsDepsMap));
							depsStream.pipe(lineStream,config,confFile,jsMap,confList,jsDepsMap,loadDeps);
						}
					};	

					loadDeps(toolOptions,confList,jsListCon,jsDepsMap);

		    	}
		    });
		        
			// Write the destination file.
			grunt.file.write(f.dest + "index.js","11");

			// Print a success message.
			// grunt.log.writeln('File "' + f.dest + '" created.');
	    });
	});
};










	    // function combine(filepath){
		    // 	//读取文件
		    // 	src = grunt.file.read(filepath);
		    // 	grunt.log.writeln(src);
		    // 	//去掉块注释
		    // 	src = comment.stripBanner(src);
		    	
		    // 	//解析每个import引进来的数据
		    // 	return src.replace(reg,function(){
		    // 		//文件import 引入文件的路径 
	     //    		var key = arguments[2];
	     //    		if(key){
	     //    			//获取当前文件所在路径
			   //  		var con = grunt.file.read(path.resolve("test/conf/" + key));
			   //  		//在此解析导入进来的文件里面引入的import
			   //  		if(reg.test(con)){
			   //  			// grunt.log.writeln("111111111111");
			   //  			return combine(path.resolve("test/conf/" + key));
			   //  		}else{
			   //  			// grunt.log.writeln(con);
			   //  			return con;
			   //  		}	
			   //  	}	
	     //    	});
		    // }