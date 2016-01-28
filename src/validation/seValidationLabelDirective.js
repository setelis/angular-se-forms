angular.module("seForms.validation.label", ["seForms.validation.constraints.service", "pascalprecht.translate", "seForms.translations"]).
	directive("seValidationLabel", function ($log, SeValidationConstraintsService) {
	"use strict";
	var ELEMENT_ERROR_KEY = "se-forms-constraints-message";

	function link(scope, element, attrs, ngForm) {
		scope.formName = ngForm.$name;
		var formElement = element.closest("[name='"+scope.formName+"'], [data-ng-form='"+scope.formName+"'], [ng-form='"+scope.formName+"']");
		// https://api.jquery.com/category/selectors/ To use any of the meta-characters ( such as  !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name,
		// it must be escaped with with two backslashes: \\
		// https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
		var inputElement = formElement.find("#"+scope.seValidationLabel.replace( /(:|\.|\[|\]|,|\$)/g, "\\$1" ));
		scope.inputName = inputElement.attr("name") || inputElement.attr("data-name");

		scope.$seValidationLabelParent = scope.$parent;
		if (!scope.formName || !scope.inputName) {
			$log.error("seValidationLabel: can't find name", scope.formName, scope.inputName, element);
			return;
		}

		SeValidationConstraintsService.listenForErrors(scope, inputElement, scope.$seValidationLabelParent[scope.formName], scope.inputName, {
			onInvalid: function onInvalid(key, context) {
				scope.errorMessage = key;
				scope.errorMessageContext = context;
			},
			onValid: function onInvalid() {
				scope.errorMessage = null;
				scope.errorMessageContext = null;
			}
		});

		var fieldInfo = inputElement.data(ELEMENT_ERROR_KEY);
		if (!fieldInfo || !fieldInfo.constraints) {
			$log.error("seValidationLabel: could not get field info", inputElement, fieldInfo);
		}
	}
	return {
		restrict: "A",
		templateUrl: "validation/seValidationLabelDirective.html",
		replace: true,
		require: "^form",
		scope: {
			seValidationLabel: "@"
		},
		compile: function (element, attrs) {
			element.find("label").attr("for", attrs.seValidationLabel);
			return link;
		}
	};
});
