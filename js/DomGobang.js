function DomGobang() {
    var chessBox = document.getElementById("chessBox");
    var restart = document.getElementById("restart");
    var retract = document.getElementById("retract");

    var boxHeight = 450, boxWidth = 450;//棋盘宽高
    var gridSize = 30; //棋格尺寸
    var row = (boxWidth - gridSize) / gridSize; //行
    var col = (boxHeight - gridSize) / gridSize; //列

    var historyPiece = []; //保存历史下棋位置记录
    var flag = 1; //标识：棋子颜色，1：黑棋，2：白棋
    var chessBoard = [];//棋盘数组
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }

    var table = null;//棋盘
    var divctx = null;//棋子
    initBoard(gridSize);

    EventUtil.addListener(divctx, "click", setPiece);
    EventUtil.addListener(restart, "click", fnRestart);
    EventUtil.addListener(retract, "click", fnRetract);

    function initBoard(gridSize) { //初始化棋盘
        table = document.createElement("table");
        /* reason：IE盒子模式 */
        table.border = 10;
        table.width = boxWidth + 20;
        table.height = boxHeight + 20;
        table.cellSpacing = 0;
        var tbody = document.createElement("tbody");
        for (var i = 0; i <= row; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j <= col; j++) {
                var td = document.createElement("td");
                /* reason：IE盒子模式 */
                td.width = gridSize - 2;
                td.height = gridSize - 2;
                td.border = 1;
                td.borderColor = "#000";
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        chessBox.appendChild(table);

        divctx = document.createElement("div");
        divctx.id = "divctx";
        divctx.style.width = boxWidth;
        divctx.style.height = boxHeight;
        chessBox.appendChild(divctx);

        console.log("棋盘初始化结束...");
    };
    /**
     * 画棋子
     * @param (x,y) 坐标
     * @param flag 1：黑棋；2：白棋
     */
    function drawPiece(x, y, flag) {
        var img = new Image();
        if (flag === 1) {
            img.src = "./images/black.png";
        } else {
            img.src = "./images/white.png";
        }
        img.id = historyPiece.length;
        img.style.position = "absolute";
        img.style.left = x * 30 - 15;
        img.style.top = y * 30 - 15;
        //console.log("left：",x * 30 - 15," top：",y * 30 - 15);
        divctx.appendChild(img);
    }
    /**
     * 下棋 handler
     * @param e
     */
    function setPiece(e) {
        var e = EventUtil.getEvent(e);
        var x = e.offsetX;
        var y = e.offsetY;
        console.log("落子像素点(%d,%d)", x, y);
        var i = Math.ceil((x -15) / 30);
        var j = Math.ceil((y -15) / 30);
        console.log("落子点：(" + i + "," + j + ")");
        if (chessBoard[i][j] == 0) {
            drawPiece(i, j, flag);
            chessBoard[i][j] = flag;
            historyPiece.push({x: i, y: j});

            setTimeout(function () {
                if (win(i, j ,chessBoard) === 1) {
                    EventUtil.removeListener(divctx, "click", setPiece);
                    EventUtil.removeListener(retract, "click", fnRetract);
                    alert("黑子胜！");
                } else if (win(i, j ,chessBoard) == 2) {
                    EventUtil.removeListener(divctx, "click", setPiece);
                    EventUtil.removeListener(retract, "click", fnRetract);
                    alert("白子胜！")
                }
            }, 0);

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
        divctx.innerHTML = "";
        flag = 1;
        EventUtil.addListener(divctx, "click", setPiece);
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
            divctx.removeChild(divctx.childNodes[historyPiece.length])
            if (flag === 1) {
                flag = 2;
            } else {
                flag = 1;
            }
        }
    }
}