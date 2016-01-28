angular.module("seForms.validation.tooltip", ["seForms.validation.constraints.service", "seForms.translations"]).
	directive("seValidationTooltip", function ($log, SeValidationConstraintsService, $translate) {
	"use strict";
	function disableAnimationAndDestroy(inputElement) {
		// because there is animation/delay in destroy so destroy should not be called before tooltip creation
		// $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION)
		// :complete()
		if (inputElement.data("bs.tooltip") && inputElement.data("bs.tooltip").$tip && inputElement.data("bs.tooltip").$tip.removeClass) {
			inputElement.data("bs.tooltip").$tip.removeClass("fade");
		}
		inputElement.tooltip("destroy");
	}
	return {
		restrict: "A",
		require: "^form",
		link: function link(scope, inputElement, attrs, ngForm) {
			SeValidationConstraintsService.listenForErrors(scope, inputElement, scope[ngForm.$name], inputElement.attr("name") || inputElement.attr("data-name"), {
				onInvalid: function onInvalid(key, context) {
					disableAnimationAndDestroy(inputElement);

					inputElement.tooltip({
						container: "body",
						title: $translate.instant("seValidationForm."+key, context),
						template: "<div class=\"tooltip se-validation-tooltip\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>"
					}).tooltip("show");
				},
				onValid: function onInvalid() {
					disableAnimationAndDestroy(inputElement);
				}
			});

			scope.$on("$destroy", function() {
				disableAnimationAndDestroy(inputElement);
			});
		}

	};
});
