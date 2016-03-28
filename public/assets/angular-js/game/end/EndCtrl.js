/**
 * Created by Antonio Amiel L. Yap on 3/25/2016.
 */

Connect4Controllers.controller('EndCtrl', ['$scope', '$routeParams', '$location', 'Connect4GameManager', 'UiHelper',
    function ($scope, $routeParams, $location, Connect4GameManager, UiHelper) {
        // prevent direct access
        if(Connect4GameManager.getProgression() < 100) {
            $location.path(
                UiHelper.buildRouteWithParams('start')
            );
        }

        $scope.equality = !(Connect4GameManager.player[1].score - Connect4GameManager.player[2].score);

        $scope.winner = '';
        if(!$scope.equality) {
            if(Connect4GameManager.player[1].score > Connect4GameManager.player[2].score) {
                $scope.winner = Connect4GameManager.player[1].name;
            } else {
                $scope.winner = Connect4GameManager.player[2].name;
            }
        }

        $scope.player1 = {};
        $scope.player2 = {};

        $scope.player1.name = Connect4GameManager.player[1].name;
        $scope.player2.name = Connect4GameManager.player[2].name;

        $scope.player1.reflexionTime = new Date(computeAverageReflexionTime(Connect4GameManager.player[1].reflexion));
        $scope.player2.reflexionTime = new Date(computeAverageReflexionTime(Connect4GameManager.player[2].reflexion));

        $scope.restart = function() {
            $location.path(UiHelper.buildRouteWithParams('game', [
                Connect4GameManager.player[1].name,
                Connect4GameManager.player[2].name,
                Connect4GameManager.player[1].is_ai,
                Connect4GameManager.player[2].is_ai
            ]));
        }
    }]
);

function computeAverageReflexionTime(reflexionArray) {
    var avgTime = 0;

    for(var i = 0; i < reflexionArray.length; i++) {
        avgTime += reflexionArray[i];
    }

    return avgTime / reflexionArray.length;
}