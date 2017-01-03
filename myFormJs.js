var adminUrl="http://localhost:1337";
angular.module('BlankApp', ['ngMaterial'])
    .controller('AppCtrl', function ($scope, $http) {
        $scope.myDate = new Date();
        $scope.user = {};
        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate());

        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate());
        $scope.items = [{}];

        $scope.onlyWeekendsPredicate = function (date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        };
        $scope.submitForm = function (user) {
            console.log(user);
            $http.post("http://localhost:3000/view1", user).success(function (data, status) {
                result = data;
            }).error(function () {
                console.log("err");
            });
        }
    })
    .controller('viewCtrl', function ($scope, $http, $timeout) {
        $scope.data = [];
        $http.post("http://localhost:1337/form/getLimited", $scope.pagination).success(function (data, status) {


            $scope.data = data.data.data;
            console.log($scope.data);

        }).error(function () {
            console.log("err");
        });

        $timeout(function () {
            $scope.totalItems = $scope.data.length;
            console.log($scope.totalItems);
        }, 1000);

        $scope.currentPage = 4;
        $scope.itemsPerPage = 5;
        $scope.maxSize = 5; //Number of pager buttons to show

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
        }
    });