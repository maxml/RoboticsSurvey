/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var filters = {
        filterQtype: function () {
            return function (input, qType, inputType) {
                return (srvapp.inputTypeQtypeStore[qType] == inputType) ? input : undefined;
            }
        }
    };
    angular.module("srvFilters", []).filter(filters);
})();

