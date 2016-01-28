angular.module("seForms.inputs.checkbox", []).directive("seCheckboxList", function($parse) {
	"use strict";
	function getCheckboxHolder(scope, attrs) {
		var result = $parse(attrs.seCheckboxList)(scope);
		if (result && !angular.isArray(result)) {
			result = [result];
		}
		return result;
	}
	return {
		require: "ngModel",
		restrict: "A",
		link: function(scope, element, attrs, ngModelCtrl) {
			ngModelCtrl.$parsers.push(function(viewValue) {
				function getCurrentListValue(scope, attrs) {
					// values are copied so watch can catch the change
					return angular.copy($parse(attrs.ngModel)(scope));
				}

				var holder = getCheckboxHolder(scope, attrs);
				var list = getCurrentListValue(scope, attrs);
				if (viewValue) {
					list = list || [];
					_.forEach(holder, function(nextValue) {
						if (list.indexOf(nextValue) === -1) {
							list.push(nextValue);
						}
					});
				// if there is no list - nothing will be remove - it is already removed
				} else if (list) {
					_.forEach(holder, function(nextValue) {
						_.pull(list, nextValue);
					});
				}
				return list;
			});
			ngModelCtrl.$formatters.push(function(modelValue) {
				if (!modelValue || modelValue.length === 0 || !angular.isArray(modelValue)) {
					return false;
				}
				var holder = getCheckboxHolder(scope, attrs);
				var result = true;
				_.forEach(holder, function(nextValue) {
					if (modelValue.indexOf(nextValue) === -1) {
						result = false;
						return false;
					}
				});

				return result;
			});
		}
	};
});
