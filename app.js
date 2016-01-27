(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController)

    .filter('floorFilter', floorFilter);

    function elevatorController() {
      var vm = this;

      vm.floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];







    }

    function floorFilter() {
      return function(floor) {
        if (floor === 0) {
          console.log("floor is 0");
          return "Ground";
        } else {
          return floor;
        }
      }
    }

})();