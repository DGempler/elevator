(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter);

    function elevatorController() {
      var vm = this;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      vm.handleFloorButtonClick = function(floor) {

        console.log(floor);

      }

      vm.handleCallButtonClick = function(isUp) {
        if (isUp) {

          console.log('going up!');

        } else {

          console.log('going down!');
        }


      }


    }

    function floorFilter() {
      return function(floor) {
        if (floor === 0) {
          return "Ground";
        } else {
          return floor;
        }
      }
    }

})();