var app = angular.module("openPool", ["firebase"]);

// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller("SampleCtrl", ["$scope", "Auth",
	function($scope, Auth) {
		$scope.signInWithPopup("google").then(function(result) {
  console.log("Signed in as:", result.user.uid);
}).catch(function(error) {
  console.error("Authentication failed:", error);
});
/*
// and use it in our controller
app.controller("SampleCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      // Create a new user
      Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
          $scope.message = "User created with uid: " + firebaseUser.uid;
        }).catch(function(error) {
          $scope.error = error;
        });
    };

    $scope.deleteUser = function() {
      $scope.message = null;
      $scope.error = null;

      // Delete the currently signed-in user
      Auth.$deleteUser().then(function() {
        $scope.message = "User deleted";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);
*/
