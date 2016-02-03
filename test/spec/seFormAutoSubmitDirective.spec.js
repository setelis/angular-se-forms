describe("seFormAutoSubmit", function () {
	"use strict";
	var $rootScope, scope, element, $compile, $timeout, $q;
	var updateDefered;

	var DEFAULT_TIMEOUT = 1500;
	var DEFAULT_TIMEOUT_DELTA = 10;

	beforeEach(module("seForms.autosubmit", function(){
	}));

	beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_, _$q_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$compile = _$compile_;
		$timeout = _$timeout_;
		$q = _$q_;
		scope.ctrl = {
			update: jasmine.createSpy("update")
		};
		updateDefered = $q.defer();

		scope.ctrl.update.and.returnValue(updateDefered.promise);
	}));
	it("should listen for changes and call update function", inject(function () {
		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var formController = element.data().$formController;

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

		expect(scope.ctrl.update.calls.count()).toBe(0);
		formController.$setDirty();
		scope.ctrl.data = {
			sample: "changed"
		};
		scope.$digest();
		expect(formController.showModelValidation).not.toBe(true);

		$timeout.flush(DEFAULT_TIMEOUT - DEFAULT_TIMEOUT_DELTA);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT_DELTA * 2);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(1);
	}));
	it("should not call update function if form is pristine", inject(function () {
		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var formController = element.data().$formController;

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

		expect(scope.ctrl.update.calls.count()).toBe(0);
		formController.$setPristine();
		scope.ctrl.data = {
			sample: "changed"
		};
		scope.$digest();
		expect(formController.showModelValidation).not.toBe(true);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(0);
	}));

	it("should listen for changes and call update function - second level change", inject(function () {
		scope.ctrl.data = {
			a: {}
		};

		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.a.b'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var formController = element.data().$formController;

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

		expect(scope.ctrl.update.calls.count()).toBe(0);
		formController.$setDirty();
		scope.ctrl.data.a.b = "changed";
		scope.$digest();
		expect(formController.showModelValidation).not.toBe(true);

		$timeout.flush(DEFAULT_TIMEOUT - DEFAULT_TIMEOUT_DELTA);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT_DELTA * 2);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(1);
	}));

	it("should listen for changes and call update function - when there is already data", inject(function () {
		scope.ctrl.data = {};

		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();
		var formController = element.data().$formController;

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

		expect(scope.ctrl.update.calls.count()).toBe(0);
		formController.$setDirty();
		scope.ctrl.data.sample = "changed";
		scope.$digest();
		expect(formController.showModelValidation).not.toBe(true);

		$timeout.flush(DEFAULT_TIMEOUT - DEFAULT_TIMEOUT_DELTA);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT_DELTA * 2);
		expect(formController.showModelValidation).not.toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(1);
	}));

	it("should not call update function if validation fails (set showModelValidation)", inject(function () {
		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();

		var formController = element.data().$formController;
		var inputController = formController.sampleInput;
		expect(scope.ctrl.update.calls.count()).toBe(0);

		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

		expect(scope.ctrl.update.calls.count()).toBe(0);

		inputController.$setValidity("sampleValidity", false);
		formController.$setDirty();
		scope.ctrl.data = {
			sample: "changed"
		};
		expect(formController.showModelValidation).not.toBe(true);
		scope.$digest();
		$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);
		expect(formController.showModelValidation).toBe(true);

		expect(scope.ctrl.update.calls.count()).toBe(0);
	}));
	it("should throttle update until changes are finished", inject(function () {
		function init() {
			element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
				"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			var formController = element.data().$formController;

			expect(scope.ctrl.update.calls.count()).toBe(0);

			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

			expect(scope.ctrl.update.calls.count()).toBe(0);
			return formController;
		}
		function changeValue() {
			formController.$setDirty();

			scope.ctrl.data = {
				sample: "changed"
			};
			scope.$digest();
			expect(formController.showModelValidation).not.toBe(true);

		}
		function changeValueBeforeTimeout() {
			$timeout.flush(DEFAULT_TIMEOUT - DEFAULT_TIMEOUT_DELTA);
			expect(formController.showModelValidation).not.toBe(true);

			expect(scope.ctrl.update.calls.count()).toBe(0);

			scope.ctrl.data.sample = "changed2";
			scope.$digest();
			$timeout.flush(DEFAULT_TIMEOUT - DEFAULT_TIMEOUT_DELTA);
			expect(formController.showModelValidation).not.toBe(true);
			expect(scope.ctrl.update.calls.count()).toBe(0);


		}
		function waitForTimeout() {
			$timeout.flush(DEFAULT_TIMEOUT_DELTA * 2);

			expect(formController.showModelValidation).not.toBe(true);

			expect(scope.ctrl.update.calls.count()).toBe(1);
		}

		var formController = init();
		changeValue();
		changeValueBeforeTimeout();
		waitForTimeout();
	}));

	it("should not call update until previous update is completed", inject(function () {
		function init() {
			element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
				"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
			element = $compile(element)(scope);
			scope.$digest();
			var formController = element.data().$formController;

			expect(scope.ctrl.update.calls.count()).toBe(0);

			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

			expect(scope.ctrl.update.calls.count()).toBe(0);
			return formController;
		}
		function changeValue() {
			formController.$setDirty();

			scope.ctrl.data = {
				sample: "changed"
			};
			scope.$digest();
			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);
		}
		function changeValueBeforePromiseCompletes() {
			expect(scope.ctrl.update.calls.count()).toBe(1);

			scope.ctrl.data.sample = "changed2";
			scope.$digest();
			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

			expect(scope.ctrl.update.calls.count()).toBe(1);
		}
		function updateAgainAfterPromise() {
			updateDefered.resolve();
			expect(scope.ctrl.update.calls.count()).toBe(1);
		}

		var formController = init();
		changeValue();
		changeValueBeforePromiseCompletes();
		updateAgainAfterPromise();
	}));

	it("should reset showModelValidation when changing from invalid to valid", inject(function () {
		function validityError() {
			expect(scope.ctrl.update.calls.count()).toBe(0);

			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

			expect(scope.ctrl.update.calls.count()).toBe(0);

			inputController.$setValidity("sampleValidity", false);
			formController.$setDirty();

			scope.ctrl.data = {
				sample: "changed"
			};
			expect(formController.showModelValidation).not.toBe(true);
			scope.$digest();
			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);
			expect(formController.showModelValidation).toBe(true);

			expect(scope.ctrl.update.calls.count()).toBe(0);
		}
		function noValidityError() {
			expect(scope.ctrl.update.calls.count()).toBe(0);

			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);

			expect(scope.ctrl.update.calls.count()).toBe(0);

			inputController.$setValidity("sampleValidity", true);

			scope.ctrl.data.sample = "changed2";
			expect(formController.showModelValidation).toBe(true);
			scope.$digest();
			$timeout.flush(DEFAULT_TIMEOUT + DEFAULT_TIMEOUT_DELTA);
			expect(formController.showModelValidation).not.toBe(true);

			expect(scope.ctrl.update.calls.count()).toBe(1);
		}

		element = angular.element("<form name='sampleForm' data-se-form-auto-submit='ctrl.update()' data-se-form-auto-submit-model='ctrl.data'>" +
			"<input id='sampleInput' name='sampleInput' data-ng-required='true' data-ng-model='ctrl.data.sample'></input></form>");
		element = $compile(element)(scope);
		scope.$digest();

		var formController = element.data().$formController;
		var inputController = formController.sampleInput;

		validityError();
		noValidityError();
	}));

});
