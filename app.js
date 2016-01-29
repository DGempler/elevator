"use strict";

(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter)

    .filter('reverse', reverse);

    function elevatorController() {
      var vm = this;
      var currentFloor = 0;
      var elevatorDirection = null;
      var floorArray = [];
      var numFloorsToVisitUp = 0;
      var numFloorsToVisitDown = 0;
      var doorsOpened = false;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      vm.handleCallButtonPress = function(floor, isUp) {
        if (currentFloor === floor) {
          openCloseElevator();
          // wait for in elev button press
        } else {
          addCallToPendingFloors(floor, isUp);
        }
      };


      vm.handleInElevButtonPress = function(floor) {

        if (currentFloor === floor) {
          openCloseElevator();
          return;
        }

        if (elevatorDirection === null && floorArray.length === 0) {
          // do these things here?
          // setInitialDirection();
          // floorArray.push(floor);
          insertInCurrentDirection(floor);
          activateElevator();
          return;
        }

        if (floor > currentFloor && elevatorDirection === "up") {

          // true for heading same direction as current elevator
          insertInCurrentDirection(floor);

        } else if (floor < currentFloor && elevatorDirection === "down") {

          // true for heading same direction as current elevator
          insertInCurrentDirection(floor);

        }

      };


      function addCallToPendingFloors(floor, isUp) {
        if (floor > currentFloor && (elevatorDirection === "up" || elevatorDirection === null)) {
          insertIntoFloorArray(floor, true, isUp);
        } else if (floor < currentFloor && (elevatorDirection === "down" || elevatorDirection === null)) {
          insertIntoFloorArray(floor, true, isUp);
        } else if (floor > currentFloor && elevatorDirection === "down") {
          insertIntoFloorArray(floor, false, isUp);
        } else if (floor < currentFloor && elevatorDirection === "up") {
          insertIntoFloorArray(floor, false, isUp);
        }

      }

      function insertIntoFloorArray(floor, isHeadingSameDirection, isUp) {

      }



      function insertInCurrentDirection(floor) {
        if (elevatorDirection === null) {
          // remove this check since do in handleInElv?
          // or leave just in case it gets set to null just before next button is pressed?
          setInitialDirection(floor);
          floorArray.push(floor);
          console.log(floorArray);

        } else if (elevatorDirection === "up") {
          // moved to sort Current Direction functions
          // floorArray.splice(numFloorsToVisitUp, 0, floor);
          sortCurrentDirectionUp(floor);
          numFloorsToVisitUp++;
        } else {
          // floorArray.splice(numFloorsToVisitDown, 0, floor);
          sortCurrentDirectionDown(floor);
          numFloorsToVisitDown++;
        }

      }

      // already compared current floor, compare existing floors to determine where to put it
      function sortCurrentDirectionUp(floor) {
        var upFloors = floorArray.slice(0, numFloorsToVisitUp + 1);
        if (upFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        floorArray.splice(numFloorsToVisitUp, 0, floor);

        for (var i = floorArray.length -2; i > -1; i--) {
          if (floor < floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            floorArray[i + 1] = floor;
            break;
          }
        }

        console.log(floorArray);

      }

      function sortCurrentDirectionDown(floor) {
        var downFloors = floorArray.slice(0, numFloorsToVisitUp + 1);
        if (downFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        floorArray.splice(numFloorsToVisitDown, 0, floor);

        for (var i = floorArray.length -2; i > -1; i--) {
          if (floor > floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            floorArray[i + 1] = floor;
            break;
          }
        }

        console.log(floorArray);
      }

      function activateElevator() {
        if (elevatorDirection === null || doorsOpened) {
          return;
        }

        // dequeue (shift) from floorArray to get next floor. If direction is up and current floor is bigger,
        // increment currentFloor by one and moveElevator() every time


        if (elevatorDirection === "up") {
          moveElevatorUp();

        } else {
          moveElevatorDown();
        }

        // need to pass in nextStop / current floor? for front-end

        // activate these inside of moveElevator Up/Down functions
        // openCloseElevator();

        // setNewDirection();
        // activateElevator();

      }

      function setNewDirection() {
        if (elevatorDirection === "up" && currentFloor < floorArray[0]) {
          return;
        } else if (elevatorDirection === "down" && currentFloor > floorArray[0]) {
          return;
        } else if (elevatorDirection === "up" && currentFloor > floorArray[0]) {
          elevatorDirection = "down";
        } else if (elevatorDirection === "down" && currentFloor < floorArray[0]) {
          elevatorDirection = "up";
        } else {
          elevatorDirection = null;
        }

        console.log(elevatorDirection);
      }

      function setInitialDirection(floor) {
        console.log('setting initial direction');
        if (floor > currentFloor) {
          elevatorDirection = "up";
          numFloorsToVisitUp++;
        } else {
          elevatorDirection = "down";
          numFloorsToVisitDown++;
        }

        console.log(elevatorDirection);

      }

      function openCloseElevator() {
        // open & close, and add 3 or 2 second delay
        floorArray.shift();
        setNewDirection();
        doorsOpened = true;
        console.log("opening elevator");
        setTimeout(function() {
          // to only close elevator and call functions once
          if (doorsOpened) {
            console.log('closing elevator');
            doorsOpened = false;
            activateElevator();
          }
        }, 3000);
      }


      function moveElevatorUp() {
        if (currentFloor === floorArray[0]) {
          openCloseElevator();
          return;
        }

        numFloorsToVisitUp--;
        console.log("moving");
        setTimeout(function() {
          console.log('done moving');
          currentFloor++;
          console.log(currentFloor);
          moveElevatorUp();
        }, 1000);

      }

      function moveElevatorDown() {
        if (currentFloor === floorArray[0]) {
          openCloseElevator();
          return;
        }

        numFloorsToVisitDown--;
        console.log("moving");
        setTimeout(function() {
          console.log('done moving');
          currentFloor--;
          console.log(currentFloor);
          moveElevatorDown();
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