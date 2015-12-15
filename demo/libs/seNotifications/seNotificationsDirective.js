angular.module("seNotifications.directive", ["seNotifications.service", "pascalprecht.translate",
	"seNotifications.translations", "seNotifications.html"]).
directive("seNotifications", function (SeNotificationsService) {
	"use strict";

	return {
		restrict: "A",
		scope: {
			seNotificationsClass: "@",
			seNotificationsPosition: "@"
		},
		templateUrl: "seNotificationsDirective.html",
		link: function postLink(scope) {
			scope.notifications = SeNotificationsService.notifications;
			scope.markAsRead = SeNotificationsService.markAsRead;
			scope.DEBUG_ENABLED = SeNotificationsService.DEBUG_ENABLED;
		}
	};
});
