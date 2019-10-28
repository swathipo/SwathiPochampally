( function() {
  'use strict';

  angular
    .module( "SW" )
    .directive( "swCharacterCount", CharacterCount );

  /* @ngInject */
  function CharacterCount() {
    return {
      restrict: 'E',
      transclude: {
        'swccMsg': '?swCharacterCountMsg'
      },
      bindToController: {
        maxlength: '@',
        value: '=',
        alignCounterToBottom: '=?',
        counterBelowBox: '=?'
      },
      controllerAs: 'charCountCtrl',
      scope: true,
      template: `
        <div class="sw-character-count">
          <div role="status" class="visibly-hidden" id="{{ charCountCtrl.uid }}" ng-bind-html="charCountCtrl.accessibleCounterMessage"></div>
          <div ng-class="charCountCtrl.classes.inputWrap">
            <ng-transclude aria-controls="{{ charCountCtrl.uid }}"></ng-transclude>
            <span ng-class="charCountCtrl.classes.counter" aria-hidden="true">{{ charCountCtrl.getCount() }}/{{ charCountCtrl.maxlength }}</span>
          </div>
          <div ng-class="charCountCtrl.classes.messageWrap">
            <div aria-hidden="true" ng-if="charCountCtrl.isMaxedOut()" class="sw-character-count__message notification notification--warning">
              You have reached the limit of {{charCountCtrl.maxlength}} characters.
            </div>
            <ng-transclude ng-transclude-slot="swccMsg"></ng-transclude>
          </div>
        </div>
      `,
      controller: function( $scope, _, $translate, debounce ) {
        var _this = this;

        // EXPOSING
        _this.value = _this.value || '';
        _this.limitChars = ( _this.maxlength + '' ).length;
        _this.isMaxedOut = isMaxedOut;
        _this.getCount = getCount;
        _this.uid = _.uniqueId( 'swCharacterCount_' );
        _this.accessibleCounterMessage = null;
        // this is debounced so it doesn't update too frequently and overwhelm a screenreader/audio user with useless info
        _this.populateAccessibleCounterMessage = debounce( populateAccessibleCounterMessage, 500 );
        _this.classes = {
          inputWrap : [
            'sw-character-count__input',
            !_this.counterBelowBox && 'sw-character-count__input--' + _this.limitChars || '',
            _this.counterBelowBox && 'sw-character-count__input--no-overlap' || '' 
          ],
          counter: [
            'sw-character-count__input__counter',
            'sw-character-count__input__counter--' + _this.limitChars,
            _this.alignCounterToBottom && !_this.counterBelowBox && 'sw-character-count__input__counter--bottom' || '',
            _this.counterBelowBox && 'sw-character-count__input__counter--below' || ''
          ],
          messageWrap: [
            'sw-character-count__message-wrap',
            'sw-character-count__message-wrap--reduce-' + _this.limitChars,
            _this.counterBelowBox && 'sw-character-count__message-wrap--reduce' || ''
          ]
        };

        // if our input changes at all, call out to our debounced accessibility message population method
        $scope.$watch( 'charCountCtrl.value', function( newVal, oldVal ) {
          if ( angular.isDefined( newVal ) ) {
            if( newVal !== oldVal ) {
              _this.populateAccessibleCounterMessage();
            }
          }
        });


        function populateAccessibleCounterMessage() {
          if( isMaxedOut() ) {
            _this.accessibleCounterMessage = 'You have reached the limit of ' + _this.maxlength + ' characters.';
          } else {
            _this.accessibleCounterMessage = getCount() + ' characters used out of ' + _this.maxlength;
          }
        }

        function getCount() {
          if ( angular.isDefined( _this.value ) ) {
            return _this.value.length;
          } else {
            return 0;
          }
        }

        function isMaxedOut() {
          if ( angular.isDefined( _this.value ) ) {
            return _this.value.length >= _this.maxlength;
          } else {
            return false;
          }
        }
      }
    };
  }
} )();
