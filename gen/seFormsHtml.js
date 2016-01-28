angular.module('seForms.html', ['referencedata/seReferenceDataPickerDirective.html', 'validation/seValidationLabelDirective.html']);

angular.module('referencedata/seReferenceDataPickerDirective.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('referencedata/seReferenceDataPickerDirective.html',
    '<div data-ui-select="" data-ng-model="directive.selected" data-theme="bootstrap" class="ce-ui-select"><div data-ui-select-match="" data-placeholder="{{(\'seReferenceData.types.\' + type + \'.placeholder\') | translate}}" data-allow-clear="true">{{directive.selected.label}}</div><div data-ui-select-choices="" data-repeat="referenceData in referenceDatum | filter: {label: $select.search} | limitTo: 30"><div data-ng-bind-html="referenceData.label | highlight: $select.search"></div></div></div>');
}]);

angular.module('validation/seValidationLabelDirective.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('validation/seValidationLabelDirective.html',
    '<span><label class="control-label" data-ng-if="errorMessage">{{(\'seValidationForm.\' + errorMessage) | translate:errorMessageContext}}</label></span>');
}]);
