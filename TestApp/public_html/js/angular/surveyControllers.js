'use strict';

angular.module('Robotics')
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
                query.lessThanOrEqualTo("points", Parse.User.current().get("point"));
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

angular.module('Robotics')
        .controller('PassingSurveyListCtrl', function ($scope, $timeout, $routeParams, $location) {

            $scope.currentNum = $routeParams.num;

            $scope.surveyStorage = [];
            $scope.answerStorage = [];
            $scope.options = [];
            $scope.marks = [];

            $scope.currAsk = '';
            $scope.selection = [];

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

                        localStorage.setItem("res", null);
                        localStorage.setItem("mark", null);
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

                if (localStorage.getItem("res") !== null && localStorage.getItem("res") !== "null") {
                    $scope.asks = JSON.parse(localStorage.getItem("res"));
                    $scope.userMarks = JSON.parse(localStorage.getItem("mark"));
                } else {
                    $scope.asks = [];
                    $scope.userMarks = [];
                }

                $timeout(function () {
                    $scope.$apply();
                    console.log('update with timeout fired')
                }, 1000);

                if ($scope.currAsk === '') {
//                    $scope.asks[$routeParams.num] = $scope.selection;

                    var mark = 0;
                    for (var i = 0; i < $scope.selection.length; i++) {

                        if ($scope.asks.length > $routeParams.num) {

                            if ($scope.selection[i] === true) {
                                $scope.asks.insert($routeParams.num, $scope.options[i]);
                                mark += $scope.marks[i] * 1;
                            }
                        } else {

                            if ($scope.selection[i] === true) {
                                $scope.asks.push($routeParams.num, $scope.options[i]);
                                mark += $scope.marks[i] * 1;
                            }
                        }

                    }

                    if ($scope.asks > $routeParams.num) {
                        $scope.userMarks.insert($routeParams.num, mark);
                    } else {
                        $scope.userMarks.push($routeParams.num, mark);
                    }

                } else {

//                    if ($scope.asks < $routeParams.num) {
                    $scope.asks[$routeParams.num * 1] = $scope.currAsk;
                    $scope.userMarks[$routeParams.num * 1] = getValue($scope.currAsk);
//                    } else {
//                        $scope.asks.push($routeParams.num, $scope.currAsk);
//                        $scope.userMarks.push($routeParams.num, getValue($scope.currAsk));
//                    }
                }

                var res = JSON.stringify($scope.asks);
                var markRes = JSON.stringify($scope.userMarks);

                localStorage.setItem("res", res);
                localStorage.setItem("mark", markRes);

                $scope.currAsk = '';
                $scope.selection = [];


            }

            function getValue(value) {
                var mark = "";
                if ($scope.options === undefined) {
                    return "1";
                }

                for (var i = 0; i < $scope.options.length; i++) {
                    if (value == $scope.options[i]) {
                        mark = $scope.marks[i];
                    }
                }

                return mark;
            }

            $scope.prevPage = function () {
                $location.path("/questions/" + ($routeParams.num * 1 - 1));
            };

            $scope.finish = function () {
                getResult();

                var res = JSON.stringify($scope.asks);
                var markRes = JSON.stringify($scope.userMarks);

                localStorage.setItem("res", res);
                localStorage.setItem("mark", markRes);

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
                        if (res.indexOf(answers[num]) === -1) {
                            res.push(answers[num]);
                            capacity++;
                        }
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

angular.module('Robotics')
        .controller('ResultSurveyCtrl', function ($scope, $timeout, $route, $location) {

            $scope.summ = '';
            $scope.asks = "";
//            $scope.asks = [];
            $scope.userMarks = [];

            $scope.back = function () {
                $location.path("/tests");
                $route.reload();
            };

            function logToDatabase() {
                var user = Parse.User.current();

                var Result = Parse.Object.extend("Result");
                var result = new Result();

                result.set("surveyId", localStorage.getItem("surveyId"));
                result.set("userId", user.id);
                result.set("result", localStorage.getItem("res"));

                result.save();
            }
            ;

            var userScores = function () {
                var user = Parse.User.current();
                user.set("point", user.get('point') + summ());

                user.save();
            };

            function summ() {
                var summ = 0;
                for (var i = 0; i < $scope.userMarks.length; i++) {
                    summ += $scope.userMarks[i] * 1;
                }
                return summ;
            }

            var init = function () {
                if (localStorage.getItem("mark") !== null && localStorage.getItem("res") !== undefined) {
//                    $scope.asks = JSON.parse(localStorage.getItem("res"));
                    $scope.userMarks = JSON.parse(localStorage.getItem("mark"));
                } else {
//                    $scope.asks = [];
                    $scope.userMarks = [];
                }

                $scope.summ = summ();
                $scope.asks = localStorage.getItem("res");

                logToDatabase();
                userScores();
            };
            init();


        });
