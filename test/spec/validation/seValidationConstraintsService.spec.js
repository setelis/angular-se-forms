describe("SeValidationConstraintsService", function () {
	"use strict";
	var SeValidationConstraintsService;
	var configuration;

	beforeEach(module("seForms.validation.constraints.service", function($provide) {
		configuration = {
			a: {hello: "world"},
			b: {hello2: "world2"}
		};
		$provide.value("SeValidationConstraintsConfiguration", configuration);
	}));

	beforeEach(inject(function (_SeValidationConstraintsService_) {
		SeValidationConstraintsService = _SeValidationConstraintsService_;
	}));

	it("it should return matched configuration", inject(function () {
		expect(SeValidationConstraintsService.getConstraints("a")).toBe(configuration.a);
	}));
	it("it should return empty configuration if no match", inject(function () {
		expect(SeValidationConstraintsService.getConstraints("c")).toEqual({});
	}));

});
