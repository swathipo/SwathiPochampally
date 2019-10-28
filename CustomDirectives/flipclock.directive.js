angular.module('SW.FlipClock', [])
 /**
   * @ngdoc directive
   * @name swFlipClock
   * * @reference: https://github.com/objectivehtml/FlipClock
                   http://flipclockjs.com/
   * @restrict E
   * @clockFactoryOptions
   *  'time' : the clock will be build based on the time provided.
     'ClockFace'  this is the face of the clock that is used to build the clock display. The default value is HourlyCounter. 
      Possible face values[ Counter, DailyCounter,MinuteCounter,HourlyCounter,TwelveHourClock, TwentyFourHourClock, WeekCounter, YearCounter].
     'countdown'  If this is set to true, the clock will count down instead of up. The default value is false
     'showSeconds' If this is set to false, clock will be displayed without seconds.The Default value is true
     'autoStart' If this is set to false, clock will not autostart.The Default value is true
   * @clockmethods
      'start', //This method will start the clock just call the .start() method on an FlipClock object.
      'stop',  // This method will stop the clock just call the .stop() method on an FlipClock object.
      'setTime', //This method will set the clock time after it has been instantiated just call the .setTime() method on an FlipClock object.
      'setCountdown', //This method will change the clock from counting up or down.
      'getTime' //To get the clock time after it has been instantiated just call the .getTime() method on an FlipClock object.
   * @callbacks
      'destroy', //This callback is triggered when the timer is destroyed
      'create', // This callback is triggered when the clock face is created
      'init', //This callback is triggered when the FlipClock object is initialized
      'interval', //This callback is triggered with each interval of the timer
      'start', //This callback is triggered when the clock is started
      'stop', //This callback is triggered when the clock is stopped
      'reset' // This callback is triggered when the timer has been reset
  */
  .directive('swFlipClock', ['$parse', function($parse) {
    return {
      replace: true,
      template: '<div></div>',
      restrict: 'E',
      scope: {
        time: '@', // string endDate eg:(December 17, 2019 03:24:00)
        clockFace: '@?', //string default is 'HourlyCounter'
        showSeconds: '@?', //boolean default is false
        countdown: '@?', //boolean default is false
        autoStart: '@?', //boolean default is true
        //callbacks
        start: '=?',
        destroy: '=?',
        create: '=?',
        init:'=?',
        interval: '=?',
        stop: '=?',
        reset: '=?',
        //methods
        setCountdown: '&?',
        setTime: '&?',
        getTime: '&?'       
      },
      controller: FlipClockCtrl,
      controllerAs: "vm",
      link: function($scope, $el, $attr) {

        var clockFactoryOptions = ['clockFace', 'countdown', 'showSeconds', 'autoStart'],
            clockMethods = ['start', 'stop', 'setTime', 'setCountdown', 'getTime'],
            callbacks = ['destroy', 'create','init','interval', 'start','stop', 'reset'], 
            options = {
              callbacks: {}
            },
            clock,
            date = new Date();

          clockFactoryOptions.forEach(function(key) {
            if($scope[key]){
              options[key] = $scope[key] === 'autoStart' ? SW.Utilities.StringToBool($scope[key]) : $scope[key];
              }
          });

          $scope.time = Math.max(new Date($scope.time).getTime()/1000 - date.getTime()/1000,0);

          //Initialize callbacks
          callbacks.forEach(function(callback) {
            if($scope[callback]){
              options.callbacks[callback] = function(){
                $parse($scope[callback])();
              }
            }
          });

          //generate flip clock object
          clock = $el.FlipClock($scope.time, options);
           
          //bind clockMethods to the scope
          clockMethods.forEach(function(method) {
            $scope[method] = function(){
              return clock[method].apply(clock, arguments);
            }
          });
    
    }
  }
    
  }]);
  function FlipClockCtrl() {};
