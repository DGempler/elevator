"use strict";

(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      var headingUpFloors = [];
      var headingDownFloors = [];
      var elevatorDirectionUp = true;
      var currentFloor = 5;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


      vm.handleFloorButtonClick = function(floor) {

        if (currentFloor === floor) {
          return;
        } else if (floor > currentFloor) {

          addToPendingFloors(floor, headingUpFloors);

          if (headingDownFloors.length === 0) {
            elevatorDirectionUp = true;
          }

        } else {
          addToPendingFloors(floor, headingDownFloors);

          if (headingUpFloors.length === 0) {
            elevatorDirectionUp = false;
          }
        }


      };

      vm.handleCallButtonClick = function(floor, isUp) {
        addToPendingFloorsFromCallButtonClick(floor, isUp);


      };

      function addToPendingFloorsFromCallButtonClick(floor, isUp) {
        pendingFloors.push(floor);
        console.log(pendingFloors);

      }

      function addToPendingFloors(floor, floorArray) {

        if (floorArray.indexOf(floor) !== -1) {
          return;
        }

        if (floorArray.length === 0) {
          floorArray.push(floor);
        } else {

          for (var i = floorArray.length - 1; i > -1; i--) {
            if (floor > floorArray[i]) {
              floorArray.push(floor);
              break;
            } else if (floor < floorArray[i] && floor > floorArray[i - 1]) {

              floorArray.splice(i, 0, floor);
              break;

            } else if (i === 0) {

              floorArray.unshift(floor);
              break;

            }

          }

        }

        console.log(floorArray);

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