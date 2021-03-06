myApp.controller('mainController', function($scope, $window, auth, postFactory,$uibModal, $document){
  var top = 0;
  var duration = 1000;
  $scope.show_registration = false;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.posts = [];

  $scope.models = {
      selected: null,
      lists: {"Prospects": [], "Applied": [], "Pending":[], "Completed": []}
  };

  $scope.scrollTop = function(){
    console.log('test');
    $document.scrollTop(top, duration)
  }




  $scope.get = function() {

    postFactory.allPosts(function(data){
    posts = data;
    for (i in posts) {
      switch(posts[i].status){
        case "Prospects":
          $scope.models.lists.Prospects[posts[i].index] = posts[i];
          break;
        case "Applied":
          $scope.models.lists.Applied[posts[i].index] = posts[i];
          break;
        case "Pending":
          $scope.models.lists.Pending[posts[i].index] = posts[i];
          break;
        case "Completed":
          $scope.models.lists.Completed[posts[i].index] = posts[i];
          break;
      }
    };
    });
  }

  $scope.get();

  $scope.newCardLocation = function(index, item, listName){
    item.status = listName;
    switch(item.status){
        case "Prospects":
          item.index = $scope.models.lists.Prospects.indexOf(item);
          $scope.models.lists.Prospects[item.index].index = item.index;
          break;
        case "Applied":
          item.index = $scope.models.lists.Applied.indexOf(item);
          $scope.models.lists.Applied[item.index].index = item.index;
          break;
        case "Pending":
          item.index = $scope.models.lists.Pending.indexOf(item);
          $scope.models.lists.Pending[item.index].index = item.index;
          break;
        case "Completed":
          item.index = $scope.models.lists.Completed.indexOf(item);
          $scope.models.lists.Completed[item.index].index = item.index;
          break;
    }

    postFactory.editPost(item, function(){

      for (var key in $scope.models.lists){
        for (i in $scope.models.lists[key]){
          if ($scope.models.lists[key][i] != null ){
            var updating_object = $scope.models.lists[key][i];
            updating_object.index = $scope.models.lists[key].indexOf(updating_object);
            postFactory.editPost(updating_object,function(){
            })
          }
        }
      }
    })
  }

  $scope.delete = function(item){
    postFactory.delete(item,function(){
      for (var key in $scope.models.lists){
        for (i in $scope.models.lists[key]){
          if ($scope.models.lists[key][i] != null ){
            var updating_object = $scope.models.lists[key][i];
            updating_object.index = $scope.models.lists[key].indexOf(updating_object);
            postFactory.editPost(updating_object,function(){
            })
          }
        }
      }
    })
  }

  $scope.edit = function(size,item){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'editForm.html',
      controller: 'ModalInstanceCtrl',
      size:size,
      resolve: {
        options: function () {
          return null;
        },
        lists : function() {
          return null;
        },
        item: function(){
          return item;
        },
      }
    })
  }

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'postForm.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
      options: function () {
        return ["Prospects","Applied","Pending","Completed"];
        },
      lists : function() {
        return $scope.models.lists;
        },
      item: function(){
        return null
        },
      }
      });

      modalInstance.result.then(function(data) {
        if (data.status == "Completed") {
          $scope.models.lists.Completed.push(data);
        }
        if (data.status == "Prospects") {
          $scope.models.lists.Prospects.push(data);
        }
        if (data.status == "Applied") {
          $scope.models.lists.Applied.push(data);
        }
        if (data.status == "Pending") {
          $scope.models.lists.Pending.push(data);
        }
        });
    };

    $scope.openMe = function (size, job) {

      var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'postForm.html',
      controller: 'jobModalInstanceCtrl',
      size: size,
      resolve: {
      options: function () {
        return ["Prospects","Applied","Pending","Completed"];
        },
      job: function(){
        return job;
      },
      lists: function(){
        return $scope.models.lists;
      }
      }
      });

      modalInstance.result.then(function(data) {
        if (data.status == "Completed") {
          $scope.models.lists.Completed.push(data);
        }
        if (data.status == "Prospects") {
          $scope.models.lists.Prospects.push(data);
        }
        if (data.status == "Applied") {
          $scope.models.lists.Applied.push(data);
        }
        if (data.status == "Pending") {
          $scope.models.lists.Pending.push(data);
        }
        });
    };

});





myApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance,options,postFactory,lists,item) {

  if (item){
    $scope.newPost = item;
  }
  if (options){
    $scope.options = options;
  }

  $scope.updatePost = function() {
    postFactory.editPost($scope.newPost, function(){
      $uibModalInstance.close('update');
    })
  };


  $scope.submitPost = function() {
    postFactory.addPost($scope.newPost,lists,function(data){
      $scope.newPost = {};
      $uibModalInstance.close(data);
    });
  }

  $scope.cancel = function () {
    $uibModalInstance.close('cancel');
  };

});
