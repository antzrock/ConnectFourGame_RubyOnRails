/**
 * Created by Antonio Amiel L. Yap on 3/25/2016.
 */

Connect4Controllers.controller('StartCtrl', ['$scope', '$location', '$http', 'UiHelper',
    function ($scope, $location, $http, UiHelper) {

        $scope.player1 = UiHelper.newField('', UiHelper.NOT_EMPTY);
        $scope.player2 = UiHelper.newField('', UiHelper.NOT_EMPTY);

        $scope.start = function() {

            if(UiHelper.checkErrors([$scope.player1, $scope.player2])) {
                $location.path(UiHelper.buildRouteWithParams('game', [
                    $scope.player1.value,
                    $scope.player2.value,
                    0,
                    0
                ]));
            }
        }
    }]
);