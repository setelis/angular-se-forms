angular.module("seNotifications.translations.en", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("en", {
		"seNotifications.internalError.log.error": "Error occured, please reload the page.",
		"seNotifications.internalError.onerror": "Unexpected error occured, please reload the page.",
		"seNotifications.internalError.exceptionHandler": "Unknown error occured, please reload the page."
	});
});
