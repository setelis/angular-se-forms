describe("SeReferenceDataService", function () {
	"use strict";
	var REFERENCE_DATAS = {};

	var REFERENCE_DATA_TYPE_1 = "REFERENCE_DATA_TYPE_1";
	var REFERENCE_DATA_TYPE_2 = "REFERENCE_DATA_TYPE_2";

	var $httpBackend, scope, $rootScope;
	var SeReferenceDataService;

	var handler1, handler2;

	function generateUrl(type) {
		var URL_PREFIX = "/referencedatum/";
		var URL_SUFFIX = "?from=0&max=5000";
		return URL_PREFIX + type + URL_SUFFIX;
	}

	function expectToHaveBeenCalledWith(handler, expected) {
		expect(handler.calls.count()).toBe(1);
		expect(handler.calls.first().args[0]).not.toBe(expected);
		expect(handler.calls.first().args[0]).toEqual(expected);
	}
	function getData(data) {
		return data.data;
	}

	beforeEach(module("seForms.referencedata.service"));

	beforeEach(inject(function (_$httpBackend_, _SeReferenceDataService_) {
		$httpBackend = _$httpBackend_;
		SeReferenceDataService = _SeReferenceDataService_;
	}));
	beforeEach(inject(function () {
		REFERENCE_DATAS[REFERENCE_DATA_TYPE_1] = {
			data: [
				{key: "type1rd1", id: 11, label: "LABELtype1rd1"},
				{key: "type1rd2", id: 12, label: "LABELtype1rd2"}
			]
		};
		REFERENCE_DATAS[REFERENCE_DATA_TYPE_2] = {
			data: [
				{key: "type2rd1", id: 21, label: "LABELtype2rd1"},
				{key: "type2rd2", id: 22, label: "LABELtype2rd2"}
			]
		};
	}));
	beforeEach(inject(function () {
		handler1 = jasmine.createSpy("handler1");
		handler2 = jasmine.createSpy("handler2");
	}));
	beforeEach(inject(function (_$rootScope_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	describe("common scenario", function () {
		it("should query server for reference data", function() {
			$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_1)).respond(200,
				JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));

			SeReferenceDataService.get(REFERENCE_DATA_TYPE_1).then(handler1);
			expect(handler1.calls.count()).toBe(0);

			$httpBackend.flush();
			expectToHaveBeenCalledWith(handler1, getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));
		});

		it("should cache reference data", function() {
			$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_1)).respond(200,
				JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));

			SeReferenceDataService.get(REFERENCE_DATA_TYPE_1).then(handler1);
			expect(handler1.calls.count()).toBe(0);

			$httpBackend.flush();
			expectToHaveBeenCalledWith(handler1, getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));

			// get from the cache
			expect(handler2.calls.count()).toBe(0);
			SeReferenceDataService.get(REFERENCE_DATA_TYPE_1).then(handler2);
			scope.$digest();
			expectToHaveBeenCalledWith(handler2, getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));
		});
		it("should prefetch reference data", function() {
			$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_1)).respond(200,
				JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));
			$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_2)).respond(200,
				JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_2]));

			SeReferenceDataService.prefetch([REFERENCE_DATA_TYPE_1, REFERENCE_DATA_TYPE_2]).then(handler1);
			expect(handler1.calls.count()).toBe(0);

			$httpBackend.flush();
			expectToHaveBeenCalledWith(handler1, [getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]), getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_2])]);

			// get from the cache
			expect(handler2.calls.count()).toBe(0);
			SeReferenceDataService.get(REFERENCE_DATA_TYPE_1).then(handler2);
			scope.$digest();
			expectToHaveBeenCalledWith(handler2, getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));
		});
		it("should find reference data by key", function() {
			prefetchReferenceData();

			var expected = getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1])[0];
			var actual = SeReferenceDataService.findReferenceDataByKey(REFERENCE_DATA_TYPE_1, expected.key);

			expect(actual).toEqual(expected);
		});
		it("should handle not prefetched type in find reference data by key", function() {
			prefetchReferenceData();

			var actual = SeReferenceDataService.findReferenceDataByKey(REFERENCE_DATA_TYPE_1 + "notprefetched", "somehting");

			expect(actual).toBeUndefined();
		});
		it("should handle missed key in find reference data by key", function() {
			prefetchReferenceData();

			var expected = REFERENCE_DATAS[REFERENCE_DATA_TYPE_1].data[0];
			var actual = SeReferenceDataService.findReferenceDataByKey(REFERENCE_DATA_TYPE_1, expected.key + "notfound");

			expect(actual).toBeUndefined();
		});
		it("should convert many keys to reference data", function() {
			prefetchReferenceData();

			var expected = getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]);
			var actual = SeReferenceDataService.convertKeysToReferenceData(REFERENCE_DATA_TYPE_1, [expected[0].key, expected[1].key]);

			expect(actual).toEqual(expected);
		});
	});

	function prefetchReferenceData() {
		var prefetchHandler = jasmine.createSpy("prefetchHandler");

		$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_1)).respond(200,
			JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]));
		$httpBackend.expectGET(generateUrl(REFERENCE_DATA_TYPE_2)).respond(200,
			JSON.stringify(REFERENCE_DATAS[REFERENCE_DATA_TYPE_2]));

		SeReferenceDataService.prefetch([REFERENCE_DATA_TYPE_1, REFERENCE_DATA_TYPE_2]).then(prefetchHandler);
		expect(prefetchHandler.calls.count()).toBe(0);

		$httpBackend.flush();
		expectToHaveBeenCalledWith(prefetchHandler, [getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_1]), getData(REFERENCE_DATAS[REFERENCE_DATA_TYPE_2])]);

	}


});
