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
      var timeoutID2;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      vm.handleCallButtonPress = function(floor, upRequest, downRequest) {
        if (currentFloor === floor && ((upRequest && elevatorDirection === "up") || (downRequest && elevatorDirection === "down") || elevatorDirection === null)) {
          if (timeoutID) {
            clearTimeout(timeoutID);
          }
          if (timeoutID2) {
            clearTimeout(timeoutID2);
          }
          openCloseElevator();
          return;
        }

        if (elevatorDirection === null) {
          // do these things here?
          setInitialDirection(floor, upRequest, downRequest);

          floorArray.push({ floor: floor, up: upRequest, down: downRequest});
          console.log(floorArray);
          // insertInCurrentDirection(floor);
          activateElevator();
          return;
        }

        if (floor >= currentFloor && elevatorDirection === "up" && upRequest) {

          insertInCurrentDirection(floor, upRequest, downRequest);

        } else if (floor <= currentFloor && elevatorDirection === "down" && downRequest) {

          insertInCurrentDirection(floor, upRequest, downRequest);

        } else if (floor >= currentFloor && elevatorDirection === "up" && downRequest) {
          console.log('case 3');
          insertInOtherDirection(floor, upRequest, downRequest);
        } else if (floor <= currentFloor && elevatorDirection === "down" && upRequest) {
          console.log('case 4');
          insertInOtherDirection(floor, upRequest, downRequest);
        } else if (floor >= currentFloor && elevatorDirection === "down" && upRequest) {

          insertInOtherDirection(floor, upRequest, downRequest);

        } else if (floor <= currentFloor && elevatorDirection === "up" && downRequest) {

          insertInOtherDirection(floor, upRequest, downRequest);

        } else if (floor <= currentFloor && elevatorDirection === "up" && upRequest) {

          insertInOtherDirection(floor, upRequest, downRequest);

        } else if (floor >= currentFloor && elevatorDirection === "down" && downRequest) {

          insertInOtherDirection(floor, upRequest, downRequest);

        } else {
          console.log("you have unlocked the secret $$$$$$$$$$$$$$$$$$$$$ basement");
        }

      };


      vm.handleInElevButtonPress = function(floor) {

        if (currentFloor === floor) {
          if (timeoutID) {
            clearTimeout(timeoutID);
          }
          if (timeoutID2) {
            clearTimeout(timeoutID2);
          }
          openCloseElevator();
          return;
        }

        if (elevatorDirection === null) {
          // do these things here?
          setInitialDirection(floor, true, true);
          floorArray.push({ floor: floor, up: null, down: null });
          console.log(floorArray);
          // insertInCurrentDirection(floor);
          activateElevator();
          return;
        }

        if (floor > currentFloor && elevatorDirection === "up" && floorArray[0].down) {
          insertBeforeExistingFloors(floor);
        } else if (floor < currentFloor && elevatorDirection === "down" && floorArray[0].up) {
          insertBeforeExistingFloors(floor);
        } else if (floor > currentFloor && elevatorDirection === "up") {

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



      function insertInCurrentDirection(floor, upRequest, downRequest) {
        if (elevatorDirection === "up") {
          // moved to sort Current Direction functions
          // floorArray.splice(numFloorsToVisitUp, 0, floor);
          sortCurrentDirectionUp(floor, upRequest, downRequest);

        } else {
          // floorArray.splice(numFloorsToVisitDown, 0, floor);
          sortCurrentDirectionDown(floor, upRequest, downRequest);

        }

      }

      function insertInOtherDirection(floor, upRequest, downRequest) {
        if (elevatorDirection === "up") {
          sortOtherDirectionDown(floor, upRequest, downRequest);
        } else {
          sortOtherDirectionUp(floor, upRequest, downRequest);
        }
      }

      function insertBeforeExistingFloors(floor) {
        if (elevatorDirection === "up") {
          sortBeforeHeadingDownFloors(floor);
        } else {
          sortBeforeHeadingUpFloors(floor);
        }
      }


      // already compared current floor, compare existing floors to determine where to put it
      function sortCurrentDirectionUp(floor, upRequest, downRequest) {
        var i;
        var floorObject;
        var upFloors;
        var notACall = false;

        if (upRequest || downRequest) {
          upFloors = floorArray.slice(0, numFloorsToVisitUp + 1);
        } else {
          notACall = true;
          upFloors = floorArray.slice();
        }

        var filteredUpFloors = upFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredUpFloors.indexOf(floor);

        if (floorIndex !== -1) {

          floorObject = floorArray[floorIndex];

          if (notACall && floorObject.down && !floorObject.up) {
          } else {

            if (!floorObject.up && upRequest) {
              floorObject.up = upRequest;
            }

            if (!floorObject.down && downRequest) {
              floorObject.down = downRequest;
            }

            return;
          }
        }

        floorObject = { floor: floor, up: upRequest, down: downRequest };
        floorArray.splice(numFloorsToVisitUp, 0, floorObject);

        for (i = numFloorsToVisitUp -1; i > -1; i--) {
          if (floorObject.floor < floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitUp++;

      }

      function sortCurrentDirectionDown(floor, upRequest, downRequest) {
        var i;
        var floorObject;
        var downFloors;
        var notACall = false;

        if (upRequest || downRequest) {
          downFloors = floorArray.slice(0, numFloorsToVisitDown + 1);
        } else {
          notACall = true;
          downFloors = floorArray.slice();
        }

        var filteredDownFloors = downFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredDownFloors.indexOf(floor);

        if (floorIndex !== -1) {

          floorObject = floorArray[floorIndex];

          if (notACall && floorObject.up && !floorObject.down) {
          } else {
            if (!floorObject.up && upRequest) {
              floorObject.up = upRequest;
            }

            if (!floorObject.down && downRequest) {
              floorObject.down = downRequest;
            }

            return;
          }
        }

        floorObject = { floor: floor, up: upRequest, down: downRequest };
        floorArray.splice(numFloorsToVisitDown, 0, floorObject);

        for (i = numFloorsToVisitDown -1; i > -1; i--) {
          if (floorObject.floor > floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitDown++;

      }

      function sortOtherDirectionDown(floor, upRequest, downRequest) {
        var i;
        var floorObject;
        var downFloors;

        if (upRequest || downRequest) {
          downFloors = floorArray.slice(numFloorsToVisitUp);
        } else {
          downFloors = floorArray.slice();
        }

        var filteredDownFloors = downFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredDownFloors.indexOf(floor);

        if (floorIndex !== -1) {

          floorObject = floorArray[floorIndex];

          if (!floorObject.up && upRequest) {
            floorObject.up = upRequest;
          }

          if (!floorObject.down && downRequest) {
            floorObject.down = downRequest;
          }

          return;
        }

        floorObject = { floor: floor, up: upRequest, down: downRequest };
        floorArray.push(floorObject);

        for (i = floorArray.length -2; i >= numFloorsToVisitUp; i--) {
          if (floorObject.floor > floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitDown++;

      }

      function sortOtherDirectionUp(floor, upRequest, downRequest) {
        var i;
        var floorObject;
        var upFloors;

        if (upRequest || downRequest) {
          upFloors = floorArray.slice(numFloorsToVisitDown);
        } else {
          upFloors = floorArray.slice();
        }

        var filteredUpFloors = upFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredUpFloors.indexOf(floor);

        if (floorIndex !== -1) {

          floorObject = floorArray[floorIndex];

          if (!floorObject.up && upRequest) {
            floorObject.up = upRequest;
          }

          if (!floorObject.down && downRequest) {
            floorObject.down = downRequest;
          }

          return;
        }

        floorObject = { floor: floor, up: upRequest, down: downRequest };
        floorArray.push(floorObject);

        for (i = floorArray.length -2; i >= numFloorsToVisitDown; i--) {
          if (floorObject.floor < floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitUp++;

      }

      function sortBeforeHeadingDownFloors(floor) {
        var i;
        var floorObject;
        var upFloors = floorArray.slice(numFloorsToVisitDown);
        var filteredUpFloors = upFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredUpFloors.indexOf(floor);

        if (floorIndex !== -1) {
          return;
        }

        floorObject = { floor: floor, up: undefined, down: undefined };
        floorArray.splice(numFloorsToVisitUp, 0, floorObject);

        for (i = numFloorsToVisitUp -1; i > -1; i--) {
          if (floorObject.floor < floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitUp++;
      }

      function sortBeforeHeadingUpFloors(floor) {
        var i;
        var floorObject;
        var downFloors = floorArray.slice(numFloorsToVisitUp);
        var filteredDownFloors = downFloors.map(function(floor) {
          return floor.floor;
        });
        var floorIndex = filteredDownFloors.indexOf(floor);

        if (floorIndex !== -1) {
          return;
        }

        floorObject = { floor: floor, up: undefined, down: undefined };
        floorArray.splice(numFloorsToVisitDown, 0, floorObject);

        for (i = numFloorsToVisitDown -1; i > -1; i--) {
          if (floorObject.floor > floorArray[i].floor) {
            floorArray[i+1] = floorArray[i];
          } else {
            break;
          }
        }
        floorArray[i + 1] = floorObject;

        console.log(floorArray);

        numFloorsToVisitDown++;

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
        // refactor!!!
        if (floorArray[0]) {

          if (elevatorDirection === "up" && currentFloor < floorArray[0].floor) {
            return;
          } else if (elevatorDirection === "down" && currentFloor > floorArray[0].floor) {
            return;
          } else if (elevatorDirection === "up" && currentFloor > floorArray[0].floor) {
            elevatorDirection = "down";
          } else if (elevatorDirection === "down" && currentFloor < floorArray[0].floor) {
            elevatorDirection = "up";
          } else {
            elevatorDirection = null;
            console.log("done moving!!!");
          }

        } else {
          elevatorDirection = null;
          console.log("done moving!!!");
        }

        console.log(elevatorDirection);
      }

      function setInitialDirection(floor, upRequest, downRequest) {
        console.log('setting initial direction');
        if (floor > currentFloor && upRequest) {
          elevatorDirection = "up";
          numFloorsToVisitUp++;
        } else if (floor < currentFloor && downRequest) {
          elevatorDirection = "down";
          numFloorsToVisitDown++;
        } else if (floor > currentFloor && downRequest) {
          elevatorDirection = "up";
          numFloorsToVisitDown++;
        } else if (floor < currentFloor && upRequest) {
          elevatorDirection = "down";
          numFloorsToVisitUp++;
        }

        console.log(elevatorDirection);

      }


      function openCloseElevator(hasArrived) {
        // open & close, and add 3 or 2 second delay
        if (hasArrived) {
          if (elevatorDirection === "up") {
            numFloorsToVisitUp--;
          } else if (elevatorDirection === "down") {
            numFloorsToVisitDown--;
          }
        }


        doorsOpened = true;
        console.log("opening elevator");
        timeoutID = setTimeout(function() {
          // to only close elevator and call functions once
          if (doorsOpened) {
            console.log('closing elevator');
            doorsOpened = false;
            if (hasArrived) {
              floorArray.shift();
              setNewDirection();
            }
            activateElevator();
          }
        }, 3000);
      }


      function moveElevatorUp() {
        if (currentFloor === floorArray[0].floor) {
          if (floorArray[0].up === undefined && floorArray[0].down === true) {
            timeoutID2 = setTimeout(function() {
              currentFloor++;
              console.log(currentFloor);
              moveElevatorUp();
            }, 1000);
          } else {
            openCloseElevator(true);
          }
          return;
        }


        timeoutID2 = setTimeout(function() {
          currentFloor++;
          console.log(currentFloor);
          moveElevatorUp();
        }, 1000);

      }

      function moveElevatorDown() {
        if (currentFloor === floorArray[0].floor) {
          if (floorArray[0].down === undefined && floorArray[0].up === true) {
            timeoutID2 = setTimeout(function() {
              currentFloor--;
              console.log(currentFloor);
              moveElevatorDown();
            }, 1000);
          } else {
            openCloseElevator(true);
          }
          return;
        }

        timeoutID2 = setTimeout(function() {
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