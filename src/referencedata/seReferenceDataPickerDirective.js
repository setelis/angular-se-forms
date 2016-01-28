angular.module("seForms.referencedata.picker", ["seForms.referencedata.service", "ui.select", "pascalprecht.translate", "ngSanitize"])
	.directive("seReferenceDataPicker", function (SeReferenceDataService) {
	"use strict";
	return {
		restrict: "A",
		require: "ngModel",
		scope: {
			type: "@seReferenceDataPicker"
		},
		templateUrl: "referencedata/seReferenceDataPickerDirective.html",
		link: function postLink(scope, inputElement, attr, ngModelCtrl) {
			SeReferenceDataService.get(scope.type).then(function(response) {
				scope.referenceDatum = response;
			});

			// there should be always . in ng-model!
			scope.directive = {};

			scope.$watch(function() {return scope.directive.selected;}, function(newValue) {
				ngModelCtrl.$setViewValue(newValue, "change");
			});
			ngModelCtrl.$formatters.push(function(newValue) {
				scope.directive.selected = newValue;
			});
		}
	};
});
