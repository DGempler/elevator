(function() {

  angular.module('elevator', [])

    .controller('elevatorController', elevatorController);

    function elevatorController() {
      var vm = this;

      vm.floors = ['Ground', 2, 3, 4, 5, 6, 7, 8, 9];







    }

})();