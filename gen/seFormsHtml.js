angular.module('seForms.html', ['seValidationLabelDirective.html']);

angular.module('seValidationLabelDirective.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('seValidationLabelDirective.html',
    '<span><label class="control-label" data-ng-if="errorMessage">{{(\'seValidationForm.\' + errorMessage) | translate:errorMessageContext}}</label></span>');
}]);
