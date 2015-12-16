angular.module("seNotifications.version", []).service("SeVersionsService", function() {
	"use strict";
	// Default service - should be overrided by Grunt
	var service = this;
	service.getVersionInfo = function() {
		// do not edit this line, because it is referenced by Gruntfile: addVersionInfo(patterns):
		return {version: "_VERSION_", buildDate: "_BUILD_DATE_", buildDateAsString: "_BUILD_DATE_AS_STRING_", commit: "_COMMIT_"};
	};
	window.ANGULAR_APP_VERSION = service.getVersionInfo();
});
