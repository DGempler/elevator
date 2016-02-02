"use strict";

/*
refactor by passing state into functions instead of storing in variables?

make sure to handle button presses inside elevator if nobodfy has pressed call yet

check if the floor already exists
*/

(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      var floorArray = [];
      var currentFloor = 0;
      var elevatorDirection = null;
      var numFloorsToVisitUp = 0;
      var numFloorsToVisitDown = 0;
      var doorsOpened = false;
      var doorTimeoutID;
      var moveElevatorTimeoutID;

      function Floor() {
        this.stop = null;
        this.up = null;
        this.down = null;
      }

      function createFloorArray() {
        for (var i = 0; i < 10; i++) {
          var floor = new Floor();
          floorArray.push(floor);
        }
      }

      vm.handleCallButtonPress = function(floor, upRequest, downRequest) {
        var floorObj;
        if (floor === currentFloor) {
          if (doorTimeoutID) {
            clearTimeout(doorTimeoutID);
          }
          // if (moveElevatorTimeoutID) {
          //   clearTimeout(moveElevatorTimeoutID);
          // }

          floorObj = floorArray[floor];

          if (elevatorDirection === "up" && upRequest) {
            if (floorObj.up) {
              console.log('uh-oh, up');
            }

            if (floorObj.stop) {
              console.log('uh-oh, stop');
            }


            floorObj.up = null;
            floorObj.stop = null;
            openCloseElevator();
          } else if (elevatorDirection === "down" && downRequest) {
            floorObj.stop = null;
            floorObj.down = null;
            openCloseElevator();
          } else {
            addCallToPendingFloors(floor, upRequest, downRequest);
          }
          return;
        }

        addCallToPendingFloors(floor, upRequest, downRequest);

        if (!elevatorDirection) {
          setInitialDirection(floor);
          activateElevator();
        }

      };

      vm.handleInElevButtonPress = function(floor) {

        if (floor === currentFloor) {
          if (doorTimeoutID) {
            clearTimeout(doorTimeoutID);
          }
          // if (moveElevatorTimeoutID) {
          //   clearTimeout(moveElevatorTimeoutID);
          // }

          if (elevatorDirection === "up") {
            floorArray[floor].up = null;
            floorArray[floor].stop = null;
          } else if (elevatorDirection === "down") {
            floorArray[floor].down = null;
            floorArray[floor].stop = null;
          }
          openCloseElevator();
          return;
        }

        addToPendingFloors(floor);

        if (!elevatorDirection) {
          setInitialDirection(floor);
          activateElevator();
        }


      };

      function setInitialDirection(floor) {

        if (floor > currentFloor) {
          elevatorDirection = "up";
        } else {
          elevatorDirection = "down";
        }

        console.log('setting initial direction to: ' + elevatorDirection);
      }

      function setNewDirection() {
        console.log("up: " + numFloorsToVisitUp);
        console.log("down: " + numFloorsToVisitDown);
        console.log('setting new direction');
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
        console.log(elevatorDirection);
      }

      // refactor!!!
      function addToPendingFloors(floor) {
        var floorObj = floorArray[floor];
        if (floorObj.stop) {
          return;
        }
        floorObj.stop = true;
        console.log(floorArray);
        addToVisitCounter(floor);
      }

      function addCallToPendingFloors(floor, upRequest, downRequest) {
        var floorObj = floorArray[floor];
        if ((floorObj.up && upRequest) || (floorObj.down && downRequest)) {
          return;
        }
        floorArray[floor].up = upRequest;
        floorArray[floor].down = downRequest;
        console.log(floorArray);

        addToVisitCounter(floor);

      }

      function addToVisitCounter(floor) {
        console.log('floor: ' + floor);
        if (floor > currentFloor) {
          numFloorsToVisitUp++;
        } else if (floor < currentFloor) {
          numFloorsToVisitDown++;
        }
        console.log("up: " + numFloorsToVisitUp);
        console.log("down: " + numFloorsToVisitDown);
      }


      function activateElevator() {
        if (elevatorDirection === null || doorsOpened) {
          return;
        }

        if (elevatorDirection === "up") {
          moveElevatorUp();

        } else {
          moveElevatorDown();
        }

      }

      function openCloseElevator(hasArrived) {

        doorsOpened = true;
        console.log("opening elevator");
        doorTimeoutID = setTimeout(function() {
          // to only close elevator and call functions once
          if (doorsOpened) {
            console.log('closing elevator');
            doorsOpened = false;

            if (hasArrived) {
              setNewDirection();
            }

            activateElevator();
          }
        }, 3000);
      }


      function moveElevatorUp() {
        var floor;
        currentFloor++;
        console.log(currentFloor);

        floor = floorArray[currentFloor];

        if (floor.down) {
          numFloorsToVisitUp--;
          if (!numFloorsToVisitUp) {
            openCloseElevator(true);
            return;
          }
          numFloorsToVisitDown++;
        }

        if (floor.up) {
          if (floor.stop) {
            floor.stop = null;
            numFloorsToVisitUp--;
          }
          floor.up = null;
          numFloorsToVisitUp--;
          openCloseElevator(true);
          return;
        }

        if (floor.stop) {
          floor.stop = null;
          numFloorsToVisitUp--;
          openCloseElevator(true);
          return;
        }

        moveElevatorTimeoutID = setTimeout(function() {
          moveElevatorUp();
        }, 1000);


      }

      function moveElevatorDown() {
        var floor;
        currentFloor--;
        console.log(currentFloor);

        floor = floorArray[currentFloor];

        if (floor.up) {
          numFloorsToVisitDown--;
          if (!numFloorsToVisitDown) {
            openCloseElevator(true);
            return;
          }
          numFloorsToVisitUp++;
        }


        if (floor.down) {
          if (floor.stop) {
            floor.stop = null;
            numFloorsToVisitDown--;
          }
          floor.down = null;
          floor.stop = null;
          numFloorsToVisitDown--;
          openCloseElevator(true);
          return;
        }

        if (floor.stop) {
          floor.stop = null;
          numFloorsToVisitDown--;
          openCloseElevator(true);
          return;
        }

        moveElevatorTimeoutID = setTimeout(function() {
          moveElevatorDown();
        }, 1000);

      }

      createFloorArray();

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