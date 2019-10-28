( function() {
  'use strict';

  angular
    .module( "SW.Typeahead" )
    .directive( "swTypeahead", AccountSearchTypeAhead );

  /* @ngInject */
  function AccountSearchTypeAhead() {
    return {
      restrict: 'E',
      templateUrl: 'AccountSearchTypeAhead/mysw-typeahead.directive.html',
      scope:  {
        viewAccountDetails: "=?", // triggers the controller method
        displayChildAccounts: '@?', //set to true to display only childaccounts
        displayParentAccounts: '@?', // set to true to display only parent accounts
        selectedAccount: '=?',
        isParentSelectboxExists: '@?'
      },
      controller: accountSearchTypeaheadController
    };


    function accountSearchTypeaheadController($scope, AccountJobFactory, $timeout, $rootScope, MySWAccountList) {
      var sortedAccounts = Object.values(JSON.parse(MySWAccountList)),
      isParentAttributes;     
      $scope.selectedAccount="";
      if($scope.displayChildAccounts || $scope.displayParentAccounts) {
        isParentAttributes = $scope.displayChildAccounts ? {'isParent': false} : {'isParent': true};
      }
      sortedAccounts.forEach( function( item ) {
        if(item.accountName && item.accountName.trim()!="" && item.accountName.includes('&')){
           item.accountName = item.accountName.replace("&apos;", "'").replace("&amp;", "&");
        };
      });

      $scope.sortedAccounts = angular.isUndefined(isParentAttributes) ? sortedAccounts : _.where(sortedAccounts, isParentAttributes) ;

       $scope.handleClick = function(selectedAccountDetailsObj) {
          $scope.displaySearchResults= false;
          $scope.selectedAccount = selectedAccountDetailsObj.accountNumber;
          if($scope.isParentSelectboxExists) {
            $scope.updateParentAccountOptions(selectedAccountDetailsObj) ;
          }
          $scope.viewAccountDetails(selectedAccountDetailsObj);     
       }; 
 
    }

  }
} )();