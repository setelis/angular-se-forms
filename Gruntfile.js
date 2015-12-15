// Generated on 2014-02-26 using generator-angular 0.7.1

// # Globbing
// for performance reasons we"re only matching one level down:
// "test/spec/{,*/}*.js"
// use this if you want to recursively match all subfolders:
// "test/spec/**/*.js"
/* global module: false */
/* global process: false */
/* global require: false */
module.exports = function (grunt) {
	"use strict";
	var nowAsString = grunt.template.today("yyyymmddHHMMss");

	function loadNpmTasks() {
		// Load grunt tasks automatically
		require("load-grunt-tasks")(grunt);
		// Time how long tasks take. Can help when optimizing build times
		require("time-grunt")(grunt);

		grunt.loadNpmTasks("grunt-html2js");
		grunt.loadNpmTasks("grunt-targethtml");
		grunt.loadNpmTasks("grunt-html-angular-validate");
		grunt.loadNpmTasks("grunt-file-blocks");
		grunt.loadNpmTasks("grunt-replace");
		grunt.loadNpmTasks("grunt-flow-type-check");
		grunt.loadNpmTasks("grunt-exec");
		grunt.loadNpmTasks("grunt-githash");
	}
	function initConfig() {
		function getValidateTasks(allTasks) {
			if (process.env.SENOTIFICATIONS_FAST === "true") {
				return [];
			}
			if (process.env.SENOTIFICATIONS_W3C_LOCAL_URL && allTasks) {
				return [
					"jshint",
					"karma:unit",
					// "htmlangular:index",
					// "htmlangular:continuous",
					"flow:app"
				];
			} else {
				return [
					"jshint",
					"karma:unit",
					"flow:app"
				];
			}
		}
		grunt.initConfig({
			// Project settings
			yeoman: {
				// configurable paths
				app: require("./bower.json").appPath || "src",
				dist: "dist",
				gen: "gen",
				css: "css"
			},
			files: {
				scripts: "<%= yeoman.app %>/**/*.js",
				unittests: "test/spec/**/*.js",
				templates: "<%= yeoman.app %>/**/*.html"
			},

			// Watches files for changes and runs tasks based on the changed files
			watch: {
				js: {
					files: ["<%= files.scripts %>"],
					tasks: ["newer:jshint:all", "karma:continuous", "flow:app"],
					options: {
						event: ["changed", "added", "deleted"],
						livereload: true
					}
				},
				templates: {
					files: ["<%= files.templates %>"],
					tasks: ["newer:htmlangular:continuous"],
					options: {
						event: ["changed", "added", "deleted"],
						livereload: true
					}
				},
				jsUnitTest: {
					files: ["<%= files.unittests %>"],
					tasks: ["newer:jshint:test", "karma:continuous"],
					options: {
						event: ["changed", "added", "deleted"]
					}
				},
				gruntfile: {
					files: ["Gruntfile.js"],
					tasks: ["jshint:all", "karma:continuous"],
					options: {
						event: ["changed", "added", "deleted"]
					}
				}
			},

			// Make sure code styles are up to par and there are no obvious mistakes
			jshint: {
				options: {
					jshintrc: ".jshintrc",
					reporter: require("jshint-stylish"),
					globals: {
						jQuery: true
					}
				},
				all: [
					"Gruntfile.js",
					"<%= files.scripts %>"
				],
				test: {
					options: {
						jshintrc: "test/.jshintrc"
					},
					src: ["<%= files.unittests %>"]
				}
			},
			// Empties folders to start fresh
			clean: {
				dist: {
					files: [{
						dot: true,
						src: [
							".tmp",
							"<%= yeoman.dist %>/*",
							"!<%= yeoman.dist %>/.git*"
						]
					}]
				}
			},

			replace: {
				flowReportError: {
					options : {
						patterns: [
							{
								match: /^\s+return done\(false\);$/m,
								replacement: "return done('error');"
							},
							{
								match: /^\s+async.eachSeries\(this\.filesSrc, runFlow, callback\);$/m,
								replacement: "async.eachSeries(this.filesSrc, runFlow, function(error){callback(!error);});"
							}
						]
					},
					files: [
						{
							expand: true,
							src: ["<%= yeoman.app %>/../node_modules/grunt-flow-type-check/tasks/flow.js"/*, "<%= yeoman.app %>/bower_components/angular-carousel/dist/angular-carousel.min.js"*/]
						}
					]
				},
				versionInfo: {
					options: {
						patterns: [
							{
								match: new RegExp("return \\{version: \"_VERSION_\", buildDate: \"_BUILD_DATE_\", "+
									"buildDateAsString: \"_BUILD_DATE_AS_STRING_\", commit: \"_COMMIT_\"\\};", "mg"),
								replacement: "\treturn {\n\t\tversion: \""+"<%= githash.main.tag %>"+
									"\",\n\t\tBUILD_NUMBER: \""+ ("0000000"+process.env.BUILD_NUMBER).substr(-7)+
									"\",\n\t\tbuildDate: \""+ nowAsString+
									"\",\n\t\tbranch: \""+ "<%= githash.main.branch %>"+
									"\",\n\t\tcommit: \""+"<%= githash.main.hash %>"+"\"\n\t};"
							}

						]
					},
					files: [
						{
							expand: true,
							src: ["<%= yeoman.dist %>/index.html"]
						}
					]
				}
			},


			// Copies remaining files to places other tasks can use
			copy: {
				src: {
					files: [{
						expand: true,
						dot: true,
						cwd: "<%= yeoman.app %>",
						dest: "<%= yeoman.dist %>",
						src: [
							"**/*.html",
							"**/*.js"
						]
					}]
				},
				css: {
					files: [{
						expand: true,
						dot: true,
						cwd: "<%= yeoman.css %>",
						dest: "<%= yeoman.dist %>",
						src: [
							"**/*.css"
						]
					}]
				}
			},
			htmlmin: {
				templates: {
					options: {
						collapseWhitespace: true,
						collapseBooleanAttributes: true,
						removeCommentsFromCDATA: true,
						removeComments: true//,
						// removeOptionalTags: true
					},
					files: [{
						expand: true,
						cwd: "<%= yeoman.dist %>",
						src: ["**/*.html"],
						dest: "<%= yeoman.dist %>"
					}]
				}
			},
			html2js: {
				options: {
					base: "<%= yeoman.dist %>",
					module: "seForms.html",
					quoteChar: "'"
				},
				main: {
					src: ["<%= yeoman.dist %>/**/*.html"],
					dest: "<%= yeoman.gen %>/seFormsHtml.js"
				}
			},

			// Run some tasks in parallel to speed up the build process
			concurrent: {
				options: {
					logConcurrentOutput: true
				},
				validate: getValidateTasks(true),
				jsvalidate: getValidateTasks(false)
			},
			// Test settings
			karma: {
				continuous: {
					configFile: "karma.conf.js",
					singleRun: true,
					browsers: ["PhantomJS"]
				},
				debug: {
					configFile: "karma.conf.js",
					singleRun: true,
					browsers: [],
					port: 60081
				},
				unit: {
					configFile: "karma.conf.js",
					singleRun: true,
					browsers: getBrowsersForTest(),
					/* coverage */
					preprocessors: {
						"<%= files.scripts %>": ["coverage"]
					},
					// add the coverage plugin
					plugins: [ "karma-jasmine", "karma-firefox-launcher", "karma-chrome-launcher", "karma-phantomjs-launcher", "karma-coverage", "karma-junit-reporter"],
					// add coverage to reporters
					reporters: ["dots", "coverage", "junit"],
					// tell karma how you want the coverage results
					coverageReporter: {
						reporters : [
							{ type : "html", dir : "coverage/" },
							{ type : "cobertura", file: "coverage.xml" }
						]
					},
					junitReporter : {
						outputFile: "target/test-results.xml",
						suite: ""
					}
					/* /coverage */

				}
			},
			htmlangular: {
				options: {
					angular: false,
					wrapping: {
						"tr": "<table>{0}</table>"
					},
					w3clocal: process.env.SENOTIFICATIONS_W3C_LOCAL_URL?process.env.SENOTIFICATIONS_W3C_LOCAL_URL:null,
					//i'm not sure why in local instalation these errors exists:
					relaxerror: process.env.SENOTIFICATIONS_W3C_LOCAL_URL?[
						"The date input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.",

						"The Content-Type was text/html. Using the HTML parser.",
						"Using the schema for HTML5 + SVG 1.1 + MathML 3.0 + RDFa Lite 1.1.",
						"Attribute data-ng-attr-height not allowed on element rect at this point.",
						"Attribute data-ng-attr-y not allowed on element rect at this point."
					]:[]
				},
				continuous: {
					options: {
						tmplext: ".html"
					},
					files: {
						src: ["<%= files.templates %>"]
					}
				},
				selected: {
					options: {
						wrapping: {
							"tr": "<table>{0}</table>"
						},
						tmplext: ".html"
					},
					files: {
						src: process.env.file
					}
				}
			},
			flow: {
				app: {
					options: {
						"lib": "flow/",
						"retries": 25
					},
					files: {
						src: ["<%= files.scripts %>"]
					}
				}
			},
			exec: {
				stopFlow: "node_modules/grunt-flow-type-check/bin/"+process.platform+"/flow stop"
			},
			githash: {
				options: {},
				main: {}
			}
		});

	}
	function registerTasks() {
		grunt.registerTask("test", [
			"prepare",
			"concurrent:validate",
			"exec:stopFlow"
		]);

		grunt.registerTask("prepare", [
			"githash",
			"clean:dist",
			"replace:flowReportError"
		]);

		//update buildnotminified as described in comment
		grunt.registerTask("build", [
			// "prepare",
			// "test",
			// "concurrent:dist",
			"copy:src",
			"copy:css",
			"htmlmin:templates",
			"html2js:main",
			"replace:versionInfo"
		]);

		//same as build, but useminPrepare:notminifiedjs replaces useminPrepare:minifiedjs and uglify is removed
		grunt.registerTask("buildnotminified", [
			// "prepare",
			"test",
			"concurrent:dist",
			"replace:versionInfo"
		]);
		grunt.registerTask("default", [
			"test"
			// "protractor:dist"
			// "build"
		]);

		grunt.registerTask("kd", ["karma:debug"]);
	}

	function getBrowsersForTest() {
		if (process.env.SENOTIFICATIONS_BROWSERS_FOR_TEST) {
			return process.env.SENOTIFICATIONS_BROWSERS_FOR_TEST.split(",");
		} else {
			return ["Chrome", "Firefox", "PhantomJS"];
		}
	}

	loadNpmTasks();
	initConfig();
	registerTasks();
};
