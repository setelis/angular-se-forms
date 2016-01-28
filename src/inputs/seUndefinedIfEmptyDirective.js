angular.module("seForms.inputs.undefinedifempty", []).directive("seUndefinedIfEmpty", function() {
	"use strict";

	return {
		restrict: "A",
		require: "ngModel",
		link: function link(scope, element, attrs, ngModelCtrl) {
			ngModelCtrl.$parsers.push(function(value) {
				if (!value) {
					// TODO undefined should not be returned in parser...
					return;
				}
				return value;
			});
		}
	};
});
