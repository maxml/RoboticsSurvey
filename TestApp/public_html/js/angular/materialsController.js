
controllerModule.controller('MaterialCtrl', ['$scope', '$location', '$timeout', '$route',
    function () {
    }]);

controllerModule.controller('ImagesCtrl', ['$scope',
    function ($scope) {

        $scope.test = "images";
        var init = function () {
            var Images = Parse.Object.extend("Images");
            var query = new Parse.Query(Images);

            query.lessThanOrEqualTo("point", Parse.User.current().get("point"));
            query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {

                        var object = [];
                        object.src = results[i].get('src');

                        $scope.photos.push(object);
                    }

                    $scope.$apply();
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };
        init();

        $scope.photos = [];

        // initial image index
        $scope._Index = 0;

        // if a current image is the same as requested image
        $scope.isActive = function (index) {
            return $scope._Index === index;
        };

        // show prev image
        $scope.showPrev = function () {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
        };

        // show next image
        $scope.showNext = function () {
            $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
        };

        // show a certain image
        $scope.showPhoto = function (index) {
            $scope._Index = index;
        };
    }]);

controllerModule.controller('VideosCtrl', ['$scope', '$location', '$timeout', '$route',
    function ($scope, $location, $timeout, $route) {

        $scope.test = "videos";
        $scope.videos = [];

        var init = function () {
            var Videos = Parse.Object.extend("Videos");
            var query = new Parse.Query(Videos);

            query.lessThanOrEqualTo("point", Parse.User.current().get("point"));
            query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {

                        var object = [];
                        object.src = results[i].get('src');
                        object.name = results[i].get('name');
                        object.duration = results[i].get('duration');

                        $scope.videos.push(object);
                    }

                    $scope.$apply();
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };
        init();
    }]);

controllerModule.controller('ArticlesCtrl', ['$scope', '$location', '$timeout', '$route',
    function ($scope, $location, $timeout, $route) {

        $scope.test = "articles";
        $scope.articles = [];

        var init = function () {
            var Articles = Parse.Object.extend("Article");
            var query = new Parse.Query(Articles);

            query.lessThanOrEqualTo("point", Parse.User.current().get("point"));
            query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {

                        var object = [];
                        object.title = results[i].get('title');
                        object.src = results[i].get('src');
                        object.text = results[i].get('text');
                        object.demo = results[i].get('demo');

                        $scope.articles.push(object);
                    }

                    $scope.$apply();
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };
        init();
    }]);
