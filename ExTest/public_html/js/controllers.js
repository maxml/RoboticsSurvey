'use strict';
angular.module('surveyApp')
        .controller('MainCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });

//angular.module('surveyApp').factory('localStorage', function () {
//
//});
angular.module('surveyApp')
        .controller('ManagerSurveyListCtrl', function ($scope, $timeout, $route, $location) {

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

                        localStorage.surveyId = "-1";
                        $scope.$apply();
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            };
            $scope.onClickSurvey = function (surveyId, answerNumber) {
                localStorage.surveyId = surveyId;
                localStorage.answerNumber = answerNumber;

                $scope.getSurveyTextById(surveyId);
            };

            $scope.startTest = function () {
                if (localStorage.surveyId === undefined || localStorage.surveyId === '' || localStorage.surveyId === "-1") {
                    alert('Choose test, please!');
                    return;
                }

                localStorage.setItem("answers", '');

                $location.path("/questions/" + 0);
                $route.reload();
            };

            $scope.getSurveyList();
            $scope.getSurveyTextById(-1);

        });

angular.module('surveyApp')
        .controller('PassingSurveyListCtrl', function ($scope, $timeout, $routeParams, $location) {

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
                $location.path("/questions/" + ($routeParams.num * 1 - 1));
            };

//            $scope.$on('$viewContentLoaded', function () {
            // do something

//            });

            var currOptions = function () {
                if ($scope.answers.length === 0) {
                    return  [];
                }
                return getOptions($scope.answers[$scope.currentNum].options);
            };

            function getOptions(options) {
                if (options === undefined) {
                    return [];
                }

                var res = [];
                res = JSON.parse(options);
                return res;
            }

            var randomMassAnswers = function (answers, last) {
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
                    } while (capacity < last);
                    return res;
                }
            };

            var initSurvey = function () {

                var surveyId = localStorage.surveyId;
                var answerNumber = localStorage.answerNumber;

                var Question = Parse.Object.extend("Question");
                var query = new Parse.Query(Question);

                query.equalTo("surveyId", surveyId);
                query.find({
                    success: function (results) {

                        if ($scope.answers === undefined || $scope.answers.length === 0 || $scope.answers === "") {
                            if (localStorage.getItem("answers") !== "undefined" && localStorage.getItem("answers") !== null
                                    && localStorage.getItem("answers").length !== 0) {

                                $scope.answers = JSON.parse(localStorage.getItem("answers"));
                                $scope.options = currOptions();
                                $scope.currAnswer = $scope.answers[$scope.currentNum];

                                $scope.$apply();
                                return;
                            }
                        }
                        // 
                        // alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        var answersBuff = [];

                        for (var i = 0; i < results.length; i++) {

                            var answer = new Answer(results[i].id, results[i].get('type'),
                                    results[i].get('text'), results[i].get('options'));

                            answersBuff.push(answer);
                        }

                        $scope.answers = randomMassAnswers(answersBuff, answerNumber);
                        $scope.options = currOptions();
                        $scope.currAnswer = $scope.answers[$scope.currentNum];

                        localStorage.setItem("answers", JSON.stringify($scope.answers));
                        alert(localStorage.getItem("answers"));

                        $scope.$apply();

                        if (results.length !== 0)
                            localStorage.isStarted = true;
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            };

            initSurvey();

            function Answer(id, type, text, options) {

                this.id = id;
                this.type = type;
                this.text = text;
                this.options = options;

                this.toJson = function () {

                    var res = "{" + this.manualJsonObject();
                    res += "}";

                    console.log(JSON.stringify(this));
//                    alert(res);
                    return res;
                };

                this.manualJsonObject = function () {
                    return "\"id\": \"" + this.id + "\", \"type\":\"" + this.type + "\", \"text\": \""
                            + this.text + "\", \"options\": \"" +
                            this.options.substring(10, this.options.length - 1) + "\"";
                };

                this.arrayToJson = function (array) {
                    var res = '[';
                    for (var i = 0; i < array.length; i++) {
                        res += array[i].toJson();
                        if (i !== array.length - 1) {
                            res += ',';
                        }
                    }
                    res += ']';

                    console.log(res);

                    return res;
                };

                this.fromJson = function (string) {
                    return JSON.parse(string);
                };

            }

            var test = function () {
                var answer = new Answer("sdkjfng", "input", "text", "{\"option\": [1, 2 ,3]}");
                var answer2 = new Answer("skdb", "type", "text2", "{\"option\": [4, 5 ,6]}");
                var answer3 = new Answer("df", "dskj", "textarea", "{\"option\": [7, 8 ,9]}");

                var answers = [answer, answer2, answer3];

                var buff = answer.arrayToJson(answers);
                var buff2 = JSON.stringify(answers);
                answer.fromJson(buff);
                console.log(buff2);
                console.log(answer.fromJson(buff2));

            };
//            test();
        });

