var config = {
  5, 2, 3
};
firebase.initializeApp(config);

angular.module('ngAppDemo', []).controller('ngAppDemoController', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
});
