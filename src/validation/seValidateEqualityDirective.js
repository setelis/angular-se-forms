angular.module("seForms.validation.equality", []).directive("seValidateEquality", function($parse) {
	"use strict";

	return {
		restrict: "A",
		require: "ngModel",
		link: function link(scope, element, attrs, ngModelCtrl) {
			function getOriginalValue() {
				return $parse(attrs.seValidateEquality)(scope);
			}
			function compareStringsUndefinedEmpty(a, b) {
				if (!a && !b) {
					return true;
				}
				return a === b;
			}
			scope.$watch(attrs.seValidateEquality, function(newValue) {
				ngModelCtrl.$setValidity("seValidateEquality", compareStringsUndefinedEmpty(newValue, ngModelCtrl.$viewValue));
			});
			ngModelCtrl.$validators.seValidateEquality = function(modelValue, viewValue) {
				return compareStringsUndefinedEmpty(viewValue, getOriginalValue());
			};
		}
	};
});
