
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
					'html5-boilerplate_v5.2.0/css/main.css': 'html5-boilerplate_v5.2.0/sass/scripts.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		},
		wiredep: {
			task: {
				// Point to the files that should be updated when
				// you run `grunt wiredep`
				src: [
				  'html5-boilerplate_v5.2.0/index.html'
				],

				options: {
				  // See wiredep's configuration documentation for the options
				  // you may pass:

				  // https://github.com/taptapship/wiredep#configuration
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'watch']);
};