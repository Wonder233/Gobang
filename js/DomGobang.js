function DomGobang() {
    BaseGobang.call(this);
}

DomGobang.prototype = new BaseGobang();
DomGobang.prototype.constructor = DomGobang;

DomGobang.prototype.initBoard = function () { //初始化棋盘
    this.board = document.createElement("table");
    /* reason：IE盒子模式 */
    this.board.border = 10;
    this.board.width = this.boxWidth + 20;
    this.board.height = this.boxHeight + 20;
    this.board.cellSpacing = 0;
    var tbody = document.createElement("tbody");
    for (var i = 0; i <= this.row; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j <= this.col; j++) {
            var td = document.createElement("td");
            /* reason：IE盒子模式 */
            td.width = this.gridSize - 2;
            td.height = this.gridSize - 2;
            td.border = 1;
            td.borderColor = "#000";
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    this.board.appendChild(tbody);
    this.chessBox.appendChild(this.board);

    this.chess = document.createElement("div");
    this.chess.id = "chess";
    this.chess.style.width = this.boxWidth;
    this.chess.style.height = this.boxHeight;
    this.chessBox.appendChild(this.chess);

    console.log("棋盘初始化结束...");

    EventUtil.addListener(this.chess, "click", this.setPiece , this);
    EventUtil.addListener(this.restart, "click", this.fnRestart,this);
    EventUtil.addListener(this.retract, "click", this.fnRetract,this);
};

/**
 * 画棋子
 * @param (x,y) 坐标
 * @param flag 1：黑棋；2：白棋
 */
DomGobang.prototype.drawPiece = function (x, y, flag ,context ,id) {
    var img = new Image();
    if (flag === 1) {
        img.src = "./images/black.png";
    } else {
        img.src = "./images/white.png";
    }
    img.id = id;
    img.style.position = "absolute";
    img.style.left = x * this.gridSize - this.radius;
    img.style.top = y * this.gridSize - this.radius;
    context.appendChild(img);
}

/**
 * 下棋 handler
 * @param e
 */
DomGobang.prototype.setPiece = function (e) {
    var e = EventUtil.getEvent(e);
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.ceil((x -this.radius) / this.gridSize);
    var j = Math.ceil((y -this.radius) / this.gridSize);
    console.log("落子点：(" + i + "," + j + ")");
    if (this.chessBoard[i][j] == 0) {
        this.drawPiece(i, j, this.flag ,this.chess,this.historyPiece.length);
        this.chessBoard[i][j] = this.flag;
        this.historyPiece.push({x: i, y: j});

        var _this = this;
        setTimeout(function () {
            if (_this.win(i, j ,_this.chessBoard) === 1) {
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract,_this);
                alert("黑子胜！");
                _this.flag = 1;
            } else if (_this.win(i, j ,_this.chessBoard) == 2) {
                EventUtil.removeListener(_this.chess, "click", _this.setPiece,_this);
                EventUtil.removeListener(_this.retract, "click", _this.fnRetract,_this);
                alert("白子胜！")
                _this.flag = 1;
            }
        }, 0);

        if (this.flag === 1) {
            this.flag = 2;
        } else {
            this.flag = 1;
        }
    }
};


/**
 * 重新开始 handler
 * @param e
 */
DomGobang.prototype.fnRestart = function () {
    this.restartInit.call(this);
    this.chess.innerHTML = "";
};
/**
 * 悔棋 handler
 * @param e
 */
DomGobang.prototype.fnRetract = function () {
    var point = this.retractInit.call(this);
    if(point){
        this.chess.removeChild(this.chess.childNodes[this.historyPiece.length]);
    }
};