angular.module("seForms.validation.flagfilter", []).filter("isShowModelValidationFlagSet", function() {
	"use strict";
	function checkSelfOrParent(form) {
		if (form.showModelValidation === true || form.showModelValidation === false) {
			return form.showModelValidation;
		}
		if (form.$$parentForm) {
			return checkSelfOrParent(form.$$parentForm);
		}
		return false;
	}
	return checkSelfOrParent;
});
