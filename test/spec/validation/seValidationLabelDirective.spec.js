describe("seValidationLabel", function () {
	"use strict";
	var $rootScope, scope, element, $compile, isolatedScope, configuration;

	beforeEach(module("seForms.validation.label", function($provide, $translateProvider){
		$translateProvider.translations("en", {
			"validations.error1": "TRANSLATEDERROR1",
			"validations.error2": "TRANSLATEDERROR2"
		});
		$translateProvider.preferredLanguage("en");

		configuration = {
			a: {hello: "world"},
			b: {hello2: "world2"}
		};
		$provide.value("ValidationConstraintsServiceConfiguration", configuration);
	}));

	beforeEach(inject(function ($templateCache) {
		$templateCache.put("validation/seValidationLabelDirective.html",
			"<span><label class='control-label' data-ng-if='errorMessage'>"+
			"{{('validations.' + errorMessage) | translate:errorMessageContext}}</label></span>");
	}));

	beforeEach(inject(function (_$rootScope_, _$compile_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$compile = _$compile_;
	}));

	it("should fill isolated scope", inject(function () {
		element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
			"<input id='email-input' name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": "+
			"[{\"name\": \"required\", \"message\": \"hello\"}]}' data-ng-required='true'></input></form>");
		expect(element.find("label").length).toBe(0);
		element = $compile(element)(scope);
		scope.$digest();
		expect(element.find("label").length).toBe(0);

		isolatedScope = element.find("[data-se-validation-label]").isolateScope();
		expect(isolatedScope.formName).toBe("emailForm");
		expect(isolatedScope.inputName).toBe("emailName");
		isolatedScope.errorMessage = "helloworld";
		scope.$digest();

		expect(element.find("label").attr("for")).toBe("email-input");


	}));

	it("should support data-name", inject(function () {
		element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
			"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": "+
			"[{\"name\": \"required\", \"message\": \"hello\"}]}' data-ng-required='true'></input></form>");
		expect(element.find("label").length).toBe(0);
		element = $compile(element)(scope);
		scope.$digest();
		expect(element.find("label").length).toBe(0);
		isolatedScope = element.find("[data-se-validation-label]").isolateScope();
		expect(isolatedScope.formName).toBe("emailForm");
		expect(isolatedScope.inputName).toBe("emailName");

		isolatedScope.errorMessage = "helloworld";
		scope.$digest();

		expect(element.find("label").attr("for")).toBe("email-input");
	}));
	it("should support message", inject(function () {
		element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
			"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": "+
			"[{\"name\": \"required\", \"message\": \"hello\", \"value\": \"true\"}]}' " +
			" data-ng-required='true'></input></form>");
		expect(element.find("label").length).toBe(0);
		element = $compile(element)(scope);
		scope.$digest();
		expect(element.find("label").length).toBe(0);
		isolatedScope = element.find("[data-se-validation-label]").isolateScope();
		expect(isolatedScope.formName).toBe("emailForm");
		expect(isolatedScope.inputName).toBe("emailName");

		isolatedScope.errorMessage = "helloworld";
		scope.$digest();

		expect(element.find("label").attr("for")).toBe("email-input");
	}));

	describe("check if message is shown", function () {
		it("should do nothing if errors is null", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			controller.$error = null;
			expect(isolatedScope.errorMessage).toBe(null);
		}));
		it("should do nothing if errors is false", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;
			controller.$error.some=true;
			scope.$digest();

			expect(isolatedScope.errorMessage).toBe("some");

			controller.$error.some=false;
			scope.$digest();

			expect(isolatedScope.errorMessage).toBe(null);
		}));

		it("should do nothing if errors is empty array", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;
			controller.$error.length = 0;
			expect(isolatedScope.errorMessage).toBe(null);

			controller.$error = [];
			expect(isolatedScope.errorMessage).toBe(null);

			controller.$error = {};
			expect(isolatedScope.errorMessage).toBe(null);
		}));
		function checkErrorMessage(key, others) {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			expect(controller.$error).toEqual({});
			expect(isolatedScope.errorMessage).toBe(null);
			expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);

			$.each(others||[], function() {
				controller.$error[this] = true;
			});
			controller.$error[key] = true;
			scope.$digest();
			expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);

			expect(isolatedScope.errorMessage).toBe(key);

			$.each(others||[], function() {
				controller.$error[this] = true;
			});
			scope.$digest();
			expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);

			expect(isolatedScope.errorMessage).toBe(key);
		}
		it("should return serverValidation if available", inject(function () {
			checkErrorMessage("serverValidation");
		}));
		it("should return serverLiveValidation if available", inject(function () {
			checkErrorMessage("serverLiveValidation");
		}));
		it("should return seValidateExternal if available", inject(function () {
			checkErrorMessage("seValidateExternal");
		}));
		it("should return serverValidation if available and there are others", inject(function () {
			checkErrorMessage("serverValidation", ["hello", "world"]);
		}));
		it("should return serverLiveValidation if available and there are others", inject(function () {
			checkErrorMessage("serverLiveValidation", ["hello", "world"]);
		}));
		it("should return seValidateExternal if available and there are others", inject(function () {
			checkErrorMessage("seValidateExternal", ["hello", "world"]);
		}));

		it("should show error show model validation is and there is error", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			expect(controller.$error).toEqual({});

			isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

			controller.$error.hello = true;
			scope.$digest();
			expect(isolatedScope.errorMessage).toBe("hello");
		}));
		it("should show error show model validation is and there is error - showModelValidation is set after error", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			expect(controller.$error).toEqual({});


			controller.$error.hello = true;
			scope.$digest();
			isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;
			scope.$digest();
			expect(isolatedScope.errorMessage).toBe("hello");
		}));

		it("should not show error if show model validation is and there is no error", inject(function () {
			element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
				"<input id='email-input' data-name='emailName' data-ng-model='model.email'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			isolatedScope = element.find("[data-se-validation-label]").isolateScope();
			var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

			expect(controller.$error).toEqual({});

			isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = false;

			controller.$error.hello = true;
			scope.$digest();
			expect(isolatedScope.errorMessage).toBe(null);
		}));
	});

	describe("check if message is properly shown", function () {
		describe("email handling", function () {


			it("field constraints and type is not email", inject(function () {
				// <label class="control-label" data-ng-repeat="constraint in field.constraints"
					// data-ng-hide="constraint.name === 'email'"
					// data-ng-if="$seValidationLabelParent[formName].showModelValidation && $seValidationLabelParent[formName][inputName].$error[constraint.name]">
					// {{('validations.' + (elementData['ceValidationLabelCustom'+constraint.name]|| constraint.message)) | translate:constraint}}
				// </label>

				// {{('validations.' + (elementData['ceValidationLabelCustom'+constraint.name]|| constraint.message)) | translate:constraint}}
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='"+
					"{\"type\": \"String\", \"constraints\": [{\"name\": \"required\"}]}' " +
					"data-ng-required='true' data-ng-model='model.email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({required: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("required");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({"name": "required"});
			}));
			it("field constraints and type is not email, with message", inject(function () {
				// {{('validations.' + (elementData['ceValidationLabelCustom'+constraint.name]|| constraint.message)) | translate:constraint}}
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='"+
					"{\"type\": \"String\", \"constraints\": [{\"name\": \"required\", \"message\": \"helloworld\"}]}' " +
					"data-ng-required='true' data-ng-model='model.email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({required: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("helloworld");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({"name": "required", "message": "helloworld"});
			}));

			it("field constraints and type is not email and there is ceValidationLabelCustom", inject(function () {
				// {{('validations.' + (elementData['ceValidationLabelCustom'+constraint.name]|| constraint.message)) | translate:constraint}}
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='"+
					"{\"type\": \"String\", \"constraints\": [{\"name\": \"required\", \"message\": \"helloworld\"}]}' " +
					"data-se-validation-group-message-required='error1' data-ng-required='true' data-ng-model='model.email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({required: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("error1");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({"name": "required", "message": "helloworld"});
			}));
			it("field constraints and type is not email and there is ceValidationLabelCustom, no field message", inject(function () {
				// {{('validations.' + (elementData['ceValidationLabelCustom'+constraint.name]|| constraint.message)) | translate:constraint}}
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"required\"}]}' " +
					"data-se-validation-group-message-required='error1' data-ng-required='true' data-ng-model='model.email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({required: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("error1");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({"name": "required"});
			}));

			it("field constraints and type is email", inject(function () {
				scope.model = {email: "aaa"};
				// same as validations.email in language
			// {{'validations.{org.hibernate.validator.constraints.Email.message}' | translate}}
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({email: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("email");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({"name": "email"});
			}));


			it("error email", inject(function () {
				scope.model = {email: "aaa"};
				// same as validations.email in language
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName].showModelValidation && $seValidationLabelParent[formName][inputName].$error.email">
					// {{'validations.{org.hibernate.validator.constraints.Email.message}' | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName'  " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(controller.$error).toEqual({email: true});
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("email");
				// strip $$hashKey:
				expect(angular.copy(isolatedScope.errorMessageContext)).toBe(null);
			}));
		});
		describe("serverValidation", function () {

			it("serverValidation", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverValidation"
					// data-se-server-validated="{{formName}}.{{inputName}}">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverValidation = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.serverValidation = {template: "hellowworld"};

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld");
				expect(isolatedScope.errorMessageContext).toEqual(null);
			}));
			it("serverValidation, custom error message and server message", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverValidation"
					// data-se-server-validated="{{formName}}.{{inputName}}">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-se-validation-group-message-serverValidation='hellowworld4' "+
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverValidation = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.serverValidation = {template: "hellowworld"};

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld");
				expect(isolatedScope.errorMessageContext).toEqual(null);
			}));
			it("serverValidation, custom error message and server message", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverValidation"
					// data-se-server-validated="{{formName}}.{{inputName}}">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-se-validation-group-message-serverValidation='hellowworld4' "+
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverValidation = true;

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld4");
				expect(isolatedScope.errorMessageContext).toEqual(null);
			}));
		});
		describe("serverLiveValidation", function () {

			it("serverLiveValidation", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverLiveValidation">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverLiveValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverLiveValidation = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.serverLiveValidation = {template: "hellowworld2"};

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld2");
				expect(isolatedScope.errorMessageContext).toEqual(null);

			}));
			it("serverLiveValidation - only server message", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverLiveValidation">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverLiveValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverLiveValidation = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.serverLiveValidation = {template: "hellowworld2"};

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld2");
				expect(isolatedScope.errorMessageContext).toEqual(null);

			}));
			it("serverLiveValidation - custom message and server message", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.serverLiveValidation">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].serverLiveValidation.template) | translate}}
				// </label>
				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-se-validation-group-message-serverLiveValidation='hellowworld3' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.serverLiveValidation = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.serverLiveValidation = {template: "hellowworld2"};

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld3");
				expect(isolatedScope.errorMessageContext).toEqual(null);

			}));
		});
		describe("seValidateExternal", function() {
			it("seValidateExternal", inject(function () {
				// <label class="control-label"
					// data-ng-if="$seValidationLabelParent[formName][inputName].$error.ceExternalValidation">
					// {{('validations.' + $seValidationLabelParent[formName][inputName].ceExternalValidation) | translate}}
				// </label>

				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' data-se-forms-constraints-message='{\"type\": \"String\", \"constraints\": [{\"name\": \"email\"}]}' " +
					"data-se-validation-group-message-serverLiveValidation='hellowworld3' " +
					"data-ng-model='model.email' type='email'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				expect(isolatedScope.$seValidationLabelParent.emailForm.showModelValidation).not.toBe(true);
				controller.$error.seValidateExternal = true;
				isolatedScope.$seValidationLabelParent.emailForm.emailName.seValidateExternal = "hellowworld6";

				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld6");
				expect(isolatedScope.errorMessageContext).toEqual(null);
			}));
		});

		describe("integer", function () {

			it("Integer number", inject(function () {
				// <label class="control-label"
					// data-ng-if="field.type === 'Integer' && $seValidationLabelParent[formName].showModelValidation && $seValidationLabelParent[formName][inputName].$error.number">
					// {{'validations.integer' | translate}}
				// </label>

				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' "+
					"data-se-forms-constraints-message='{\"type\": \"Integer\", \"constraints\": [{\"name\": \"pattern\", \"value\": \"a\", \"message\": \"z\"}]}' " +
					"data-se-validation-group-message-serverLiveValidation='hellowworld3' " +
					"data-ng-model='model.email' type='text'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				controller.$error.number = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("integer");
				expect(angular.copy(isolatedScope.errorMessageContext)).toBe(null);

			}));
			it("Integer number with validation error", inject(function () {
				// <label class="control-label"
					// data-ng-if="field.type === 'Integer' && $seValidationLabelParent[formName].showModelValidation && $seValidationLabelParent[formName][inputName].$error.number">
					// {{'validations.integer' | translate}}
				// </label>

				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' "+
					"data-se-forms-constraints-message='{\"type\": \"Integer\", \"constraints\": [{\"name\": \"number\", \"value\": \"a\", \"message\": \"z\"}]}' " +
					"data-ng-model='model.email' type='text'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				controller.$error.number = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("z");
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({name: "number", value: "a", message: "z"});

			}));
			it("Integer number with custom message", inject(function () {
				// <label class="control-label"
					// data-ng-if="field.type === 'Integer' && $seValidationLabelParent[formName].showModelValidation && $seValidationLabelParent[formName][inputName].$error.number">
					// {{'validations.integer' | translate}}
				// </label>

				element = angular.element("<form name='emailForm'><div data-se-validation-label='email-input' ></div>" +
					"<input id='email-input' data-name='emailName' "+
					"data-se-forms-constraints-message='{\"type\": \"Integer\", \"constraints\": [{\"name\": \"number\", \"value\": \"a\", \"message\": \"z\"}]}' " +
					"data-se-validation-group-message-number='hellowworld7' " +
					"data-ng-model='model.email' type='text'></input></form>");
				element = $compile(element)(scope);
				scope.$digest();
				isolatedScope = element.find("[data-se-validation-label]").isolateScope();
				var controller = isolatedScope.$seValidationLabelParent.emailForm.emailName;

				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				controller.$error.number = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe(null);
				expect(isolatedScope.errorMessageContext).toBe(null);

				isolatedScope.$seValidationLabelParent.emailForm.showModelValidation = true;
				scope.$digest();
				expect(isolatedScope.errorMessage).toBe("hellowworld7");
				expect(angular.copy(isolatedScope.errorMessageContext)).toEqual({name: "number", value: "a", message: "z"});

			}));
		});


	});

});
