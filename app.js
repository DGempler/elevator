"use strict";

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

      };

      vm.handleCallButtonClick = function(floor, isUp) {
        addToPendingFloorsFromCallButtonClick(floor, isUp);


      };

      function addToPendingFloorsFromCallButtonClick(floor, isUp) {
        pendingFloors.push(floor);
        console.log(pendingFloors);

      }

      function addToPendingFloorFromFloorButtonClick(floor) {
        if (pendingFloors.indexOf(floor) !== -1) {
          return;
        }

        if (pendingFloors.length === 0) {
          pendingFloors.push(floor);
        } else {

          for (var i = pendingFloors.length - 1; i > -1; i--) {
            if (floor > pendingFloors[i]) {
              pendingFloors.push(floor);
              break;
            } else if (floor < pendingFloors[i] && floor > pendingFloors[i - 1]) {

              pendingFloors.splice(i, 0, floor);
              break;

            } else if (i === 0) {

              pendingFloors.unshift(floor);
              break;

            }

          }

        }

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
      };
    }

    function reverse() {
      return function(floors) {
        return floors.slice().reverse();
      };
    }


})();