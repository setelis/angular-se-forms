angular.module("seForms.validation.directive", ["seForms.validation.constraints.service", "seForms.validation.label",
	"seForms.validation.tooltip"]).directive("seValidationForm", function (SeValidationConstraintsService, $log) {
	"use strict";
	var ATTRIBUTE_CUSTOMIZATIONS = "data-se-validation-form-customizations";
	var ATTRIBUTE_CUSTOMIZATIONS_DEFAULT_VALUE = "highlight,tooltip";
	var ATTRIBUTE_CUSTOMIZATIONS_SPLITTER = ",";
	var ELEMENT_ERROR_KEY = "data-se-forms-constraints-message";
	var ELEMENT_CUSTOM_MESSAGE_KEY_PREFIX = "se-validation-group-message-";
	var ID_SUFFIX = "ValidationId";
	// when adding to SELECTOR, please add to INTEGRITY_CHECKERS, too
	var SELECTOR = "input[name], textarea[name], select, div[data-ng-model]";
	var CONSTRAINT_REQUIRED = "required";

	function explicitSkipElement(element) {
		return (element.data("seValidationFormSkip") === true) || element.is("input[type='file']");
	}

	var HANDLERS = {
		// adds directives for https://docs.angularjs.org/api/ng/directive/input
		required: function(field, element, constraint) {
			if (constraint.value !== "true") {
				$log.error("seValidationForm: Element has required constraint: false", constraint, field, element);

				checkIfExplicitRequired(field, element);
				return;
			}
			element.attr("data-ng-required", constraint.value);
			element.attr("data-required-multiple", constraint.value);
		},
		maxlength: function(field, element, constraint) {
			element.attr("data-ng-maxlength", constraint.value);
		},
		minlength: function(field, element, constraint) {
			element.attr("data-ng-minlength", constraint.value);
		},
		pattern: function(field, element, constraint) {
			var newConstraint = constraint.value;

			var REPLACEMENTS = [
				{
					from: "\\p{Alpha}",
					to: "[a-zA-Z]"
				},
				{
					from: "\\p{Punct}",
					to: "[!\"#$%&'()*+,-./:;<=>?@\\[\\\\\\]^_`{|}~]"
				}
			];

			$.each(REPLACEMENTS, function() {
				var nextReplacement = this;
				var before = null;
				// more than once replacement of same pattern
				while(before !== newConstraint) {
					before = newConstraint;

					newConstraint = newConstraint.replace(nextReplacement.from, nextReplacement.to);
				}
			});
			element.attr("data-ng-pattern", "/" + newConstraint + "/");
		},
		// https://docs.angularjs.org/api/ng/input/input%5Bnumber%5D
		min: function(field, element, constraint) {
			element.attr("min", constraint.value);
			element.attr("type", "number");
		},
		max: function(field, element, constraint) {
			element.attr("max", constraint.value);
			element.attr("type", "number");
		},
		email: function(field, element, constraint) {
			if (constraint.value !== "true") {
				$log.error("seValidationForm: Element has email constraint: false", constraint, field, element);
				return;
			}

			element.attr("type", "email");
		},
		number: function(field, element, constraint) {
			if (constraint.value !== "true") {
				$log.error("seValidationForm: Element has number constraint: false", constraint, field, element);
				return;
			}
			element.attr("type", "number");
		},
		positive: function(field, element, constraint) {
			// assuming integers
			if (constraint.value !== "true") {
				$log.error("seValidationForm: Element has positive constraint: false", constraint, field, element);
				return;
			}
			element.attr("type", "number");
			element.attr("min", 1);
		},
		nonnegative: function(field, element, constraint) {
			// assuming integers
			if (constraint.value !== "true") {
				$log.error("seValidationForm: Element has nonnegative constraint: false", constraint, field, element);
				return;
			}
			element.attr("type", "number");
			element.attr("min", 0);
		}
	};
	function checkIfExplicitRequired(field, element) {
		// there are data-ng-required in places where input is not required by the model
		// and validation message is bad: "validation."
		if (!(angular.isUndefined(element.attr("data-ng-required")) && angular.isUndefined(element.attr("data-required")) &&
			angular.isUndefined(element.attr("required")) && angular.isUndefined(element.attr("data-required-multiple")))) {
			var customMessage = element.data(ELEMENT_CUSTOM_MESSAGE_KEY_PREFIX+CONSTRAINT_REQUIRED);
			if (!customMessage) {
				$log.error("seValidationForm: Element has no model constraint, but there is one in the element", field, element);
				element.removeAttr("data-ng-required data-required required data-required-multiple");
			}
			// custom message will be added in validation label
		}
	}

	function addHandlers(field, element) {
		var hasRequired = false;
		$.each(field.constraints, function() {
			var handler = HANDLERS[this.name];
			handler(field, element, this);
			hasRequired = hasRequired || (this.name === CONSTRAINT_REQUIRED);
		});

		if (!hasRequired) {
			checkIfExplicitRequired(field, element);
		}
	}
	function integrityCheck(element) {
		function getNameFromNgModel(ngModel) {
			var index = ngModel.lastIndexOf(".");
			return ngModel.substring(index + 1);
		}
		function checkEqualName(ngModel, name) {
			return getNameFromNgModel(ngModel) === name;
		}
		function implicitlyAddName(element, ngModelDataProperty, nameAttr) {
			var ngModel = element.data(ngModelDataProperty);
			if (ngModel && !element.attr(nameAttr)) {
				var name = getNameFromNgModel(ngModel);
				element.attr(nameAttr, name);
			}
		}

		var INTEGRITY_CHECKERS = [
			{
				selector: "input",
				checker: function(element, parent) {
					if (!element.data("ng-model")) {
						$log.error("seValidationForm: input should have ng-model", element, parent);
						return;
					}
					implicitlyAddName(element, "ng-model", "name");
					if (!element.attr("name")) {
						$log.error("seValidationForm: input should have name", element, parent);
					} else if(!element.is("input[type='checkbox']") && !checkEqualName(element.data("ng-model"), element.attr("name"))) {
						$log.error("seValidationForm: input name does not match ng-model name", getNameFromNgModel(element.data("ng-model")), element.attr("name"), element, parent);
					}
				}
			},
			{
				selector: "textarea",
				checker: function(element) {
					if (!element.data("ng-model")) {
						$log.error("seValidationForm: textarea should have ng-model", element, parent);
						return;
					}
					implicitlyAddName(element, "ng-model", "name");

					if (!element.attr("name")) {
						$log.error("seValidationForm: textarea should have name", element, parent);
					} else if(!checkEqualName(element.data("ng-model"), element.attr("name"))) {
						$log.error("seValidationForm: textarea name does not match ng-model name", getNameFromNgModel(element.data("ng-model")), element.attr("name"), element, parent);
					}
				}
			},
			{
				selector: "select",
				checker: function(element) {
					if (!element.data("ng-model")) {
						$log.error("seValidationForm: select should have ng-model", element, parent);
						return;
					}
					implicitlyAddName(element, "ng-model", "name");

					if (!element.attr("name")) {
						$log.error("seValidationForm: select should have name", element, parent);
					} else if(!checkEqualName(element.data("ng-model"), element.attr("name"))) {
						$log.error("seValidationForm: select name does not match ng-model name", getNameFromNgModel(element.data("ng-model")), element.attr("name"), element, parent);
					}
				}
			},
			{
				selector: "div[data-ng-model]",
				checker: function(element) {
					if (!element.data("ng-model")) {
						$log.error("seValidationForm: div[data-ng-model] should have ng-model", element, parent);
						return;
					}
					implicitlyAddName(element, "ng-model", "data-name");

					if (!element.attr("data-name")) {
						$log.error("seValidationForm: div[data-ng-model] should have name", element, parent);
					} else if(!checkEqualName(element.data("ng-model"), element.attr("data-name"))) {
						$log.error("seValidationForm: div[data-ng-model] name does not match ng-model name", getNameFromNgModel(element.data("ng-model")), element.attr("data-name"), element, parent);
					}
				}
			}
		];
		$.each(INTEGRITY_CHECKERS, function() {
			var checker = this;
			var all = element.find(checker.selector);

			$.each(all, function() {
				var $this = $(this);
				if (explicitSkipElement($this)) {
					return;
				}
				checker.checker($this, element);
			});
		});
	}
	function getFieldConfiguration(element, attrs) {
		if (attrs.seValidationFormConfiguration) {
			return angular.fromJson(attrs.seValidationFormConfiguration);
		} else {
			var result = SeValidationConstraintsService.getConstraints(attrs.seValidationForm);
			if (attrs.seValidationFormOverride) {
				result = angular.copy(result);

				(function merge() {
					// does not work in cases when user wants to add constraints to existing field
					// new constraints are not appended, but overrides the array elements (at specified index)
					// _.merge(result, angular.fromJson(attrs.seValidationFormOverride));

					function addFieldConstraints(result, fieldName, fieldInfo) {
						if (!result[fieldName]) {
							// no such field in configuration
							result[fieldName] = fieldInfo;
							return;
						}
						if (!result[fieldName].constraints) {
							throw "seValidationForm: No constraints for " + attrs.seValidationFormOverride;
						}
						$.each(fieldInfo.constraints, function() {
							var constraint = this;
							_.remove(result[fieldName].constraints, {name: constraint.name});
							result[fieldName].constraints.push(constraint);
						});

					}
					$.each(angular.fromJson(attrs.seValidationFormOverride), function(key, value) {
						addFieldConstraints(result, key, value);
					});

				})();
			}
			return result;
		}
	}
	return {
		// more than ng-if
		priority: 600+1,
		restrict: "A",
		// this should be in compile in order to be executed before compilation of children
		// so added ng attributes to be compiled
		compile: function compile(element, attrs) {
			function addCustomizations(inputElement, name) {
				var CUSTOMIZATIONS = {
					highlight: function addHighlightedHandler(form, inputElement, name) {
						var div = inputElement.parent();
						if (div.attr("data-ng-class")) {
							//already set
							return;
						}
						div.attr("data-ng-class", "{'highlighted has-error': (" + form.name + "." + name + ".$invalid && (" + form.name + "| isShowModelValidationFlagSet))}");
					},
					label: function addValidationLabel(form, inputElement, name) {
						if (!inputElement.attr("id")) {
							inputElement.attr("id", name + ID_SUFFIX);
						}
						if (form.element.find("[data-se-validation-label='" + inputElement.attr("id") + "']").length > 0) {
							//already set
							return;
						}
						inputElement.parent().addClass("form-group");

						var div = $("<div />", {
							"class": "form-group has-error",
							"data-ng-if": form.name + "." + name + ".$invalid && (" + form.name + ".showModelValidation || " +
								form.name + "." + name + ".$error.serverValidation || " +
								form.name + "." + name + ".$error.serverLiveValidation)"
						});
						div.append($("<div />", {"data-se-validation-label": inputElement.attr("id")}));

						div.insertBefore(inputElement);
					},
					tooltip: function addValidationTooltip(form, inputElement) {
						inputElement.attr("data-se-validation-tooltip", "");
					}
				};
				function getForm(element) {
					var formElement = element.closest("form[name], [data-ng-form], [ng-form]");
					var formName = formElement.attr("name") || formElement.attr("data-ng-form") || formElement.attr("ng-form");
					if (!formElement || !formName) {
						$log.error("seValidationForm: can't find formName", element, formElement, formName);
					}
					return {
						element: formElement,
						name: formName
					};
				}
				function getCustomizations(element, inputElement) {
					var result = [];
					var customizationNames = inputElement.attr(ATTRIBUTE_CUSTOMIZATIONS) || element.attr(ATTRIBUTE_CUSTOMIZATIONS) ||
						ATTRIBUTE_CUSTOMIZATIONS_DEFAULT_VALUE;
					_.forEach(customizationNames.split(ATTRIBUTE_CUSTOMIZATIONS_SPLITTER), function(nextValue) {
						var next = CUSTOMIZATIONS[nextValue];
						if (!next) {
							$log.error("No such customization", nextValue, customizationNames, inputElement);
							return;
						}
						result.push(next);
					});
					return result;
				}

				var customizations = getCustomizations(element, inputElement);
				var form = getForm(inputElement);
				_.forEach(customizations, function(nextValue) {
					nextValue(form, inputElement, name);
				});
			}
			function isClosestFromValidation(formValidationElement, child) {
				return formValidationElement.is(child.parent().closest("[data-se-validation-form]"));
			}

			var fields = getFieldConfiguration(element, attrs);
			integrityCheck(element);
			var elements = element.find(SELECTOR);

			$.each(elements, function() {
				var $this = $(this);
				if (!isClosestFromValidation(element, $this)) {
					return;
				}
				var name = $this.attr("name") || $this.attr("data-name");
				if (explicitSkipElement($this)) {
					return;
				}

				var field = fields[name];
				if (!field) {
					$log.error("seValidationForm: no constraint defined", attrs.seValidationForm, name);
					return;
				}
				addHandlers(field, $this);
				// add configuration to the element (used for visualization of the error - seValidationFormLabel)
				// here attr is used, because if data() is used - it is not copied from template element to instance element
				// 2) in validation label we change field (with custom message) so it should not be data() here
				$this.attr(ELEMENT_ERROR_KEY, angular.toJson(field));
				addCustomizations($this, name);
			});
		}
	};
});
