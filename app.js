"use strict";

/*
refactor by passing state into functions instead of storing in variables?

make sure to handle button presses inside elevator if nobodfy has pressed call yet
*/

(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      vm.floorArray = [null, null, null, null, null, null, null, null, null, null, null, null];
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
        vm.floorArray[floor] = 'stop';
        addToVisitCounter(floor);
      }

      function addCallToPendingFloors(floor, isUp) {
        if (isUp) {
          vm.floorArray[floor] = 'up';
        } else {
          vm.floorArray[floor] = 'down';
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
        } else if (elevatorDirection === null && floor > currentFloor) {
          numFloorsToVisitUp++;
        } else if (elevatorDirection === null && floor < currentFloor) {
          numFloorsToVisitDown++;
        }
        console.log("up");
        console.log(numFloorsToVisitUp);
        console.log("down");
        console.log(numFloorsToVisitDown);
        console.log(vm.floorArray);
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
        if (vm.floorArray[currentFloor] === "stop" || vm.floorArray[currentFloor] === elevatorDirection) {
          vm.floorArray[currentFloor] = null;
          openCloseElevator();
        } else if (vm.floorArray[currentFloor] === null || vm.floorArray[currentFloor] !== elevatorDirection) {
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
        console.log("opening and closing elevator");
        setTimeout(function() {
          pending = false;
        }, 3000);
      }

      function moveElevator() {
        // add 1 second delay
        pending = true;
        console.log("movingElevator");
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