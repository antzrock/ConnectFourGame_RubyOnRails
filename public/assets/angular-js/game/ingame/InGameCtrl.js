/**
 * Created by Antonio Amiel L. Yap on 3/25/2016.
 */

Connect4Controllers.controller('InGameCtrl', ['$scope', '$routeParams', '$interval', '$window', '$location', 'Connect4GameManager', 'UiHelper',
    function ($scope, $routeParams, $interval, $window, $location, Connect4GameManager, UiHelper) {

        //Initialize Game manager
        Connect4GameManager.init($routeParams.player1, $routeParams.player2, $routeParams.isPlayer1Ai, $routeParams.isPlayer2Ai);

        var isAnimating = false;
        var currentToken;


        var ratio = Connect4GameManager.computeRatio($window.innerWidth);

        var w = Connect4GameManager.gridX * ratio * 60;
        var h = Connect4GameManager.gridY * ratio * 60;

        // initialize canvas
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        canvas.width = w;
        canvas.height = h;
        context.globalAlpha = 1.0;

        // initialize rendering loop (100 fps)
        $interval(animate, 50);

        var gapInPercent = 15;
        var diam = canvas.width / Connect4GameManager.gridX;
        var gap = diam/2 * (gapInPercent / 100);
        var radius = diam / 2 - gap;
        var cursorPosition, showMouse;

        var drawContext = {
            context : context,
            canvas : canvas,
            grid : Connect4GameManager.grid,
            gridX : Connect4GameManager.gridX,
            gridY : Connect4GameManager.gridY,
            width: w,
            height: h
        };

        //
        // INIT CALLBACK
        //
        canvas.addEventListener(Connect4GameManager.CLICK_EVENT_TYPE, onClick, false);
        canvas.addEventListener(Connect4GameManager.MOUSE_MOVE_EVENT, onMouseMove, false);
        canvas.addEventListener('mouseenter', function() { showMouse = true; }, false);
        canvas.addEventListener('mouseleave', function() { showMouse = false; }, false);

        //
        // INIT SCOPE
        //

        var player1Name;
        var player2Name;

        if ($routeParams.isPlayer1Ai === Connect4GameManager.IS_AI)
        {
            player1Name = "Computer";
        }
        else
        {
            player1Name = $routeParams.player1;
        }

        if ($routeParams.isPlayer2Ai === Connect4GameManager.IS_AI)
        {
            player2Name = "Computer";
        }
        else
        {
            player2Name = $routeParams.player2;
        }

        $scope.player1 = { score: 0, pseudo: player1Name };
        $scope.player2 = { score: 0, pseudo: player2Name };
        $scope.progessBarWidth = 'width: ' + w + 'px';
        $scope.progess = Connect4GameManager.getProgression();
        $scope.progessStyle = 'width: ' + $scope.progess + '%;';
        $scope.gameStatus = Connect4GameManager.getGameStatus();

        //
        // ON CLICK CALLBACK
        //
        function onClick(evt) {

            if(!isAnimating) {
                startAnimation(evt.clientX);
            }
        }

        function onMouseMove(evt) {

            if(cursorPosition == undefined) {
                cursorPosition = [];
            }

            var rect = canvas.getBoundingClientRect();

            cursorPosition[0] = evt.clientX - rect.left;
            cursorPosition[1] = evt.clientY - rect.top;
        }

        function startAnimation(clickX) {

            var rect = canvas.getBoundingClientRect();
            var x = Math.floor((clickX - rect.left) / (ratio * 60));
            var y = 0; // in all cases, animation starts by the top of the grid

            if(Connect4GameManager.grid[x][y] == Connect4GameManager.NONE) {
                currentToken = { x : x, y : y };
                isAnimating = true;
            }
        }

        function startAnimationForAutoMove() {
            var x = Connect4GameManager.bestMoveX;
            var y = 0; // in all cases, animation starts by the top of the grid

            if(Connect4GameManager.grid[x][y] == Connect4GameManager.NONE) {
                currentToken = { x : x, y : y };
                isAnimating = true;
            }
        }

        //
        // RENDERING LOOP
        //
        function animate() {

            context.clearRect(0, 0, canvas.width, canvas.height);

            // first, draw the grid
            context.beginPath();
            context.fillStyle = "#0000ff";
            context.fillRect(0, 0, drawContext.width, drawContext.height);

            // draw tokens
            drawTokens(drawContext, gap, radius, diam);

            if(isAnimating) {
                renderAnimation();
            } else if(!isAnimating && showMouse) {
                drawCursor(drawContext, cursorPosition);
            }
        }

        function renderAnimation() {

            if((currentToken.y - 1) >= 0) {
                Connect4GameManager.grid[currentToken.x][currentToken.y - 1] = Connect4GameManager.NONE;
            }

            Connect4GameManager.grid[currentToken.x][currentToken.y] = Connect4GameManager.currentPlayer;

            if((currentToken.y + 1) < Connect4GameManager.gridY && Connect4GameManager.grid[currentToken.x][currentToken.y + 1] == Connect4GameManager.NONE) {
                currentToken.y++;
            } else {
                isAnimating = false;
                progessGame();
            }
        }

        function drawTokens(drawContext, gap, radius, diam) {

            for(var x = 0; x < drawContext.gridX; x++) {
                for(var y = 0; y < drawContext.gridY; y++) {

                    var type = drawContext.grid[x][y];
                    var xPos = gap + radius + (x * diam);
                    var yPos = gap + radius + (y * diam);

                    drawToken(drawContext, Connect4GameManager.getColor(type), xPos, yPos);
                }
            }
        }

        function drawToken(drawContext, color, x, y) {

            drawContext.context.beginPath();
            drawContext.context.fillStyle = color;
            drawContext.context.arc(x, y, radius, 0, (2 * Math.PI), false);
            drawContext.context.fill();
        }

        function drawCursor(drawContext, cursorPosition) {

            if(cursorPosition != undefined) {
                drawContext.context.beginPath();
                drawContext.context.fillStyle = Connect4GameManager.getColor(Connect4GameManager.currentPlayer);
                drawContext.context.arc(cursorPosition[0], cursorPosition[1], radius, 0, (2 * Math.PI), false);
                drawContext.context.fill();
            }
        }

        //
        // PROGRESS GAME
        //
        function progessGame() {

            if(Connect4GameManager.isFull() || Connect4GameManager.checkWinner()) {

                Connect4GameManager.reset();
                $scope.progess = Connect4GameManager.getProgression();
                $scope.progessStyle = 'width: ' + $scope.progess + '%;';
                $scope.player1.score = Connect4GameManager.player[1].score;
                $scope.player2.score = Connect4GameManager.player[2].score;

                if(Connect4GameManager.getProgression() >= 100) {

                    $location.path(
                        UiHelper.buildRouteWithParams('end')
                    );
                }
            }

            Connect4GameManager.switchCurrentPlayer();
            $scope.gameStatus = Connect4GameManager.getGameStatus();

            if (Connect4GameManager.player[Connect4GameManager.currentPlayer].is_ai === Connect4GameManager.IS_AI)
            {
                //Get best possible move using AI....
                Connect4GameManager.GetBestPossibleMove();

                //Set best possible move to board or grid...
                startAnimationForAutoMove();
            }
        }
    }]
);