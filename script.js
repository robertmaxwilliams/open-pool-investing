var app = angular.module("openPool", ["firebase"]);





app.controller("SampleCtrl", function($scope, $firebaseArray) {
  var ref = firebase.database().ref().child("messages");
  // create a synchronized array
  // click on `index.html` above to see it used in the DOM!
  $scope.messages = $firebaseArray(ref);
});
