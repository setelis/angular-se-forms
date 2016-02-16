angular.module("seForms.translations.bg", ["pascalprecht.translate"]).config(function($translateProvider) {
	"use strict";
	$translateProvider.translations("bg", {
		"seValidationForm.required": "Задължително",
		"seValidationForm.email": "Въведете валиден e-mail адрес",
		"seValidationForm.seValidateEquality": "Не съвпадат",
		"seValidationForm.max": "Твърде много",
		"seValidationForm.min": "Твърде малко",
		"seValidationForm.maxlength": "Твърде дълго",
		"seValidationForm.minlength": "Твърде късо",
		"seValidationForm.number": "Въведете число"
	});
});
