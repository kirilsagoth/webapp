
'use strict';


module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
	grunt.initConfig({
		sass: {
			options: {
				includePaths: require('node-bourbon').includePaths,
				sourceMap: true
			},
			dist: {
				files: {
					'html5-boilerplate_v5.2.0/css/scripts.css': 'html5-boilerplate_v5.2.0/sass/scripts.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['watch']);
};