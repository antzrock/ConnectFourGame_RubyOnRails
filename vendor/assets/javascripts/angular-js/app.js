/**
 * Created by Antonio Amiel L. Yap on 3/25/2016.
 */

var Connect4Controllers = angular.module('Connect4Controllers', []);

angular.module('Connect4Helpers', [])
    .service('UiHelper', function() {

        this.NOT_EMPTY = function() {
            return this.value != undefined && this.value != '';
        };

        this.newField = function newField(defaultValue, validateCallback) {
            return {
                hasError: false,
                value: defaultValue,
                validate: validateCallback
            };
        };

        this.checkErrors = function(fields) {

            var result = true;

            for(var i in fields) {

                fields[i].hasError = false;

                if(fields[i].validate != undefined && !fields[i].validate()) {
                    fields[i].hasError = true;
                    result = false;
                }
            }

            return result;
        };

        this.buildRouteWithParams = function(path, params) {
            var route = path + '/';
            for(var i in params) {
                route += params[i] + '/';
            }
            return route;
        };
    });

var connect4Game = angular.module('connect4Game', [
    'ngRoute',
    'Connect4Controllers',
    'Connect4Helpers',
    'Connect4GameManager'
]);

connect4Game.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/start', {
            templateUrl: 'assets/angular-js/game/start/start.html',
            controller: 'StartCtrl'
        }).
        when('/game/:player1/:player2/:isPlayer1Ai/:isPlayer2Ai', {
            templateUrl: 'assets/angular-js/game/ingame/in_game.html',
            controller: 'InGameCtrl'
        }).
        when('/end', {
            templateUrl: 'assets/angular-js/game/end/end.html',
            controller: 'EndCtrl'
        }).
        otherwise({
            redirectTo: '/start'
        });
    }]
);
