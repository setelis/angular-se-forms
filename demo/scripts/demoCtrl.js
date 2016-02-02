angular.module("seFormsDemoApp", ["seForms", "ngAnimate", "restangular"]).controller("DemoCtrl", function (Restangular) {
	"use strict";
	var controller = this;

	function initState() {
		controller.member = {
			comment: "Hello"
		};
	}

	function atachMethods() {
		controller.save = function() {
			alert("saved!");
		};
		controller.updatePreferences = function() {
			return Restangular.one("preferences").customPUT(controller.preferences);
		};
	}

	initState();
	atachMethods();
}).config(function(RestangularProvider) {
	"use strict";
	// Set default server URL for 'logs/' and 'referencedatum' endpoint
	RestangularProvider.setBaseUrl("http://private-c933e-seforms.apiary-mock.com");
}).config(function($translateProvider) {
	"use strict";
	$translateProvider.preferredLanguage("en");
	$translateProvider.useSanitizeValueStrategy("escape");
	$translateProvider.translations("en", {
		"button.ok": "OK",
		"button.cancel": "Cancel",
		"label.confirm": "Are you sure?",
		"seReferenceData.types.countries.placeholder": "Select country"
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
		email: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}, {
				name: "email",
				value: "true"
			}]
		},
		password: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}]
		},
		$$passwordAgain: {
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
		},
		comment: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}]
		},
		country: {
			constraints: [{
				name: "required",
				value: "true"
			}]
		}

	},
	PreferencesDTO: {
		color: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}]
		},
		pet: {
			constraints: [{
				name: "required",
				value: "true"
			}, {
				name: "maxlength",
				value: 50
			}]
		}
	}
});
