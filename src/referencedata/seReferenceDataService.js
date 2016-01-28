angular.module("seForms.referencedata.service", ["restangular"]).service("SeReferenceDataService", function (Restangular, $q, $log) {
	"use strict";
	var REST = {
		REFERENCE_DATUM: "referencedatum"
	};

	var CACHE = {};
	var service = this;

	service.get = function(type) {
		if (CACHE[type]) {
			// from cache
			return $q.when(CACHE[type]);
		}
		// ask server
		var result = Restangular.one(REST.REFERENCE_DATUM, type).get({from: 0, max: 5000}).then(function(response) {
			CACHE[type] = response.data;
			return response.data;
		});
		CACHE[type] = result;
		return result;
	};

	service.prefetch = function(types) {
		var requests = [];
		$.each(types, function() {
			requests.push(service.get(this));
		});

		return $q.all(requests);
	};

	service.findReferenceDataByKey = function(type, key) {
		var referenceDatas = CACHE[type];
		if (!referenceDatas || angular.isFunction(referenceDatas.then)) {
			$log.error("SeReferenceDataService.findReferenceDataByKey(): you should prefetch", type, "before searching for", key,
				"use SeReferenceDataService.prefetch(<types>).then(SeReferenceDataService.findReferenceDataByKey(...))", referenceDatas);
			return;
		}
		var result = _.find(referenceDatas, {key: key});
		if (!result) {
			$log.error("SeReferenceDataService.findReferenceDataByKey(): can't find data for ", key, "in", type, "all values:", referenceDatas);
		}
		return result;
	};
	service.convertKeysToReferenceData = function(type, referenceDataKeysArray) {
		var result = [];
		$.each(referenceDataKeysArray, function() {
			result.push(service.findReferenceDataByKey(type, this));
		});
		return result;
	};

});
