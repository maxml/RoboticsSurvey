'use strict';

angular.module('surveyApp')
        .provider('surveyProvier', function () {

            // Private variables
            // var salutation = 'Hello';

            // Private constructor
            function SurveyBackend() {

                this.getSurveyById = function (surveyId) {
                    return this.getSurveyList()[surveyId];
                };
                this.getSurveyList = function () {

                    var Survey = Parse.Object.extend("Survey");
                    var query = new Parse.Query(Survey);
                    query.lessThanOrEqualTo("points", 11);
                    query.find({
                        success: function (results) {
                            alert("Successfully retrieved " + results.length + " scores.");
                            // Do something with the returned Parse.Object values
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                alert(object.id + ' - ' + object.get('name'));
                            }
                            return results;
                        },
                        error: function (error) {
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
//                    return [{
//                            no: 1,
//                            title: "suerver1",
//                            isMultipleAnswer: false,
//                            questions: []
//                        },
//                        {
//                            no: 2,
//                            title: "question 3-2",
//                            isMultipleAnswer: true,
//                            isDisplayImage: false,
//                            answers: [{
//                                    no: 1,
//                                    text: "answer3-2-1"
//                                }, {
//                                    no: 2,
//                                    text: "answer3-2-2"
//                                }]
//                        }];
                };
            }

            // Public API for configuration
            // this.setSalutation = function (s) {
            //   salutation = s;
            // };

            // Method for instantiating
            this.$get = function () {
                return new SurveyBackend();
            };
        });
