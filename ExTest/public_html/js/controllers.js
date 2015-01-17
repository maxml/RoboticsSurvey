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
        .controller('ManagerSurveyListCtrl', function ($scope, $timeout, $route, $location, $rootScope) {

            $scope.surveyList = [];
            $scope.reverse = false;
            $scope.selectedSurveyText = '';

            $scope.getSurveyTextById = function (surveyId) {
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
                        //alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {

                            var object = [];
                            object.id = results[i].id;
                            object.name = results[i].get('name');
                            object.score = results[i].get('points');
                            object.text = results[i].get('desc');
                            object.questions = results[i].get('questions');

                            $scope.surveyList.push(object);
                        }

                        $scope.$apply();
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            };
            $scope.onClickSurvey = function (surveyId, answerNumber) {
                $rootScope.surveyId = surveyId;
                $rootScope.answerNumber = answerNumber;

                $scope.getSurveyTextById(surveyId);
            };

            $scope.startTest = function () {
                if ($rootScope.surveyId === undefined || $rootScope.surveyId === '') {
                    alert('Choose test, please!');
                    return;
                }

                $location.path("/questions/" + 0);
                $route.reload();
            };

            $scope.getSurveyList();
            $scope.getSurveyTextById(-1);

        });

angular.module('surveyApp')
        .controller('PassingSurveyListCtrl', function ($scope, $routeParams, $location) {

            $scope.currentNum = $routeParams.num;
            $scope.survey = [];
            $scope.answers = [];
            $scope.options = [];

            $scope.nextPage = function () {
//                var nxtQnum = (srvapp.currentNum * 1) + 1;
                $location.path("/questions/" + ($routeParams.num * 1 + 1));
            };
            $scope.prevPage = function () {
//                var prevQnum = (srvapp.currentNum * 1) - 1;
                $location.path("/questions/" + ($routeParams.num * 1 + 1));
            };

            $scope.initSurvey = function () {

                var surveyId = $rootScope.surveyId;
                var answerNumber = $rootScope.answerNumber;

                var Question = Parse.Object.extend("Question");
                var query = new Parse.Query(Question);

                query.equalTo("surveyId", surveyId);
                query.find({
                    success: function (results) {
                        alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        var answersBuff = [];

                        for (var i = 0; i < results.length; i++) {

                            var answer = [];
                            answer.id = results[i].id;
                            answer.type = results[i].get('type');
                            answer.text = results[i].get('text');
                            answer.options = results[i].get('options');

                            answersBuff.push(answer);
                        }

                        $scope.answers = randomMassAnswers(answersBuff, answerNumber);
                        $scope.options = currOptions();

                        $scope.$apply();
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
                $scope.initSurvey();

                currOptions = function () {
                    return getOptions($scope.answers[$scope.currentNum]);
                };

                function getOptions(options) {
                    var res = [];
                    res = JSON.parse(options);
                    return res;
                }

                randomMassAnswers = function (answers, last) {
                    if (answers.length === 0) {
                        return;
                    } else if (answers.length === 1) {
                        return this[0];
                    } else {
                        var res = [];
                        var capacity = 0;
                        var num = 0;
                        do {
                            num = Math.floor(Math.random() * answers.length);
                            res.push(answers[num]);
                            capacity++;
                        } while (capacity === last);
                        return res;
                    }
                };

                $scope.currAnswer = $scope.answers[$scope.currentNum];

            };
        });

