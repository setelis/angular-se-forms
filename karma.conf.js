// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
   "use strict";
   config.set({
      // base path, that will be used to resolve files and exclude
      basePath: "",

      // testing framework to use (jasmine/mocha/qunit/...)
      frameworks: ["jasmine"],

      // list of files / patterns to load in the browser
      files: [
         "bower_components/jquery/dist/jquery.js",
         "bower_components/angular/angular.js",
         "bower_components/angular-mocks/angular-mocks.js",
         "bower_components/lodash/lodash.js",
         "bower_components/restangular/dist/restangular.js",
         "bower_components/angular-translate/angular-translate.js",
         "bower_components/angular-se-events/src/seEventsModule.js",
         "bower_components/angular-se-events/src/*.js",
         "src/seFormsModule.js",
         "src/**/*.js",
         //"test/mock/**/*.js",
         "test/spec/**/*.js"
      ],

      // list of files / patterns to exclude
      exclude: [],

      // web server port
      port: 60080,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config.LOG_INFO,


      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,


      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      browsers: ["Chrome"],
      browserNoActivityTimeout: 300000,
      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 200000,

      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: false
   });
};
