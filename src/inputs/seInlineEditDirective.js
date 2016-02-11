angular.module("seForms.inputs.inlineedit", ["seEvents.seEventHelperService"]).directive("seInlineEdit", function($log, SeEventHelperService, $parse) {
	"use strict";
	var uniqueFormName = 0;
	var SHOW_MODEL_VALIDATION_KEY = "showModelValidation";
	var CHANGED_CELL_CLASS_NAME = "se-inline-edit-dirty";

	function link(scope, element) {
		var values = {};
		function formController() {
			return popoverElement.data("$formController");
		}
		var saveMethod = function() {
			if (formController().$invalid) {
				SeEventHelperService.safeApply(scope, function() {
					formController()[SHOW_MODEL_VALIDATION_KEY] = true;
				});

				return;
			}
			element.addClass(CHANGED_CELL_CLASS_NAME);
			element.popover("hide");
		};
		function addButtons(popoverElement) {
			var emptyRow =  $("<div class=\"col-sm-12\">&nbsp;</div>");

			var save = $("<span class=\"pull-right\"> <button type=\"submit\" class=\"btn btn-red\"><span class=\"glyphicon glyphicon-ok\"></span></button></span>");
			save.click(saveMethod);

			var cancel = $("<span class=\"pull-right\"> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-remove\"></span></button></span>");
			cancel.click(function() {
				element.popover("hide");
				SeEventHelperService.safeApply(scope, function() {
					formController()[SHOW_MODEL_VALIDATION_KEY] = false;
					resetOriginalValues(popoverElement, values);
				});
			});

			popoverElement.append(emptyRow);
			popoverElement.append(cancel);
			popoverElement.append(save);
		}
		function iterateOverOriginalValues(popoverElement, handler) {
			var ngModels = popoverElement.find("[data-ng-model]");
			$.each(ngModels, function() {
				var ngModelElement = $(this);
				var model = ngModelElement.attr("data-ng-model");
				handler(model);
			});
		}
		function saveOriginalValues(popoverElement, values) {
			iterateOverOriginalValues(popoverElement, function(model) {
				values[model] = $parse(model)(scope);
			});
		}
		function resetOriginalValues(popoverElement, values) {
			iterateOverOriginalValues(popoverElement, function(model) {
				$parse(model).assign(scope, values[model]);
			});
		}

		var popoverElement = element.find("[data-se-inline-edit-form]").children();
		addButtons(popoverElement);
		element.click(function() {
			function isAlreadyOpen() {
				return element.next().is(".in");
			}
			if (isAlreadyOpen()) {
				return;
			}

			SeEventHelperService.safeApply(scope, function() {
				saveOriginalValues(popoverElement, values);
			});

			element.popover("show");
			popoverElement.find("[data-ng-model]:first").focus();

			//submit on enter
			popoverElement.keypress(function (e) {
				if (e.which === 13) {
					saveMethod();
					return false;
				}
			});
		});
		element.popover({
			trigger: "manual",
			content: popoverElement,
			placement: "left",
			html: true
		});
	}
	return {
		restrict: "A",
		compile: function(element) {
			function wrapAndHidFormMarker(formMarker) {
				var form = $("<div />", {"data-ng-form": "seInlineEdit"+(++uniqueFormName)});
				formMarker.wrapInner(form);
				formMarker.hide();
			}
			var formMarker = element.find("[data-se-inline-edit-form]");
			if (formMarker.length === 0) {
				$log.error("seInlineEdit: no form", element);
				throw "seInlineEdit: no form";
			}
			wrapAndHidFormMarker(formMarker);
			return link;
		}
	};
});
