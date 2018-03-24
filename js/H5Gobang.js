function H5Gobang() {
    BaseGobang.call(this);
}

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
    for (var i = 0; i <= this.row; i++) {  //通过循环画网格
        this.boardCtx.moveTo(this.radius, this.radius + i * this.gridSize);
        this.boardCtx.lineTo(this.board.width - this.radius, this.radius + i * this.gridSize);
        this.boardCtx.stroke();
        this.boardCtx.moveTo(this.radius + i * this.gridSize, this.radius);
        this.boardCtx.lineTo(this.radius + i * this.gridSize, this.board.height - this.radius);
        this.boardCtx.stroke();
    }

    this.chess = document.createElement("canvas");
    this.chess.id = "chess";
    this.chess.width = this.boxWidth;
    this.chess.height = this.boxHeight;
    this.chess.zIndex = 100;
    this.chessBox.appendChild(this.chess);

    this.chessCtx = this.chess.getContext("2d");
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
    context.arc(this.gridSize/2 + x * this.gridSize, this.gridSize/2 + y * this.gridSize, this.gridSize/2 - 1, 0, 2 * Math.PI); //画圆
    context.closePath();
    var gradient = context.createRadialGradient(this.radius + x * this.gridSize + 2,this.radius + y * this.gridSize - 2, this.radius,
        this.radius + x * this.gridSize, this.radius + y * this.gridSize, 0);
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
    var i = Math.floor(x / this.gridSize);
    var j = Math.floor(y / this.gridSize);
    //console.log("落子点：(" + i + "," + j + ")");
    if (this.chessBoard[i][j] == 0) {
        this.drawPiece(i, j, this.flag, this.chessCtx);
        this.chessBoard[i][j] = this.flag;
        this.historyPiece.push({x: i, y: j});

        var _this = this;
        setTimeout(function () {
            if (_this.win(i, j, _this.chessBoard) === 1) {
                alert("黑子胜！");
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract,_this);
                _this.flag = 1;
            } else if (_this.win(i, j, _this.chessBoard) == 2) {
                alert("白子胜！")
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract,_this);
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
    this.restartInit.call(this);
    this.chessCtx.clearRect(0, 0, this.chessBox.clientHeight, this.chessBox.clientWidth);
}

/**
 * 悔棋 handler
 * @param e
 */
H5Gobang.prototype.fnRetract = function () {
    var point = this.retractInit.call(this);
    if(point) {
        this.chessCtx.clearRect(point.x * this.gridSize, point.y * this.gridSize, this.gridSize, this.gridSize);
    }
}

