function H5Gobang() {
    BaseGobang.call(this);
    console.log(this)
}

//inheritPrototype(H5Gobang,BaseGobang);
H5Gobang.prototype = new BaseGobang();
H5Gobang.prototype.constructor = H5Gobang;

H5Gobang.prototype.initBoard = function () { //初始化棋盘
    this.board = document.createElement("canvas");
    this.board.id = "board";
    this.board.width = this.boxWidth;
    this.board.height = this.boxHeight;
    this.chessBox.appendChild(this.board);

    this.boardCtx = this.board.getContext("2d");
    this.boardCtx.strokeStyle = "#000"; //棋盘线颜色
    for (var i = 0; i < 15; i++) {  //通过循环画网格
        this.boardCtx.moveTo(15, 15 + i * this.gridSize);
        this.boardCtx.lineTo(this.board.width - 15, 15 + i * this.gridSize);
        this.boardCtx.stroke();
        this.boardCtx.moveTo(15 + i * this.gridSize, 15);
        this.boardCtx.lineTo(15 + i * this.gridSize, this.board.height - 15);
        this.boardCtx.stroke();
    }

    this.chess = document.createElement("canvas");
    this.chess.id = "chess";
    this.chess.width = this.boxWidth;
    this.chess.height = this.boxHeight;
    this.chess.zIndex = 100;
    this.chessBox.appendChild(this.chess);

    this.chessCtx = this.chess.getContext("2d");
    console.log(this);
    console.log("棋盘初始化结束...");

    EventUtil.addListener(this.chess, "click", this.setPiece , this);
    EventUtil.addListener(this.restart, "click", this.fnRestart ,this);
    EventUtil.addListener(this.retract, "click", this.fnRetract , this);

}
/**
 * 画棋子
 * @param (x,y) 坐标
 * @param flag 1：黑棋；2：白棋
 */
H5Gobang.prototype.drawPiece = function (x, y, flag, context) {
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

/**
 * 下棋 handler
 * @param e
 */
H5Gobang.prototype.setPiece = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //console.log("落子点：(" + i + "," + j + ")");
    if (this.chessBoard[i][j] == 0) {
        this.drawPiece(i, j, this.flag, this.chessCtx);
        this.chessBoard[i][j] = this.flag;
        this.historyPiece.push({x: i, y: j});

        var _this = this;
        setTimeout(function () {
            //console.log(_this);
            if (_this.win(i, j, _this.chessBoard) === 1) {
                alert("黑子胜！");
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract);
                _this.flag = 1;
            } else if (_this.win(i, j, _this.chessBoard) == 2) {
                alert("白子胜！")
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract);
                _this.flag = 1;
            }
        }, 0)

        if (this.flag === 1) {
            this.flag = 2;
        } else {
            this.flag = 1;
        }
    }
}

/**
 * 重新开始 handler
 */
H5Gobang.prototype.fnRestart = function () {
    this.restartInit(this.chessBoard,this.historyPiece,this.flag);
    this.chessCtx.clearRect(0, 0, this.chessBox.clientHeight, this.chessBox.clientWidth);
    console.log(this);
    EventUtil.addListener(this.chess, "click", this.setPiece , this);
    EventUtil.addListener(this.retract, "click", this.fnRetract , this);
}

/**
 * 悔棋 handler
 * @param e
 */
H5Gobang.prototype.fnRetract = function () {
    if (this.historyPiece.length) {
        var point = this.historyPiece.pop();
        this.chessBoard[point.x][point.y] = 0;
        console.log("悔棋坐标：", point);
        this.chessCtx.clearRect(point.x * this.gridSize, point.y * this.gridSize, this.gridSize, this.gridSize);
        if (this.flag === 1) {
            this.flag = 2;
        } else {
            this.flag = 1;
        }
    }
}

