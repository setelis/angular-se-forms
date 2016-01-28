describe("seValidationButton", function () {
	"use strict";
	var $rootScope, scope, element, $compile;

	beforeEach(module("seForms.validation.button", function(){
	}));

	beforeEach(inject(function (_$rootScope_, _$compile_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$compile = _$compile_;
	}));
	it("should clear error and propagate event", inject(function () {
		element = angular.element("<form name='emailForm'><button data-se-validation-button >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(1);

		expect(scope.emailForm.showModelValidation).toBe(false);
	}));
	it("should set error and stop propagation", inject(function () {
		element = angular.element("<form name='emailForm'><button data-se-validation-button >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = false;

		scope.emailForm.$invalid = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(0);

		expect(scope.emailForm.showModelValidation).toBe(true);
	}));
	it("should set error and stop propagation if error and custom validation passes", inject(function () {
		scope.validate=function() {
			return true;
		};
		element = angular.element("<form name='emailForm'><button data-se-validation-button  data-se-validation-button-validate='validate()'>aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = false;

		scope.emailForm.$invalid = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(0);

		expect(scope.emailForm.showModelValidation).toBe(true);
	}));

	it("should set error and stop propagation on custom validation error", inject(function () {
		scope.validate=function() {
			return false;
		};
		element = angular.element("<form name='emailForm'><button data-se-validation-button data-se-validation-button-validate='validate()'>aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(0);

		expect(scope.emailForm.showModelValidation).toBe(true);
	}));
	it("should clear error and propagate event if custom validation passes", inject(function () {
		scope.validate=function() {
			return true;
		};
		element = angular.element("<form name='emailForm'><button data-se-validation-button data-se-validation-button-validate='validate()'>aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(1);

		expect(scope.emailForm.showModelValidation).toBe(false);
	}));


	it("should clear error on multiple forms", inject(function () {
		element = angular.element("<form name='emailForm'><div data-ng-form='subForm'></div><button data-se-validation-button='[\"subForm\"]' >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = true;
		scope.emailForm.subForm.showModelValidation = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(1);

		expect(scope.emailForm.showModelValidation).toBe(false);
		expect(scope.emailForm.subForm.showModelValidation).toBe(false);
	}));
	it("should set error on multiple forms", inject(function () {
		element = angular.element("<form name='emailForm'><div data-ng-form='subForm'></div><button data-se-validation-button='[\"subForm\"]' >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = false;
		scope.emailForm.subForm.showModelValidation = false;

		scope.emailForm.$invalid = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(0);

		expect(scope.emailForm.showModelValidation).toBe(true);
		expect(scope.emailForm.subForm.showModelValidation).toBe(true);
	}));


	it("should clear error on multiple sub forms", inject(function () {
		element = angular.element("<form name='emailForm'><div data-ng-form='subForm'><div data-ng-form='subForm2'></div></div>"+
			"<button data-se-validation-button='[\"subForm\", \"subForm[\\\"subForm2\\\"]\"]' >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.subForm2.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = true;
		scope.emailForm.subForm.showModelValidation = true;
		scope.emailForm.subForm.subForm2.showModelValidation = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(1);

		expect(scope.emailForm.showModelValidation).toBe(false);
		expect(scope.emailForm.subForm.showModelValidation).toBe(false);
		expect(scope.emailForm.subForm.subForm2.showModelValidation).toBe(false);
	}));
	it("should set error on multiple sub forms", inject(function () {
		element = angular.element("<form name='emailForm'><div data-ng-form='subForm'><div data-ng-form='subForm2'></div></div>"+
			"<button data-se-validation-button='[\"subForm\", \"subForm[\\\"subForm2\\\"]\"]' >aaa</button>" +
			"<input id='email-input' name='emailName' data-dm-form-constraints-message='somevalue' data-ng-required='true'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var button = element.find("button");
		expect(scope.emailForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.showModelValidation).toBeUndefined();
		expect(scope.emailForm.subForm.subForm2.showModelValidation).toBeUndefined();

		scope.emailForm.showModelValidation = false;
		scope.emailForm.subForm.showModelValidation = false;
		scope.emailForm.subForm.subForm2.showModelValidation = false;

		scope.emailForm.$invalid = true;

		var handler = jasmine.createSpy("clickCalled");
		button.click(handler);
		expect(handler.calls.count()).toBe(0);

		button.click();

		expect(handler.calls.count()).toBe(0);

		expect(scope.emailForm.showModelValidation).toBe(true);
		expect(scope.emailForm.subForm.showModelValidation).toBe(true);
		expect(scope.emailForm.subForm.subForm2.showModelValidation).toBe(true);
	}));

});
