( function() {
  'use strict';

  /* @ngInject */
  var formatSalesPriceFilter = function( $filter, $log ) {
    return _.memoize( function( salesPrice ) {
      if( !salesPrice || typeof salesPrice !== "string" ) {
        if( $log.canWarn() ) {
          $log.warn( "formatSalesPrice filter can't run on null, empty, or non-string values." );
        }
        return "";
      }
      var salesPriceArray = salesPrice.split( "-" );
      if( salesPriceArray.length === 1 ) {
        return $filter( "currency" )( salesPrice );
      } else {
        return $filter( "currency" )( salesPriceArray[ 0 ] ) + " - " + $filter( "currency" )( salesPriceArray[ 1 ] );
      }
    } );
  };


  angular
    .module( "SW.Product" )
    .filter( "formatSalesPrice", formatSalesPriceFilter );
} )();
