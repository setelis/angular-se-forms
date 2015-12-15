angular.module("seForms.translations.en", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("en", {
		"seValidationForm.required": "Required",
		"seValidationForm.email": "Valid e-mail",
		"seValidationForm.seValidateEquality": "Does not match",
		"seValidationForm.max": "Maximum value",
		"seValidationForm.min": "Minimum value",
		"seValidationForm.maxlength": "Length",
		"seValidationForm.number": "Number"
	});
});
