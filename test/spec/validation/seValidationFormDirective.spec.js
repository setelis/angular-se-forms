describe("seValidationForm", function () {
	"use strict";
	var $rootScope, scope, element, $compile, ValidationConstraintsService, configuration;
	var $httpBackend;

	beforeEach(module("seForms.validation.directive", function($provide) {
		configuration = {
			dtoName: {
				singleConstraint: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				allStringConstraints: {
					type: "String",
					constraints: [{
						name: "maxlength",
						value: "5"
					}, {
						name: "minlength",
						value: "2"
					}, {
						name: "pattern",
						value: "ab"
					} ]
				},
				allStringConstraintsWithoutRequired: {
					type: "String",
					constraints: [{
						name: "maxlength",
						value: "5"
					}, {
						name: "minlength",
						value: "2"
					}, {
						name: "pattern",
						value: "ab"
					} ]
				},
				allIntConstraints: {
					type: "Integer",
					constraints: [ {
						name: "required",
						value: "true"
					}, {
						name: "min",
						value: "10"
					}, {
						name: "max",
						value: "15"
					} ]
				},
				emptyConstraint: {
					type: "String",
					constraints: []
				},
				notRequiredConstraint: {
					type: "String",
					constraints: []
				},
				emailConstraint: {
					type: "String",
					constraints: [ {
						name: "email",
						value: "true"
					}]
				},
				field1: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field2: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field3: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field4: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field5: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field6: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				},
				field7: {
					type: "String",
					constraints: [ {
						name: "required",
						value: "true"
					}]
				}
			}
		};

		ValidationConstraintsService = {
			getConstraints: function(dtoName) {
				return configuration[dtoName] || {};
			}
		};
		$provide.value("SeValidationConstraintsService", ValidationConstraintsService);

	}));

	beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$compile = _$compile_;
		$httpBackend = _$httpBackend_;
		$httpBackend.when("GET", "validation/seValidationLabelDirective.html").respond(200, "<div></div>");
	}));


	describe("basic", function () {
		it("should add attr to element", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='email-input' name='singleConstraint' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input = element.find("input");
			expect(angular.fromJson(input.attr("data-se-forms-constraints-message"))).toEqual(configuration.dtoName.singleConstraint);
		}));
		it("should add required handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("data-ng-required")).toBe("true");

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-required")).toBeUndefined();

			var input3 = element.find("#input3");
			expect(input3.attr("data-ng-required")).toBe("true");
		}));
		it("should skip marked as skip or file", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' data-se-validation-form-skip='true'></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' type='file' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("data-ng-required")).toBeUndefined();

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-required")).toBeUndefined();

			var input3 = element.find("#input3");
			expect(input3.attr("data-ng-required")).toBeUndefined();
		}));

		function checkInput(id, required, name, dataName) {
			var input = element.find("#"+id);
			expect(input.attr("data-ng-required")).toBe(required);
			expect(input.attr("name")).toBe(name);
			expect(input.attr("data-name")).toBe(dataName);
		}

		it("should add name when ng-model is available", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' data-ng-model='field1' ></input>"+
				"<input id='input2' data-ng-model='model.field2' ></input>"+
				"<div id='input3' data-ng-model='model.field3' ></div>"+
				"<select id='input4' data-ng-model='model.field4' ></select>"+
				"<div id='input5' data-ng-model='model.field5' ></div>"+
				"<div id='input6' data-ng-model='model.field6' ></div>"+
				"<div id='input7' data-ng-model='some' data-name='field7' ></div>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();

			checkInput("input1", "true", "field1", undefined);
			checkInput("input2", "true", "field2", undefined);
			checkInput("input3", "true", undefined, "field3");
			checkInput("input4", "true", "field4", undefined);

			checkInput("input5", "true", undefined, "field5");
			checkInput("input6", "true", undefined, "field6");
			checkInput("input7", "true", undefined, "field7");
		}));

		it("should not add name twice when ng-model is available and name is available", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' data-ng-model='field11' name='field1'></input>"+
				"<input id='input2' data-ng-model='model.field22' name='field2'></input>"+
				"<div id='input3' data-ng-model='model.field33' data-name='field3' ></div>"+
				"<select id='input4' data-ng-model='model.field44' name='field4'></select>"+
				"<div id='input5' data-ng-model='model.field55' data-name='field5'></div>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();

			checkInput("input1", "true", "field1", undefined);

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-required")).toBe("true");
			expect(input2.attr("name")).toBe("field2");
			expect(input2.attr("data-name")).toBeUndefined();

			checkInput("input3", "true", undefined, "field3");

			var input4 = element.find("#input4");
			expect(input4.attr("data-ng-required")).toBe("true");
			expect(input4.attr("name")).toBe("field4");
			expect(input4.attr("data-name")).toBeUndefined();

			var input5 = element.find("#input5");
			expect(input5.attr("data-ng-required")).toBe("true");
			expect(input5.attr("data-name")).toBe("field5");
			expect(input5.attr("name")).toBeUndefined();

		}));

		it("should add maxlength handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("data-ng-maxlength")).toBeUndefined();

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-maxlength")).toBe("5");

			var input3 = element.find("#input3");
			expect(input3.attr("data-ng-maxlength")).toBeUndefined();
		}));
		it("should add minlength handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("data-ng-minlength")).toBeUndefined();

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-minlength")).toBe("2");

			var input3 = element.find("#input3");
			expect(input3.attr("data-ng-minlength")).toBeUndefined();
		}));
		it("should add pattern handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("data-ng-pattern")).toBeUndefined();

			var input2 = element.find("#input2");
			expect(input2.attr("data-ng-pattern")).toBe("/ab/");

			var input3 = element.find("#input3");
			expect(input3.attr("data-ng-pattern")).toBeUndefined();
		}));
		it("should add max handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("max")).toBeUndefined();
			expect(input1.attr("type")).not.toBe("number");

			var input2 = element.find("#input2");
			expect(input2.attr("max")).toBeUndefined();
			expect(input2.attr("type")).not.toBe("number");

			var input3 = element.find("#input3");
			expect(input3.attr("max")).toBe("15");
			expect(input3.attr("type")).toBe("number");
		}));
		it("should add min handler", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.attr("min")).toBeUndefined();
			expect(input1.attr("type")).not.toBe("number");

			var input2 = element.find("#input2");
			expect(input2.attr("min")).toBeUndefined();
			expect(input2.attr("type")).not.toBe("number");

			var input3 = element.find("#input3");
			expect(input3.attr("min")).toBe("10");
			expect(input3.attr("type")).toBe("number");
		}));
		it("should traverse all element", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='singleConstraint' ></input>"+
				"<input id='input2' name='allStringConstraints' ></input>"+
				"<input id='input3' name='allIntConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1 = element.find("#input1");
			expect(input1.data("se-forms-constraints-message")).toEqual(configuration.dtoName.singleConstraint);

			var input2 = element.find("#input2");
			expect(input2.data("se-forms-constraints-message")).toEqual(configuration.dtoName.allStringConstraints);

			var input3 = element.find("#input3");
			expect(input3.data("se-forms-constraints-message")).toEqual(configuration.dtoName.allIntConstraints);
		}));
		it("should do nothing if constraint is not defined", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input' name='unknownConstraint' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input = element.find("#input");
			expect(input.data("se-forms-constraints-message")).toBeUndefined();
		}));
		it("should remove required handler if no required in model", inject(function () {
			function expectNoRequired(element) {
				expect(element.attr("data-ng-required")).toBeUndefined();
				expect(element.attr("data-required")).toBeUndefined();
				expect(element.attr("required")).toBeUndefined();
				expect(element.attr("data-required-multiple")).toBeUndefined();
			}
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='allStringConstraints' data-ng-required='aa'></input>"+
				// "<input id='input2' name='allStringConstraints' data-required='aa'></input>"+
				// "<input id='input3' name='allStringConstraints' required='aa'></input>"+
				// "<input id='input4' name='allStringConstraints' data-required-multiple='aa'></input>"+
				// "<input id='input5' name='allStringConstraints' data-ng-required='aa' required='aa' " +
				// "data-required-multiple='aa' data-required='aa'></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();

			expectNoRequired(element.find("#input1"));
			// expectNoRequired(element.find("#input2"));
			// expectNoRequired(element.find("#input3"));
			// expectNoRequired(element.find("#input4"));
			// expectNoRequired(element.find("#input5"));
		}));
		it("should not remove required handler if no required in model and message is present", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input1' name='allStringConstraints1' data-ng-required='aa' data-se-validation-form-message-required='hello'></input>"+
				"<input id='input2' name='allStringConstraints2' data-required='aa' data-se-validation-form-message-required='hello'></input>"+
				"<input id='input3' name='allStringConstraints3' required='required' data-se-validation-form-message-required='hello'></input>"+
				"<input id='input4' name='allStringConstraints4' data-required-multiple='aa' data-se-validation-form-message-required='hello'></input>"+
				"<input id='input5' name='allStringConstraints5' data-ng-required='true' required='required' " +
					"data-required-multiple='aa' data-required='aa' data-se-validation-form-message-required='hello'></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();

			expect(element.find("#input1").attr("data-ng-required")).toBe("aa");
			expect(element.find("#input2").attr("data-required")).toBe("aa");
			expect(element.find("#input3").attr("required")).toBe("required");
			expect(element.find("#input4").attr("data-required-multiple")).toBe("aa");

			expect(element.find("#input5").attr("data-ng-required")).toBe("true");
			expect(element.find("#input5").attr("data-required")).toBe("aa");
			expect(element.find("#input5").attr("required")).toBe("required");
			expect(element.find("#input5").attr("data-required-multiple")).toBe("aa");
		}));
		it("should add email type", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='email-input' name='emailConstraint' type='text'></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input = element.find("input");
			expect(input.attr("type")).toBe("email");
		}));
	});

	describe("highlighting", function () {
		it("should add highlighted handler if not present", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<div id='input1wrap' class='input-wrap'><input id='input1' name='singleConstraint' ></input></div>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input1wrap = element.find("#input1wrap");
			expect(input1wrap.attr("data-ng-class")).toBe("{'highlighted has-error': (emailForm.singleConstraint.$invalid &&"+
				" (emailForm| isShowModelValidationFlagSet))}");
		}));
		it("should not add highlighted handler if present", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<div id='input3wrap' class='input-wrap' data-ng-class='p'><input id='input3' name='allIntConstraints' ></input></div>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			var input3wrap = element.find("#input3wrap");
			expect(input3wrap.attr("data-ng-class")).toBe("p");
		}));
		it("should add highlighted handler", inject(function () {

			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input2' name='allStringConstraints' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			scope.$digest();
			expect(element.find("div[data-ng-class]").length).toBe(1);
			expect(element.find("div[data-ng-class]").attr("data-ng-class")).
				toBe("{'highlighted has-error': (emailForm.allStringConstraints.$invalid && (emailForm| isShowModelValidationFlagSet))}");
		}));

	});

	describe("error label", function () {


		it("should not add error label handler if present", inject(function () {
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-label='input3'></div>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				"<input id='input3' name='allIntConstraints' data-ng-model='aaa' ></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			var previousValidationDiv = element.find("div[data-se-validation-label='input3']");
			expect(previousValidationDiv.length).toBe(1);

			element.scope().emailForm.showModelValidation = true;
			scope.$digest();

			var validationDiv = element.find("div[data-se-validation-label='input3']");

			expect(validationDiv.length).toBe(1);
		}));

		// it("should display required error if no required in api/validation", inject(function () {
			// element = angular.element("<form name='emailForm'>"+
				// "<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label'>" +
				// "<input id='input3' name='emptyConstraint' data-ng-model='emptyConstraint' " +
				// "data-se-validation-form-message-required='aaa' data-ng-required='true' ></input>"+
				// "</div>" +
				// "</form>");
			// element = $compile(element)(scope);
			// var previousValidationDiv = element.find("div[data-se-validation-label='input3']");
			// expect(previousValidationDiv.length).toBe(0);

			// element.scope().emailForm.showModelValidation = false;
			// scope.emailForm.emptyConstraint.$invalid = true;
			// scope.$digest();

			// previousValidationDiv = element.find("div[data-se-validation-label='input3']");
			// expect(previousValidationDiv.length).toBe(0);

			// element.scope().emailForm.showModelValidation = true;
			// // scope.emailForm.emptyConstraint.$invalid = true;
			// scope.$digest();

			// var validationDiv = element.find("div[data-se-validation-label='input3']");
			// expect(validationDiv.length).toBe(1);

			// var data = element.find("input").data("se-forms-constraints-message");
			// expect(data).toEqual({
				// "type":"String",
				// "constraints":[
					// {
						// "name":"required",
						// "value":"false",
						// "message":"{org.hibernate.validator.constraints.NotEmpty.message}"
					// }
				// ]
			// });
		// }));


	});

	describe("ceFormValidationOverride", function () {
		it("should not remove first element from default constraints", inject(function () {
			var override = {
				allStringConstraintsWithoutRequired: {
					constraints: [
						{
							name: "required",
							value: "true"
						}
					]
				}
			};
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-label='input3'></div>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label' data-se-validation-form-override='"+
				angular.toJson(override) +
				"'>" +
				"<input id='input3' name='allStringConstraintsWithoutRequired' data-ng-model='aaa'></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			var previousValidationDiv = element.find("div[data-se-validation-label='input3']");
			expect(previousValidationDiv.length).toBe(1);

			element.scope().emailForm.showModelValidation = true;
			scope.$digest();

			var input = element.find("#input3");
			expect(angular.fromJson(input.attr("data-se-forms-constraints-message"))).toEqual({
				type: "String",
				constraints: [{
					name: "maxlength",
					value: "5"
				}, {
					name: "minlength",
					value: "2"
				}, {
					name: "pattern",
					value: "ab"
				}, {
					name: "required",
					value: "true"
				}]
			});
		}));

		it("should override if already present", inject(function () {
			var override = {
				allStringConstraintsWithoutRequired: {
					constraints: [
						{
							name: "maxlength",
							value: "6"
						}
					]
				}
			};
			element = angular.element("<form name='emailForm'>"+
				"<div data-se-validation-label='input3'></div>"+
				"<div data-se-validation-form='dtoName' data-se-validation-form-customizations='highlight,label' data-se-validation-form-override='"+
				angular.toJson(override) +
				"'>" +
				"<input id='input3' name='allStringConstraintsWithoutRequired' data-ng-model='aaa'></input>"+
				"</div>" +
				"</form>");
			element = $compile(element)(scope);
			var previousValidationDiv = element.find("div[data-se-validation-label='input3']");
			expect(previousValidationDiv.length).toBe(1);

			element.scope().emailForm.showModelValidation = true;
			scope.$digest();

			var input = element.find("#input3");
			expect(angular.fromJson(input.attr("data-se-forms-constraints-message"))).toEqual({
				type: "String",
				constraints: [{
					name: "minlength",
					value: "2"
				}, {
					name: "pattern",
					value: "ab"
				}, {
					name: "maxlength",
					value: "6"
				}]
			});
		}));

	});

});
