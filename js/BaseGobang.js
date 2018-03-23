function BaseGobang() {
    this.chessBox = document.getElementById("chessBox");
    this.restart = document.getElementById("restart");
    this.retract = document.getElementById("retract");

    //棋盘宽高
    this.boxHeight = 450;
    this.boxWidth = 450;
    this.gridSize = 30; //棋格尺寸
    this.row = (this.boxWidth - this.gridSize) / this.gridSize; //行
    this.col = (this.boxHeight - this.gridSize) / this.gridSize; //列

    this.historyPiece = []; //保存历史下棋位置记录
    this.flag = 1; //标识：棋子颜色，1：黑棋，2：白棋
    this.chessBoard = [];//棋盘数组
    for (var i = 0; i < 15; i++) {
        this.chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            this.chessBoard[i][j] = 0;
        }
    }

    //棋盘画布
    this.board = {};
    this.boardCtx = {};
    //棋子画布
    this.chess = {};
    this.chessCtx = {};

}

BaseGobang.prototype = {
    // 判断输赢函数
    win: function (x, y,chessBoard) {
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
    },
    /**
     * 重新开始 handler
     * @param e
     */
    restartInit: function (chessBoard,historyPiece,flag) {
        for (var i = 0; i < 15; i++) {
            chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                chessBoard[i][j] = 0;
            }
        }

        historyPiece = []; //保存历史下棋位置记录
        flag = 1;
        console.log("flag",flag);
    }
};