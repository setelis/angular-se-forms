angular.module("seForms.validation.external", []).directive("seValidateExternal", function($parse) {
	"use strict";
	var VALIDATION_KEY = "seValidateExternal";

	return {
		restrict: "A",
		require: "ngModel",
		link: function postLink(scope, inputElement, attr, ngModel) {

			scope.$watch(function() {return $parse(attr.seValidateExternal)(scope);}, function(newValue) {
				if (newValue) {
					ngModel.$setValidity(VALIDATION_KEY, false);
					ngModel[VALIDATION_KEY] = newValue;
				} else {
					ngModel.$setValidity(VALIDATION_KEY, true);
					delete ngModel[VALIDATION_KEY];
				}
			});

			scope.$watch(
				function() {return ngModel.$modelValue;},
				function() {
					if (ngModel.$pristine) {
						return;
					}

					// ngModel.$setValidity(VALIDATION_KEY, true);
					// delete ngModel[VALIDATION_KEY];
					$parse(attr.seValidateExternal).assign(scope, null);
				}
			);
		}
	};
});
