angular.module("seForms.validation.button", ["seEvents.seEventHelperService"]).directive("seValidationButton", function ($parse, $log, SeEventHelperService) {
	"use strict";
	var SHOW_MODEL_VALIDATION_KEY = "showModelValidation";

	return {
		restrict: "A",
		// less than ng-click as explained here: https://docs.angularjs.org/guide/migration#directives-order-of-postlink-functions-reversed
		// so it should be executed before ng-click and be able to suppres ng-click
		require: "^form",
		priority: -1,
		link: function(scope, element, attrs, ngForm) {
			var formName = ngForm.$name;

			if (!angular.isUndefined(element.attr("href"))) {
				$log.error("seValidationButton: there should not be href - user will be redirected in wrong place when there is error",
					element.attr("href"), element);
			}

			// without this if there is form in form - child form will not know about SHOW_MODEL_VALIDATION_KEY = true
			// and children validation labels will not be shown when flag is set
			function getForms(scope, formName, attrs) {
				var result = $parse(attrs.seValidationButton)(scope) || [];
				result = _.map(result, function(next) {
					// allow expressions like 'dealflowsAdminMembersSettingsDialogForm[\'MemberSearchNewForm\']'
					return $parse(next)(scope[formName]);
				});

				// remove undefineds
				result = _.filter(result, function(next){return !angular.isUndefined(next);});
				result.push(scope[formName]);
				return result;
			}

			function showError() {
				$.each(getForms(scope, formName, attrs), function() {
					this[SHOW_MODEL_VALIDATION_KEY] = true;
				});
			}
			function hideError() {
				$.each(getForms(scope, formName, attrs), function() {
					this[SHOW_MODEL_VALIDATION_KEY] = false;
				});
			}
			function customValidation() {
				if (!attrs.seValidationButtonValidate) {
					return true;
				}
				return $parse(attrs.seValidationButtonValidate)(scope);
			}
			element.on("click", function (event) {
				function errorsToLog(errors) {
					if (!errors) {
						return null;
					}

					var result = {};
					$.each(errors, function(key, value) {

						if (!angular.isArray(value)) {
							result[key] = value;
						} else {
							result[key] = [];
							$.each(value, function() {
								var next = {
									name: this.$name,
									dirty: this.$dirty,
									pristine: this.$pristine,
									invalid: this.$invalid,
									valid: this.$valid,
									showModelValidation: this.showModelValidation,
									errors: errorsToLog(this.$error)
								};

								result[key].push(next);
							});
						}

					});

					return result;
				}
				if (scope[formName].$invalid || !customValidation()) {
					SeEventHelperService.stopEvent(event);
					
					SeEventHelperService.safeApply(scope, function() {
						scope.$emit("$seValidationButtonEvent", element, errorsToLog(scope[formName].$error));
					});

					SeEventHelperService.safeApply(scope, showError);
				} else {
					SeEventHelperService.safeApply(scope, hideError);
				}
			});
		}
	};
});
