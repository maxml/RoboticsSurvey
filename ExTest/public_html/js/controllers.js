'use strict';

angular.module('surveyApp')
        .controller('MainCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });

angular.module('surveyApp')
        .controller('ManagerSurveyListCtrl', function ($scope, $timeout) {

            $scope.surveyList = [];

//            $scope.showModal = function (currentSurvey) {
//                var isNew = false;
//                if (!!currentSurvey) {
//                    $scope.currentSurvey = currentSurvey;
//                } else {
//                    isNew = true;
//                    $scope.currentSurvey = {
//                        title: "new suerver",
//                        questions: [{
//                                title: "question",
//                                answers: [{
//                                        text: "answer 1"
//                                    }, {
//                                        text: "answer 2"
//                                    }]
//                            }]
//                    };
//
//                }
//                var modalInstance = $modal.open({
//                    templateUrl: 'views/manager/add-survey.html',
//                    controller: 'AddNewSurvey',
//                    backdrop: false,
//                    resolve: {
//                        currentSurvey: function () {
//                            return $scope.currentSurvey;
//                        },
//                        isNew: function () {
//                            return isNew;
//                        },
//                        surveyList: function () {
//                            return $scope.surveyList;
//                        }
//
//                    }
//
//                })
//            }


            $scope.selectedSurveyText = '';

//            $scope.gridOptions = {
//                data: $scope.surveyList,
//                columnDefs: [
//                    {
//                        field: 'points',
//                        displayName: 'Points'
//                    },
//                    {
//                        field: 'name',
//                        displayName: 'Title'
//                    }],
//                multiSelect: false,
//                selectedItems: $scope.selectedSurvey,
//                dblClickFn: $scope.showModal,
//                clickFn: $scope.showModal,
//                plugins: [ngGridClick]
//                        //rowTemplate: '<div ng-click="showModal(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
//            };

            $scope.getSurveyById = function (surveyId) {
                if ($scope.surveyList.length === 0) {
                    $scope.selectedSurveyText = "Default text";
                    return;
                }
                for (var i = 0; i < $scope.surveyList.length; i++)
                    if ($scope.surveyList[i].id === surveyId) {
                        $scope.selectedSurveyText = $scope.surveyList[i].text;
                        timeout();
                        return;
                    }
                $scope.selectedSurveyText = $scope.surveyList[0].text;
                timeout();
            };

            function timeout() {
                $timeout(function () {
                    $scope.$apply();
                    console.log('update with timeout fired')
                }, 1000);
            }

            $scope.getSurveyList = function () {
                Parse.initialize("EGBizx6dufMsT8d8ZnxmjP2qSEIsW2FzBwtdZNa7",
                        "9KVQaAV99yIHgZmgsmhp54LxqfWqkoxFFwIwuk4u");

                var Survey = Parse.Object.extend("Survey");
                var query = new Parse.Query(Survey);
                query.lessThanOrEqualTo("points", 21);
                query.find({
                    success: function (results) {
                        alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {

                            var object = [];
                            object.id = results[i].id;
                            object.name = results[i].get('name');
                            object.score = results[i].get('points');
                            object.text = results[i].get('desc');

                            $scope.surveyList.push(object);
//                            alert(object.id + ' - ' + object.get('name'));
                        }

//                        $scope.surveyList = results;

                        $scope.$apply();
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            };
            $scope.getSurveyList();
            $scope.getSurveyById(-1);
//$scope.$apply();
        });
