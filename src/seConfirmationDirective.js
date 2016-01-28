angular.module("seForms.confirmation", ["seEvents.seEventHelperService"]).directive("seConfirmation", function($parse, SeEventHelperService, $compile) {
	"use strict";
	return {
		// less than ng-click as explained here: https://docs.angularjs.org/guide/migration#directives-order-of-postlink-functions-reversed
		// so it should be executed before ng-click and be able to suppres ng-click
		priority: -1,
		restrict: "A",
		link: function (scope, element, attrs) {
			var confirmationDropdown;
			function removeDropdown() {
				if (confirmationDropdown) {
					confirmationDropdown.remove();
					confirmationDropdown = null;
				}
			}
			function createQuestion(message) {
				var result = $("<ul />", {"class": "dropdown-menu se-confirmation-wrapper"});
				result.append($("<li/>").append(message));

				var group = $("<div />", {"class": "btn-group", "role": "group"});
				var perform = $("<button />", {"class": "btn btn-default"}).append("{{'button.ok' | translate}}");
				result.append(perform);
				perform.click(function() {
					SeEventHelperService.safeApply(scope, function() {
						$parse(attrs.ngClick)(scope);
					});
				});
				group.append(perform);

				var cancel = $("<button />", {"class": "btn"}).append("{{'button.cancel' | translate}}");
				group.append(cancel);

				var toolbar = $("<div />", {"class": "btn-toolbar", "role": "toolbar"});
				toolbar.append(group);
				var li = $("<li />");
				li.append(toolbar);
				result.append(li);
				return $compile(result)(scope);
			}
			element.parent().on("hidden.bs.dropdown", removeDropdown);

			element.on("click", function (event) {
				SeEventHelperService.stopEvent(event);
				removeDropdown();
				SeEventHelperService.safeApply(scope, function() {
					confirmationDropdown = createQuestion(attrs.ceConfirmation || "{{'label.confirm' | translate}}");
					confirmationDropdown.insertAfter(element);
					element.dropdown("toggle");
				});
			});
			element.attr("data-toggle", "dropdown");
			element.parent().addClass("dropup");
		}
	};
});
