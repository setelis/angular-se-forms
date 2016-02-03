angular.module("seForms.autosubmit", ["seEvents.seEventHelperService"]).directive("seFormAutoSubmit",
	function(SeEventHelperService, $parse, $timeout) {
	"use strict";
	var OPTIONS = {
		debounce: 1500
	};
	var SHOW_MODEL_VALIDATION_KEY = "showModelValidation";

	function submitForm(scope, submitExpression) {
		var result = $parse(submitExpression)(scope);
		if (!result || !angular.isFunction(result.then)) {
			throw "seFormAutoSubmit: not a promise: " + submitExpression;
		}
		return result;
	}
	return {
		restrict: "A",
		require: "^form",
		link: function (scope, element, attrs, formController) {
			var options = angular.copy(OPTIONS);
			var timeoutPromise;
			var submitPromise;
			var waiting;
			SeEventHelperService.whenChanged(scope, attrs.seFormAutoSubmitModel, function() {
				if (formController.$pristine) {
					// form should not be submitted if pristine
					return;
				}
				if (timeoutPromise) {
					$timeout.cancel(timeoutPromise);
					timeoutPromise = null;
				}
				if (!formController.$valid) {
					formController[SHOW_MODEL_VALIDATION_KEY] = true;

					return;
				}
				formController[SHOW_MODEL_VALIDATION_KEY] = false;

				timeoutPromise = $timeout(function() {
					var toExecute = function() {
						submitPromise = submitForm(scope, attrs.seFormAutoSubmit);
						submitPromise.then(function() {
							submitPromise = null;
							if (waiting) {
								waiting();
							}
						});
					};
					if (submitPromise) {
						// still executing previous update
						waiting = toExecute;
						return;
					}
					toExecute();
				}, options.debounce);
			}, true);
		}
	};
});
