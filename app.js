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
      var timeoutID;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      vm.handleCallButtonPress = function(floor, upRequest) {
        if (currentFloor === floor) {
          if (doorsOpened) {
            clearTimeout(timeoutID);
          }
          openCloseElevator();
          return;
        }

        if (elevatorDirection === null) {
          // do these things here?
          setInitialDirection(floor);
          floorArray.push(floor);
          console.log(floorArray);
          // insertInCurrentDirection(floor);
          activateElevator();
          return;
        }

        if (floor > currentFloor && elevatorDirection === "up" && upRequest) {

          insertInCurrentDirection(floor);

        } else if (floor < currentFloor && elevatorDirection === "down" && !upRequest) {

          insertInCurrentDirection(floor);

        } else if (floor > currentFloor && elevatorDirection === "up" && !upRequest) {
          console.log('case 3');
          insertInOtherDirection(floor);
        } else if (floor < currentFloor && elevatorDirection === "down" && upRequest) {
          console.log('case 4');
          insertInOtherDirection(floor);
        } else if (floor > currentFloor && elevatorDirection === "down" && upRequest) {

          insertInOtherDirection(floor);

        } else if (floor < currentFloor && elevatorDirection === "up" && !upRequest) {

          insertInOtherDirection(floor);

        } else if (floor < currentFloor && elevatorDirection === "up" && upRequest) {

          insertInOtherDirection(floor);

        } else if (floor > currentFloor && elevatorDirection === "down" && !upRequest) {

          insertInOtherDirection(floor);

        } else {
          console.log("you have unlocked the secret $$$$$$$$$$$$$$$$$$$$$ basement");
        }

      };


      vm.handleInElevButtonPress = function(floor) {

        if (currentFloor === floor) {
          if (doorsOpened) {
            clearTimeout(timeoutID);
          }
          openCloseElevator();
          return;
        }

        if (elevatorDirection === null) {
          // do these things here?
          setInitialDirection(floor);
          floorArray.push(floor);
          console.log(floorArray);
          // insertInCurrentDirection(floor);
          activateElevator();
          return;
        }

        if (floor > currentFloor && elevatorDirection === "up") {

          // true for heading same direction as current elevator
          insertInCurrentDirection(floor);

        } else if (floor < currentFloor && elevatorDirection === "down") {

          // true for heading same direction as current elevator
          insertInCurrentDirection(floor);

        } else if (floor > currentFloor && elevatorDirection === "down") {
          console.log('case 3');
          insertInOtherDirection(floor);
        } else if (floor < currentFloor && elevatorDirection === "up") {
          console.log('case 4');
          insertInOtherDirection(floor);
        } else {
          console.log("you have unlocked the secret $$$$$$$$$$$$$$$$$$$$$ basement");
        }

      };


      function addCall(floor, isUp) {
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
        if (elevatorDirection === "up") {
          // moved to sort Current Direction functions
          // floorArray.splice(numFloorsToVisitUp, 0, floor);
          sortCurrentDirectionUp(floor);

        } else {
          // floorArray.splice(numFloorsToVisitDown, 0, floor);
          sortCurrentDirectionDown(floor);

        }

      }

      function insertInOtherDirection(floor) {
        if (elevatorDirection === "up") {
          sortOtherDirectionDown(floor);
        } else {
          sortOtherDirectionUp(floor);
        }
      }

      // already compared current floor, compare existing floors to determine where to put it
      function sortCurrentDirectionUp(floor) {
        var upFloors = floorArray.slice(0, numFloorsToVisitUp + 1);
        var i;
        if (upFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        console.log('numfloorstovisitup: ' + numFloorsToVisitUp);
        floorArray.splice(numFloorsToVisitUp, 0, floor);
        console.log(floorArray);
        console.log("i = " + (floorArray.length -2));

        for (i = numFloorsToVisitUp -1; i > -1; i--) {
          if (floor < floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floor;

        console.log(floorArray);

        numFloorsToVisitUp++;

      }

      function sortCurrentDirectionDown(floor) {
        var downFloors = floorArray.slice(0, numFloorsToVisitDown + 1);
        var i;
        if (downFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        floorArray.splice(numFloorsToVisitDown, 0, floor);

        for (i = numFloorsToVisitDown -1; i > -1; i--) {
          if (floor > floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floor;

        console.log(floorArray);

        numFloorsToVisitDown++;

      }

      function sortOtherDirectionDown(floor) {
        var downFloors = floorArray.slice(numFloorsToVisitUp);
        var i;
        console.log(downFloors);
        if (downFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        floorArray.push(floor);

        for (i = floorArray.length -2; i >= numFloorsToVisitUp; i--) {
          if (floor > floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floor;

        console.log(floorArray);

        numFloorsToVisitDown++;

      }

      function sortOtherDirectionUp(floor) {
        var upFloors = floorArray.slice(numFloorsToVisitDown);
        var i;
        console.log(upFloors);
        if (upFloors.indexOf(floor) !== -1) {
          // what is direction is wrong?
          return;
        }

        floorArray.push(floor);

        for (i = floorArray.length -2; i >= numFloorsToVisitDown; i--) {
          if (floor < floorArray[i]) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floor;

        console.log(floorArray);

        numFloorsToVisitUp++;

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
          console.log("done moving!!!");
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


      function openCloseElevator(hasArrived) {
        // open & close, and add 3 or 2 second delay
        floorArray.shift();
        if (hasArrived && elevatorDirection === "up") {
          numFloorsToVisitUp--;
        } else if (hasArrived && elevatorDirection === "down") {
          numFloorsToVisitDown--;
        }

        setNewDirection();
        doorsOpened = true;
        console.log("opening elevator");
        timeoutID = setTimeout(function() {
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
          openCloseElevator(true);
          return;
        }


        setTimeout(function() {
          currentFloor++;
          console.log(currentFloor);
          moveElevatorUp();
        }, 1000);

      }

      function moveElevatorDown() {
        if (currentFloor === floorArray[0]) {
          openCloseElevator(true);
          return;
        }

        setTimeout(function() {
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