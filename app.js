(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      var pendingFloors = [];

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


      vm.handleFloorButtonClick = function(floor) {

        addToPendingFloorFromFloorButtonClick(floor);

      }

      vm.handleCallButtonClick = function(floor, isUp) {
        addToPendingFloorsFromCallButtonClick(floor, isUp);


      }

      function addToPendingFloorsFromCallButtonClick(floor, isUp) {
        pendingFloors.push(floor);
        console.log(pendingFloors);

      }

      function addToPendingFloorFromFloorButtonClick(floor) {
        pendingFloors.push(floor);
        console.log(pendingFloors);

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

    function reverse() {
      return function(floors) {
        return floors.slice().reverse();
      };
    };




})();