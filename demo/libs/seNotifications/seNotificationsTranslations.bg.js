angular.module("seNotifications.translations.bg", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("bg", {
		"seNotifications.internalError.log.error": "Вътрешна грешка, моля презаредете страницата.",
		"seNotifications.internalError.onerror": "Възникна неочаквана грешка, моля презаредете страницата.",
		"seNotifications.internalError.exceptionHandler": "Възникна проблем, моля презаредете страницата."
	});
});
