/*jshint -W072 */
angular.module("seNotifications.service", ["restangular", "seNotifications.version"])
.service("SeNotificationsService", function($log, $timeout, $window, $rootScope,
	$injector, SeVersionsService) {
/*jshint +W072 */
	"use strict";

	var service = this;
	var lastStates = [];
	var httpErrorHideConfiguration = false;

	service.TYPE = {
		TEXT: "TEXT",
		DEAL: "DEAL",
		FOLDER: "FOLDER"
	};
	service.SEVERITY = {
		ERROR: "ERROR",
		INFO: "INFO"
	};
	service.POSITION = {
		BAR: "BAR",
		SERVER: "SERVER"
	};
	service.TIME_TO_SHOW = {
		SHORT: 5000,
		MEDIUM: 10000,
		LONG: 20000
	};
	// change to false in production
	// service.DEBUG_ENABLED = true; // REPLACE_DEVELOPMENT
	service.DEBUG_ENABLED = false; // REPLACE_STAGE
	// service.DEBUG_ENABLED = false; // REPLACE_PRODUCTION

	function pushState(fromState, toState, eventPrevented) {
		lastStates.unshift({
			eventPrevented: eventPrevented,
			toState: toState,
			fromState: fromState,
			now: new Date(),
			actions: []
		});
		lastStates.length = Math.min(25, lastStates.length);
	}

	function initScope() {
		function logStates() {
			function elementToString(element) {
				function lastElement() {
					if (element.length === 0) {
						return "0";
					}
					if (element.is("body")) {
						return "body";
					}
					if (element.is("#main")) {
						return "#main";
					}
				}
				if (lastElement()) {
					return lastElement();
				}

				var ATTRS = ["data-ng-click", "data-ui-sref", "data-target"];
				function getSiblingIndex(element) {
					return element.siblings().size()  - element.nextAll().size() + 1;
				}
				var result = element.prop("tagName") + "["+getSiblingIndex(element)+"]";
				var id = element.attr("id");
				var classes = element.attr("class");
				if (id) {
					result+=("#"+id);
				}
				if (classes) {
					result+=("."+classes);
				}
				$.each(ATTRS, function() {
					if (element.attr(this)) {
						result+= ("|" + this + "=" + element.attr(this));
					}
				});

				return result + " < " + elementToString(element.parent());
			}
			$rootScope.$on("$locationChangeStart", function(event, toState, fromState) {
				pushState(fromState, toState, event.defaultPrevented);
			});
			$rootScope.$on("$seValidationButtonEvent", function(event, element, errors) {
				service.logAction({
					name: "$seValidationButtonEvent",
					ceValidationButtonEvent: {
						errors: errors,
						element: elementToString(element)
					}
				});
			});

			$(document).click(function(event) {
				if (!event.target) {
					return;
				}
				service.logAction({
					name: "clickEvent",
					click: elementToString($(event.target))
				});
			});
		}
		service.notifications = [];

		/*jshint -W072 */
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
		/*jshint +W072 */
			$log.error("SeNotificationsService $stateChangeError", event, toState, toParams, fromState, fromParams, error);
		});

		/*jshint -W072 */
		$rootScope.$on("$stateNotFound", function(event, unfoundState, fromState, fromParams) {
		/*jshint +W072 */
			var strippedUnfoundState = {
				// options are removed because they are causing "TypeError: Converting circular structure to JSON" error
				to: unfoundState.to,
				toParams: unfoundState.toParams
			};
			$log.error("SeNotificationsService $stateNotFound", event, strippedUnfoundState, fromState, fromParams);
		});

		logStates();
	}
	function attachMethods() {
		var continousPostsCount = 0;
		var lastTimePosted = 0;
		var MAX_CONTINOUS_POSTS_COUNT = 10;
		var CONTINOUS_WAIT_TIME = 2000;
		function checkContinous() {
			var now = new Date().getTime();
			if ((now - lastTimePosted) < CONTINOUS_WAIT_TIME) {
				continousPostsCount++;
			} else {
				continousPostsCount = 1;
			}
			lastTimePosted = now;

			if (continousPostsCount > MAX_CONTINOUS_POSTS_COUNT) {
				return false;
			}
			return true;
		}

		service.markAsRead = function(notification) {
			_.pull(service.notifications, notification);
		};
		service.notificationBuilder = function(template, parameters, debugInfo, hideIfDebugIsDisabled) {

			function removeNotificationsWithSameTag(notification) {
				if (notification.removeSameTag) {
					service.removeTag(notification.tag);
				}
				delete notification.removeSameTag;
			}
			function checkNotification(notification) {
				var REQUIRED_FIELDS = ["template", "type", "severity", "position", "timeToShow", "tag"];
				$.each(REQUIRED_FIELDS, function() {
					if (!notification[this]) {
						$log.error("SeNotificationsService: no info for " + this + " in " + notification.template, notification);
						throw "SeNotificationsService: no info for " + this + " in " + notification.template;
					}
				});
			}
			var notification /*: any */ = {
				template: template,
				parameters: parameters,
				debugInfo: debugInfo,
				version: SeVersionsService.getVersionInfo()
			};

			// builder pattern
			var result = {};
			result.post = function() {

				function displayAndSend(notification) {
					function shouldSkipThisNotification(notification) {
						function eventsError(debugInfo) {
							if (debugInfo.indexOf("'toFixed'") !== -1) {
								return true;
							}
							if (debugInfo.indexOf("'elapsedTime'") !== -1) {
								return true;
							}
							return false;
						}
						function oldBrowser(debugInfo) {
							if (debugInfo.indexOf("compatible;'MSIE'8'0;'Windows'") !== -1) {
								return true;
							}
							return false;
						}
						function skipSend(debugInfo) {
							if ((notification.template === "seNotifications.internalError.onerror" ||
								notification.template === "seNotifications.internalError.exceptionHandler" || notification.template === "seNotifications.internalError.log.error") &&
								oldBrowser(debugInfo)) {
								return true;
							}
							if (notification.template === "httperrors.0" &&
								(debugInfo.indexOf("'RESPONSESTATUSCODE:'0,''RESPONSESTATUSTEXT") !== -1)) {
								return true;
							}
							if (debugInfo.indexOf("http://www'baidu'com/search/spider'html") !== -1) {
								return true;
							}
							return false;
						}
						var result = {
							skipShow: false,
							skipSend: false
						};
						if (!notification.debugInfo) {
							return result;
						}
						var debugInfo = "'" + notification.debugInfo.replace(/[."'\\\s]/g, "'") + "'";

						if (notification.template === "seNotifications.internalError.onerror" &&
							(eventsError(debugInfo))) {
							result.skipShow = true;
							result.skipSend = true;
						} else if (skipSend(debugInfo)) {
							result.skipShow = false;
							result.skipSend = true;
						}

						return result;
					}

					function sendToServer(notification) {
						if (notification.severity !== service.SEVERITY.ERROR) {
							return;
						}
						var logsRest = $injector.get("Restangular").all("logs");

						logsRest.post({message: angular.toJson(notification) + ";LASTSTATES: "+angular.toJson(lastStates)}, {}, {ceServerValidate: true});
					}


					var shouldSkip = shouldSkipThisNotification(notification);
					if (!shouldSkip.skipShow && notification.position !== service.POSITION.SERVER) {
						service.notifications.push(notification);
					}
					if (!shouldSkip.skipSend && !notification.doNotNotifyServer) {
						sendToServer(notification);
					}
				}
				if (!checkContinous()) {
					return;
				}
				$log.info("SeNotificationsService: post notification " + notification.template, notification);
				checkNotification(notification);

				removeNotificationsWithSameTag(notification);
				if (hideIfDebugIsDisabled && !service.DEBUG_ENABLED) {
					return notification;
				}

				displayAndSend(notification);

				//blur should be removed before scrolling
				$timeout(function() {
					$($window).scrollTop(0);
				}, 100);

				$timeout(function() {
					$log.debug("SeNotificationsService: autoremoving notification", notification);
					service.markAsRead(notification);
				}, notification.timeToShow);

				// notification should not be edited outside! used only for markAsRead
				return notification;
			};

			result.type = function(type) {notification.type = type; return result;};
			result.severity = function(severity) {notification.severity = severity; return result;};
			result.position = function(position) {notification.position = position; return result;};
			result.timeToShow = function(timeToShow) {notification.timeToShow = timeToShow; return result;};
			result.doNotNotifyServer = function() {notification.doNotNotifyServer = true;return result;};
			result.tag = function(tag, removeSameTag) {notification.tag = tag; notification.removeSameTag = removeSameTag; return result;};
			return result;
		};
		service.removeTag = function(tag) {
			var removed = _.remove(service.notifications, {tag: tag});

			if (removed.length > 0) {
				$log.info("SeNotificationsService removed by tag: ", removed);
			}
		};
		service.httpErrorToDebugInfo = function(errorResponse) {
			var result = "{code}\n";
			// \\ is replaced by \\\\ because ZeroClipboard can't handle this case
			// \n and \t - human readable
			var HANDLERS = [
				{ name: "LOCALURL", handler: function() {return window.location.href;} },
				{ name: "URL", handler: function() {return errorResponse.config.url;} },
				{ name: "METHOD", handler: function() {return errorResponse.config.method;} },
				{ name: "PARAMETERS", handler: function() {return (angular.toJson(errorResponse.config.params, true)||"").replace(/\\"/g, "\\\\\"");} },
				{ name: "REQUESTBODY", handler: function() {return (angular.toJson(errorResponse.config.data, true)||"").replace(/\\"/g, "\\\\\"");} },
				{ name: "RESPONSESTATUSCODE", handler: function() {return errorResponse.status;} },
				{ name: "RESPONSESTATUSTEXT", handler: function() {return errorResponse.statusText;} },
				{ name: "RESPONSEDATA", handler: function() {
					return (angular.toJson(errorResponse.data, true)||"").replace(/\\"/g, "\\\\\"").replace(/\\n/g, "\n").replace(/\\t/g, "\t");
				}},
				{ name: "DATE", handler: function() {return new Date();} },
				{ name: "TIME", handler: function() {return new Date().getTime();} },
				{ name: "USERAGENT", handler: function() {return navigator.userAgent;} }
			];

			$.each(HANDLERS, function() {
				result += this.name + ": " + this.handler() + ", \n";
			});
			return result + "\n{code}";
		};
		service.parametersToDebugInfo = function(parameters) {
			var result = "{code}\n";
			function handle(result, jsonFunc) {
				var HANDLERS = [
					{ name: "LOCALURL", handler: function() {return window.location.href;} },
					{ name: "TYPE", handler: function() {return parameters.type;} },
					{ name: "PARAMETERS", handler: function() { return jsonFunc();}},
					{ name: "DATE", handler: function() {return new Date();} },
					{ name: "TIME", handler: function() {return new Date().getTime();} },
					{ name: "USERAGENT", handler: function() {return navigator.userAgent;} }
				];

				$.each(HANDLERS, function() {
					result += this.name + ": " + this.handler() + ", \n";
				});

				return result;
			}

			try {
				result += handle(result,  function() {
					return angular.toJson(parameters, true) ||"";
				});
			} catch(err) {
				result += handle(result, function() {
					var json = "{ \n";
					$.each(parameters, function (key, value) {
						json += "" + key + ": " + value + ", \n";
					});
					return json + " }";
				});
			}

			return result + "\n{code}";
		};
		service.handleHttpError = function(handlersConfiguration) {
			if (!angular.isArray(handlersConfiguration)) {
				throw "SeNotificationsService: handlersConfiguration must be array: " + handlersConfiguration;
			}
			if (httpErrorHideConfiguration) {
				$log.error("SeNotificationsService: handleHttpError, but already hidden", handlersConfiguration, httpErrorHideConfiguration);
			} else {
				httpErrorHideConfiguration = handlersConfiguration;
			}
			return function(errorResponse) {
				var handled = false;
				$.each(handlersConfiguration, function() {
					if (errorResponse && this.error  && this.code  && errorResponse.status === this.code && errorResponse.data.status.error === this.error) {
						this.handler();
						handled = true;
						return false;
					}

					if (errorResponse && this.code && errorResponse.status === this.code) {
						this.handler();
						handled = true;
						return false;
					}

					if (errorResponse && this.error && this.error === errorResponse.data.status.error) {
						this.handler();
						handled = true;
						return false;
					}
				});
				if (!handled) {
					service.notificationBuilder("httperrors.unknown", null, service.httpErrorToDebugInfo(errorResponse))
						.type(service.TYPE.TEXT)
						.severity(service.SEVERITY.ERROR).position(service.POSITION.BAR)
						.timeToShow(service.TIME_TO_SHOW.SHORT).tag("SeNotificationsService.handleHttpError", false).post();
				}

			};
		};
		service.logAction = function(action) {
			if (lastStates.length === 0) {
				pushState("<unknown>", "<unknown>", false);
			}
			var actions = lastStates[0].actions;
			actions.unshift({
				now: new Date(),
				message: action
			});
			actions.length = Math.min(100, actions.length);
		};
		service.getAndClearHttpErrorHideFlag = function() {
			var result = !!httpErrorHideConfiguration;
			httpErrorHideConfiguration = false;
			return result;
		};


		service.showNotificationInfo = function(msgKey, parameters, tag) {
			tag = tag || msgKey;
			service.notificationBuilder(msgKey, parameters).type(service.TYPE.TEXT)
				.severity(service.SEVERITY.INFO).position(service.POSITION.BAR)
					.timeToShow(service.TIME_TO_SHOW.MEDIUM).tag(tag, true).post();
		};

		service.showNotificationError = function(msgKey, parameters, tag) {
			tag = tag || msgKey;
			service.notificationBuilder(msgKey, parameters).type(service.TYPE.TEXT)
			.severity(service.SEVERITY.ERROR).position(service.POSITION.BAR)
				.timeToShow(service.TIME_TO_SHOW.LONG).tag(tag, true).post();
		};
	}

	initScope();
	attachMethods();
});
