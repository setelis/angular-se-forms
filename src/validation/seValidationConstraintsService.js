angular.module("seForms.validation.constraints.service", ["seForms.validation.constraints.service.configuration", "seForms.validation.flagfilter"]).
	service("SeValidationConstraintsService", function(SeValidationConstraintsConfiguration, $log,
	isShowModelValidationFlagSetFilter) {
	"use strict";
	var service = this;

	var configuration = SeValidationConstraintsConfiguration;


	function attachMethods() {
		service.getConstraints = function(dtoName) {
			return configuration[dtoName] || {};
		};
		service.listenForErrors = function(scope, inputElement, form, inputName, callbacks) {
			var ELEMENT_ERROR_KEY = "se-forms-constraints-message";
			var ELEMENT_CUSTOM_MESSAGE_KEY_PREFIX = "data-se-validation-group-message-";
			var WITHOUT_SHOW = ["serverValidation", "serverLiveValidation", "seValidateExternal"];
			function replaceError(error/*, errors*/) {
				/*
				if (error === "seValidationVideo" && (errors.indexOf("pattern") > -1)) {
					return "pattern";
				}
				*/
				return error;
			}
			function findConstraint(inputElement, constraintName) {
				var data = inputElement.data(ELEMENT_ERROR_KEY);
				if (!data || !data.constraints || !angular.isArray(data.constraints)) {
					return null;
				}
				return _.find(data.constraints, {name: constraintName}) || null;
			}
			function findConstraintMessageKey(inputElement, constraintName) {
				function byConstraintName() {
					if (constraintName === "serverValidation" &&
							form[inputName].serverValidation && form[inputName].serverValidation.template) {
						return form[inputName].serverValidation.template;
					}
					if (constraintName === "seValidateExternal" &&
							form[inputName].seValidateExternal) {
						return form[inputName].seValidateExternal;
					}
				}
				function byCustomValue() {
					if (inputElement.attr(ELEMENT_CUSTOM_MESSAGE_KEY_PREFIX+constraintName)) {
						return inputElement.attr(ELEMENT_CUSTOM_MESSAGE_KEY_PREFIX+constraintName);
					}
				}
				function byLowPriorityConstraintName() {
					if (constraintName === "serverLiveValidation" &&
							form[inputName].serverLiveValidation && form[inputName].serverLiveValidation.template) {
						return form[inputName].serverLiveValidation.template;
					}
				}
				function byConstraintMessage() {
					var constraint = findConstraint(inputElement, constraintName);
					if (constraint && constraint.message) {
						return constraint.message;
					}
				}
				function forNumbers() {
					if (constraintName === "number") {
						var data = inputElement.data(ELEMENT_ERROR_KEY);
						if (data && data.type === "Integer") {
							return "integer";
						}
					}
				}
				return byConstraintName() || byCustomValue() || byLowPriorityConstraintName() || byConstraintMessage() || forNumbers() || constraintName;
			}
			function handleWithoutShowErrors(errors) {
				var withoutShow = _.find(errors, function(next) {
					return WITHOUT_SHOW.indexOf(next) > -1;
				});
				if (withoutShow) {
					callbacks.onInvalid(findConstraintMessageKey(inputElement, withoutShow), null);
					return true;
				}
			}
			var fieldInfo = inputElement.data(ELEMENT_ERROR_KEY);
			if (!fieldInfo || !fieldInfo.constraints) {
				$log.error("SeValidationConstraintsConfiguration: could not get field info", inputElement, fieldInfo);
			}

			scope.$watchCollection(function() {
				var result = [isShowModelValidationFlagSetFilter(form)];
				if (form[inputName] && form[inputName].$error) {
					$.each(form[inputName].$error, function(key, value) {
						if (value) {
							result.push(key);
						}
					});
				}
				return result;
			}, function(errors) {
				function isRequiredError(form, inputName) {
					var result = false;
					if (form[inputName] && form[inputName].$error) {
						$.each(form[inputName].$error, function(key, value) {
							if (!value) {
								return;
							}
							if (key === "required-multiple" || key === "required") {
								result = true;
								// stop the loop:
								return false;
							}
						});
					}
					return result;
				}


				// first element is showModalValidation
				var showModelValidation = errors[0];
				errors = errors.slice(1);
				callbacks.onValid();
				if (errors.length === 0) {
					return;
				}
				if (handleWithoutShowErrors(errors)) {
					return;
				}

				if (!showModelValidation) {
					if (callbacks.onRequiredInfo && isRequiredError(form, inputName)) {
						callbacks.onRequiredInfo();
					}
					return;
				}

				$.each(errors, function() {
					var error = this;
					error = replaceError(error, errors);
					callbacks.onInvalid(findConstraintMessageKey(inputElement, error), findConstraint(inputElement, error), error);
					// only first error
					return false;
				});
			});
		};
	}
	attachMethods();

});
