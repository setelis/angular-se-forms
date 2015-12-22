angular.module("seFormsDemoApp", ["seForms", "ngAnimate", "restangular"]).controller("DemoCtrl", function () {
	"use strict";
	var controller = this;

	function initState() {
	}
	function atachMethods() {
		controller.save = function() {
			alert("saved!");
		};
	}

	initState();
	atachMethods();
}).config(function(RestangularProvider) {
	"use strict";
	// Set default server URL for 'logs/' endpoint
	RestangularProvider.setBaseUrl("http://private-5150df-senotifications.apiary-mock.com");
}).config(function($translateProvider) {
	"use strict";
	$translateProvider.preferredLanguage("en");
	$translateProvider.useSanitizeValueStrategy("escape");
	$translateProvider.translations("en", {
		"button.ok": "OK",
		"button.cancel": "Cancel",
		"label.confirm": "Are you sure?"
	});

});
angular.module("seForms.validation.constraints.service.configuration", []).value("SeValidationConstraintsConfiguration", {
	// default value
	// it is possible to get the configuration from Java Annotations (endpoint)
	// or hard-coded values
	MemberDTO: {
		name: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}]
		},
		number: {
			constraints: [{
				name: "number",
				value: "true"
			}, {
				name: "required",
				value: "true"
			}]
		},
		info: {
			constraints: []
		}
	}
});
