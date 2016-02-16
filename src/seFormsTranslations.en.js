angular.module("seForms.translations.en", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("en", {
		"seValidationForm.required": "Required",
		"seValidationForm.email": "Must be a valid e-mail",
		"seValidationForm.seValidateEquality": "Does not match",
		"seValidationForm.max": "Too much",
		"seValidationForm.min": "Too little",
		"seValidationForm.maxlength": "Too long",
		"seValidationForm.minlength": "Too short",
		"seValidationForm.number": "Must be a number"
	});
});
