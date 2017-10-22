var config = {
  apiKey: "AIzaSyBdC5IFAhQx7m8LDPg8NZln7rPU4QwyQRQ",
  authDomain: "open-pool.firebaseapp.com",
  databaseURL: "https://open-pool.firebaseio.com",
  projectId: "open-pool",
  storageBucket: "open-pool.appspot.com",
  messagingSenderId: "569437181618"
};
firebase.initializeApp(config);
var app = angular.module("openPool", ["firebase"]);


// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

var provider = new firebase.auth.GoogleAuthProvider();


// a factory to create a re-usable profile object
// we pass in a username and get back their synchronized data
app.factory("Pool", ["$firebaseObject",
  function($firebaseObject) {
    return function() {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("pools").push();
      //var profileRef = ref.child(username);

      // return it as a synchronized object
      return $firebaseObject(ref);
    }
  }
]);

// factory for reading high level lists, like "pools"
app.factory("ObjectsList", ["$firebaseArray",
  function($firebaseArray) {
    return function(database_name) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref(database_name);

      // return it as a synchronized object
      return $firebaseArray(ref);
    }
  }
]);
// object factory for syncted user data 
app.factory("User", ["$firebaseObject",
  function($firebaseObject) {
    return function(username) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("users");
      var profileRef = ref.child(username);

      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }
  }
]);


app.controller('myCtrl', function($scope, Pool, User, ObjectsList) {
    $scope.userid = "no user";
    //login
    $scope.login = function() {
      firebase.auth().signInWithRedirect(provider);
      $scope.userid = "loading account, please wait.";
    };
    //logout
    $scope.logout = function() {
      firebase.auth().signOut().then(function() {
        $scope.userid = "log out";
        $scope.$apply();
        location.reload();
      }, function(error) {
        console.log(error);
      });
    };

    //login callback
    firebase.auth().getRedirectResult().then(function(result) {
      console.log("got result")
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        var email = result.user.email;
        console.log("got token", email, token)
        //extract email prefix to use as unique ID TODO: don't do this
        $scope.userid = email.substring(0, email.indexOf("@"));
        //create synced user for submitting user info
        $scope.user = User($scope.userid);
        if ($scope.token === undefined){
          $scope.user.userid= $scope.userid;

          //fill up with data in admin-side format
          $scope.user.token = token;
          $scope.user.usd_balance = 50;
          $scope.user.screen_name = result.user.displayName;
          $scope.user.picture = result.user.photoURL;
          $scope.user.email_address = result.user.email;
          $scope.user.$save().then(function(){
            console.log("Your user stuff:");
            }).catch(function(error){alert('Error!');})
          console.log($scope.user);
          $scope.showUserInfo();
          $scope.$apply();
        } else {
          console.log("Account already exists");
        }
      }
    }).catch(function(error) {
      console.log(error);
    });

    $scope.newpool = Pool();
    //save user's new pool
    $scope.saveNewPool = function() {
      if ($scope.user === undefined){
        alert("please sign in first");
      } else {
        $scope.newpool.number_investors = 1;
        $scope.newpool.creator = $scope.user.userid;
        $scope.newpool.investors = new Object();
        $scope.newpool.$save().then(function() {
          console.log("pool saved!");
        }).catch(function(error) {
          alert('Error!');
        });
        $scope.newpool = Pool();
      }
    };
    
    //read existing pools into pools variable
    $scope.pools = ObjectsList("pools");

    $scope.showPoolForm = function() {
      if ($scope.user === undefined){
        alert("please sign in first")
      } else {
        document.getElementById("poolForm").classList.remove('hidden');
      }
    }

    $scope.showUserInfo = function() {
     document.getElementById("userInfo").classList.remove('hidden');
    }

    $scope.hidePoolForm = function() {
     document.getElementById("poolForm").classList.add('hidden');
    }

});


