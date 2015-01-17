//(function () {
//    window.srvapp = {
//        currentNum: 0,
//        getJsonURL: function (file) {
//            var resp;
//            var xmlhttp;
//            xmlhttp = new XMLHttpRequest();
//            if (xmlhttp != null) {
//                xmlhttp.open("GET", file, false);
//                xmlhttp.send(null);
//                resp = xmlhttp.responseText;
//            }
//            return JSON.parse(resp);
//        },
//        inputTypeQtypeStore: {
//            "single": "radio",
//            "multiple": "checkbox",
//            "text": "textarea"
//        },
//        initPageEvents: function ($location) {
//            return {
//                nextPage: function () {
//                    var nxtQnum = (srvapp.currentNum * 1) + 1;
//                    $location.path("/questions/" + nxtQnum);
//                },
//                prevPage: function () {
//                    var prevQnum = (srvapp.currentNum * 1) - 1;
//                    $location.path("/questions/" + prevQnum);
//                }
//            };
//        }
//    }
//})();