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

            $scope.surveyStorage = [];
            $scope.answerStorage = [];
            $scope.options = [];
            $scope.marks = [];

            $scope.currAsk = '';
            $scope.selection = {ids: {}};

            $scope.asks = [];
            $scope.userMarks = [];

            $scope.isPrevButtonHide = ($scope.currentNum === '0');
            $scope.isNextButtonHide = ((localStorage.answerNumber - 1).toString() === $scope.currentNum);

            var initSurvey = function () {

                var surveyId = localStorage.surveyId;
                var answerNumber = localStorage.answerNumber;

                var Question = Parse.Object.extend("Question");
                var query = new Parse.Query(Question);

                query.equalTo("surveyId", surveyId);
                query.find({
                    success: function (results) {

                        if ($scope.answerStorage === undefined || $scope.answerStorage.length === 0 || $scope.answerStorage === "") {
                            if (localStorage.getItem("answers") !== "undefined" && localStorage.getItem("answers") !== null
                                    && localStorage.getItem("answers").length !== 0) {

                                $scope.answerStorage = JSON.parse(localStorage.getItem("answers"));
                                $scope.options = currOptions();
                                $scope.marks = currMarks();

                                $scope.currAnswer = $scope.answerStorage[$scope.currentNum];

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
                                    results[i].get('text'), results[i].get('options'), results[i].get('marks'));

                            answersBuff.push(answer);
                        }

                        $scope.answerStorage = randomMassAnswers(answersBuff, answerNumber);
                        $scope.options = currOptions();
                        $scope.marks = currMarks();

                        $scope.currAnswer = $scope.answerStorage[$scope.currentNum];

                        localStorage.setItem("answers", JSON.stringify($scope.answerStorage));
//                        alert(localStorage.getItem("answers"));

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

            $scope.nextPage = function () {
                getResult();
                $location.path("/questions/" + ($routeParams.num * 1 + 1));
            };

            function getResult() {
                alert($scope.currAsk);
            }

            $scope.prevPage = function () {
                $location.path("/questions/" + ($routeParams.num * 1 - 1));
            };

            $scope.finish = function () {
                getResult();
                $location.path("/result");
            };

            $scope.refuse = function () {
                $location.path("/tests/");
            };

            $scope.checked = function (value) {
                $scope.currAsk = value;
                alert($scope.currAsk + value);
            };

            var currOptions = function () {
                if ($scope.answerStorage.length === 0) {
                    return  [];
                }
                return $scope.answerStorage[$scope.currentNum].options;
            };

            var currMarks = function () {
                if ($scope.answerStorage.length === 0) {
                    return  [];
                }
                return $scope.answerStorage[$scope.currentNum].marks;
            }

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

            function Answer(id, type, text, options, marks) {

                this.id = id;
                this.type = type;
                this.text = text;
                this.options = options;
                this.marks = marks;

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

angular.module('surveyApp')
        .controller('ResultSurveyCtrl', function ($scope, $timeout, $routeParams, $location) {

            $scope.answers = [];

            $scope.back = function () {
                logToDatabase();
                $location.path("/tests");
                $route.reload();
            };

            var logToDatabase = function () {
                alert(123);
            };
        });
