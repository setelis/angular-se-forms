(function () {
	"use strict";
	angular.module("seNotifications.logger", ["seEvents.seEventHelperService"]).service("SeNotifiactionsLoggerService", ["$injector", "$rootScope", function($injector, $rootScope) {
		var service = this;
		service.$$init = function() {};
		var oldWindowOnError = window.onerror;
		window.onerror = function errorHandler(errorMsg, url, lineNumber) {

			var result = false;
			if (oldWindowOnError) {
				result = oldWindowOnError.apply(null, arguments);
			}

			var SeEventHelperService = $injector.get("SeEventHelperService");
			SeEventHelperService.safeApply($rootScope, function() {
				var SeNotificationsService = $injector.get("SeNotificationsService");
				var debugInfo = SeNotificationsService.parametersToDebugInfo({
					type: "seNotifications.internalError.onerror",
					errorMsg: errorMsg,
					url: url,
					lineNumber: lineNumber
				});
				SeNotificationsService.notificationBuilder("seNotifications.internalError.onerror", null, debugInfo).type(SeNotificationsService.TYPE.TEXT)
					.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
					.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("seNotifications.internalError.onerror", false).post();
			});

			return result;
		};

	}])
	.config(["$provide", function($provide) {
		function isFlashError(args) {
			// from exception handler
			if (args === "Adode Flash Player need to be installed. To check ahead use \"FileAPI.hasFlash\"") {
				return true;
			}

			// from log.error
			if (args.length && args.length === 2 && args[0] === "Adode Flash Player need to be installed. To check ahead use \"FileAPI.hasFlash\"") {
				return true;
			}
			return false;
		}

		// based on http://stackoverflow.com/questions/13595469/how-to-override-exceptionhandler-implementation
		$provide.decorator("$exceptionHandler", ["$delegate", "$injector", function($delegate, $injector) {
			return function(exception, cause) {
				var SeNotificationsService = $injector.get("SeNotificationsService");

				if (isFlashError(exception)) {
					SeNotificationsService.notificationBuilder("error.noFlashInstalled", null, "error.noFlashInstalled").type(SeNotificationsService.TYPE.TEXT)
						.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
						.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("error.noFlashInstalled", true).doNotNotifyServer().post();
					return;
				}

				$delegate(exception, cause);

				var stack = "";
				if (exception && exception.stack) {
					stack = arguments[0].stack;
				}

				var debugInfo = SeNotificationsService.parametersToDebugInfo({
					type: "seNotifications.internalError.exceptionHandler",
					exception: exception,
					cause: cause,
					stack: stack
				});
				SeNotificationsService.notificationBuilder("seNotifications.internalError.exceptionHandler", null, debugInfo).type(SeNotificationsService.TYPE.TEXT)
					.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
					.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("seNotifications.internalError.exceptionHandler", false).post();

				return $delegate;
			};
		}]);

		// based on http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/
		$provide.decorator( "$log", [ "$delegate", "$injector", function($delegate, $injector) {
			function removeElements(array) {
				var result = [];
				$.each(array, function() {
					var next = this;
					if (next instanceof jQuery) {
						result.push(removeElements(next));
					} else if (angular.isElement(next)){
						var attributes = {};
						$.each(next.attributes, function() {
							if (!angular.isUndefined(this.value || this.nodeValue)) {
								attributes[this.nodeName] = this.value || this.nodeValue;
							}
						});

						result.push("Element: " + $(next).prop("tagName") + "(" + angular.toJson(attributes) + ")");
					} else {
						result.push(next);
					}
				});
				return result;
			}
			var error = $delegate.error;
			var warn = $delegate.warn;
			$delegate.error = function() {
				var SeNotificationsService = $injector.get("SeNotificationsService");

				if (isFlashError(arguments)) {
					SeNotificationsService.notificationBuilder("error.noFlashInstalled", null, "error.noFlashInstalled").type(SeNotificationsService.TYPE.TEXT)
						.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
						.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("error.noFlashInstalled", true).doNotNotifyServer().post();
					return;
				}
				error.apply(null, arguments);


				var stack = "";
				if (arguments.length > 0 && arguments[0] && arguments[0].stack) {
					stack = arguments[0].stack;
				}
				var debugInfo = SeNotificationsService.parametersToDebugInfo({
					type: "seNotifications.internalError.log.error",
					args: removeElements(arguments),
					stack: stack
				});
				SeNotificationsService.notificationBuilder("seNotifications.internalError.log.error", null, debugInfo).type(SeNotificationsService.TYPE.TEXT)
					.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
					.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("seNotifications.internalError.log.error", false).post();

			};
			$delegate.error.logs = error.logs;
			$delegate.warn = function() {
				warn.apply(null, arguments);

				var SeNotificationsService = $injector.get("SeNotificationsService");

				var stack = "";
				if (arguments.length > 0 && arguments[0].stack) {
					stack = arguments[0].stack;
				}
				var debugInfo = SeNotificationsService.parametersToDebugInfo({
					type: "seNotifications.internalError.log.warn",
					args: removeElements(arguments),
					stack: stack
				});
				SeNotificationsService.notificationBuilder("seNotifications.internalError.log.warn", null, debugInfo).type(SeNotificationsService.TYPE.TEXT)
					.severity(SeNotificationsService.SEVERITY.ERROR).position(SeNotificationsService.POSITION.BAR)
					.timeToShow(SeNotificationsService.TIME_TO_SHOW.SHORT).tag("seNotifications.internalError.log.warn", false).post();
			};
			$delegate.warn.logs = warn.logs;

			return $delegate;
		}]);

	}]).run(function(SeNotifiactionsLoggerService) {
		SeNotifiactionsLoggerService.$$init();
	});
})();
