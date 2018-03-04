function H5Gobang() {
    var chessBox = document.getElementById("chessBox");
    var restart = document.getElementById("restart");
    var retract = document.getElementById("retract");

    var boxHeight = 450,boxWidth = 450;//棋盘宽高
    var gridSize = 30; //棋格尺寸

    var historyPiece = []; //保存历史下棋位置记录
    var flag = 1; //标识：棋子颜色，1：黑棋，2：白棋
    var chessBoard = [];//棋盘数组
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }

    var board = null, boardCtx = null;//棋盘画布
    var chess = null, chessCtx = null;//棋子画布
    initBoard(gridSize);

    EventUtil.addListener(chess, "click", setPiece);
    EventUtil.addListener(restart, "click", fnRestart);
    EventUtil.addListener(retract, "click", fnRetract);

    function initBoard(gridSize) { //初始化棋盘
        board = document.createElement("canvas");
        board.id = "board";
        board.width = boxWidth;
        board.height = boxHeight;
        chessBox.appendChild(board);

        boardCtx = board.getContext("2d");
        boardCtx.strokeStyle = "#000"; //棋盘线颜色
        for (var i = 0; i < 15; i++) {  //通过循环画网格
            boardCtx.moveTo(15, 15 + i * gridSize);
            boardCtx.lineTo(board.width - 15, 15 + i * gridSize);
            boardCtx.stroke();
            boardCtx.moveTo(15 + i * gridSize, 15);
            boardCtx.lineTo(15 + i * gridSize, board.height - 15);
            boardCtx.stroke();
        }

        chess = document.createElement("canvas");
        chess.id = "chess";
        chess.width = boxWidth;
        chess.height = boxHeight;
        chess.zIndex = 100;
        chessBox.appendChild(chess);

        chessCtx = chess.getContext("2d");
    };

    /**
     * 画棋子
     * @param (x,y) 坐标
     * @param flag 1：黑棋；2：白棋
     */
    function drawPiece(x, y, flag, context) {
        context.beginPath();
        context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI); //画圆
        context.closePath();
        var gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 15, 15 + x * 30, 15 + y * 30, 0);
        if (flag === 1) {
            gradient.addColorStop(0, "#0a0a0a");
            gradient.addColorStop(1, "#636766");
        } else {
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
        }
        context.fillStyle = gradient;
        context.fill();
    }

    // 判断输赢
    function win(x, y) {
        //判定横向五个相连
        function rowWin(x, y) {
            var count = 1;
            for (var i = x + 1; i < 15; i++) {// 向右查找
                if (chessBoard[x][y] == chessBoard[i][y]) {
                    count++;
                } else {
                    break;
                }
            }
            for (var i = x - 1; i >= 0; i--) {// 向左查找
                if (chessBoard[x][y] == chessBoard[i][y]) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            } else {
                return false;
            }
        }

        //判定竖向五个相连
        function columnWin(x, y) {
            var count = 1;
            for (var i = y + 1; i < 15; i++) {
                if (chessBoard[x][y] == chessBoard[x][i]) { //向下查找
                    count++;
                } else {
                    break;
                }
            }
            for (var i = y - 1; i >= 0; i--) {// 向上查找
                if (chessBoard[x][y] == chessBoard[x][i]) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            } else {
                return false;
            }
        }

        //判定斜向右下五个相连
        function rightDownWin(x, y) {
            var count = 1;
            for (var i = x + 1, j = y + 1; i < 15 && j < 15; i++, j++) {// 向右下查找
                if (chessBoard[x][y] == chessBoard[i][j]) {
                    count++;
                } else {
                    break;
                }
            }
            for (var i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {// 向左上查找
                if (chessBoard[x][y] == chessBoard[i][j]) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                return true;
            } else {
                return false;
            }
        }

        //判定斜向左下五个相连
        function leftDownWin(x, y) {
            var count = 1;
            for (var i = x - 1, j = y + 1; i >= 0 && j < 15; i--, j++) {// 向右查找
                if (chessBoard[x][y] == chessBoard[i][j]) {
                    count++;
                } else {
                    break;
                }
            }
            for (var i = x + 1, j = y - 1; i < 15 && j >= 0; i++, j--) {// 向左查找
                if (chessBoard[x][y] == chessBoard[i][j]) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                return true;
            } else {
                return false;
            }
        }

        if (rowWin(x, y) || columnWin(x, y) || rightDownWin(x, y) || leftDownWin(x, y)) {
            return chessBoard[x][y];
        }
        return 0;
    }

    /**
     * 下棋 handler
     * @param e
     */
    function setPiece(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        console.log("落子点：(" + i + "," + j + ")");
        if (chessBoard[i][j] == 0) {
            drawPiece(i, j, flag, chessCtx);
            chessBoard[i][j] = flag;
            historyPiece.push({x: i, y: j});

            setTimeout(function () {
                if (win(i, j) === 1) {
                    alert("黑子胜！");
                    EventUtil.removeListener(chess, "click", setPiece);
                } else if (win(i, j) == 2) {
                    alert("白子胜！")
                    EventUtil.removeListener(chess, "click", setPiece);
                }
            }, 0)

            if (flag === 1) {
                flag = 2;
            } else {
                flag = 1;
            }
        }
    }
    /**
     * 重新开始 handler
     * @param e
     */
    function fnRestart(e){
        for (var i = 0; i < 15; i++) {
            chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                chessBoard[i][j] = 0;
            }
        }
        historyPiece = []; //保存历史下棋位置记录
        chessCtx.clearRect(0, 0, chessBox.clientHeight, chessBox.clientWidth);
        flag = 1;
        EventUtil.addListener(chess, "click", setPiece);
    }
    /**
     * 悔棋 handler
     * @param e
     */
    function fnRetract(e) {
        if (historyPiece.length) {
            var point = historyPiece.pop();
            chessBoard[point.x][point.y] = 0;
            console.log("悔棋坐标：", point);
            chessCtx.clearRect(point.x * gridSize, point.y * gridSize, gridSize, gridSize);
            if (flag === 1) {
                flag = 2;
            } else {
                flag = 1;
            }
        }
    }
}
