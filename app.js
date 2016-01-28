"use strict";

(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      // vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      var floorArray = [null, null, null, null, null, null, null, null, null, null, null, null];
      var currentFloor = 0;
      var elevatorDirection = null;
      var numFloorsToVisitUp = 0;
      var numFloorsToVisitDown = 0;
      var pending = false;

      vm.handleCallButtonPress = function(floor, isUp) {
        if (currentFloor === floor) {
          openCloseElevator();
        } else {
          addCallToPendingFloors(floor, isUp);
        }
      };


      vm.handleInElevButtonPress = function(floor) {

        if (floor === currentFloor) {
          openCloseElevator();
          return;
        }

        if (!elevatorDirection) {
          determineInitialDirection(floor);
          addToPendingFloors(floor);
          activateElevator();
        } else {
          addToPendingFloors(floor);
        }

      };

      function determineInitialDirection(floor) {

        if (floor > currentFloor) {
          elevatorDirection = "up";
        } else {
          elevatorDirection = "down";
        }

      }

      // refactor!!!
      function addToPendingFloors(floor) {
        floorArray[floor] = 'stop';
        addToVisitCounter(floor);
      }

      function addCallToPendingFloors(floor, isUp) {
        if (isUp) {
          floorArray[floor] = 'up';
        } else {
          floorArray[floor] = 'down';
        }

        addToVisitCounter(floor);

      }

      function addToVisitCounter(floor) {
        if (elevatorDirection === "up" && floor > currentFloor) {
          numFloorsToVisitUp++;
        } else if (elevatorDirection === "down" && floor < currentFloor) {
          numFloorsToVisitDown++;
        } else if (elevatorDirection === "down" && floor > currentFloor) {
          numFloorsToVisitUp++;
        } else if (elevatorDirection === "up" && floor < currentFloor) {
          numFloorsToVisitDown++;
        }
      }

      function activateElevator() {
        if (elevatorDirection === null) {
          return;
        }

        while(!pending) {

          if (elevatorDirection === "up") {
            while (numFloorsToVisitUp) {
              currentFloor++;
              determineFloorAction();
              numFloorsToVisitUp--;
            }
          } else if (elevatorDirection === "down") {
            while (numFloorsToVisitDown) {
              currentFloor--;
              determineFloorAction();
              numFloorsToVisitDown--;
            }
          }

        }

        determineNewDirection();
        activateElevator();

      }

      function determineFloorAction() {
        if (floorArray[currentFloor] === "stop" || floorArray[currentFloor] === elevatorDirection) {
          floorArray[currentFloor] = null;
          openCloseElevator();
        } else if (floorArray[currentFloor] === null || floorArray[currentFloor] !== elevatorDirection) {
          moveElevator();
        }
      }

      // refactor!
      function determineNewDirection() {
        if (elevatorDirection === "up" && numFloorsToVisitUp) {
          return;
        } else if (elevatorDirection === "down" && numFloorsToVisitDown) {
          return;
        } else if (elevatorDirection === "up" && numFloorsToVisitDown) {
          elevatorDirection = "down";
        } else if (elevatorDirection === "down" && numFloorsToVisitUp) {
          elevatorDirection = "up";
        } else {
          elevatorDirection = null;
        }
      }

      function openCloseElevator() {
        // open & close, and add 3 or 2 second delay
        pending = true;
        setTimeout(function() {
          pending = false;
        }, 3000);
      }

      function moveElevator() {
        // add 1 second delay
        pending = true;
        setTimeout(function() {
          pending = false;
        }, 1000);
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