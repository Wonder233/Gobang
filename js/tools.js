/**
 * 事件处理程序
 * @type {{addListener: Function, removeListener: Function, getEvent: Function, getTarget: Function, stopPropagation: Function, preventDefault: Function}}
 */
var EventUtil = {
    addListener: function (target, type, handler) {
        if (target.addEventListener) {
            console.log("addEventListener");
            target.addEventListener(type, handler);
        } else if (target.attachEvent) {
            console.log("attachEvent");
            //target.detachEvent("on" + type, handler);
            target.attachEvent("on" + type, function () {
                handler.call(target);
            });
        } else {
            target["on" + type] = handler;
        }
    },
    removeListener: function (target, type, handler) {
        if (target.removeEventListener) {
            console.log("removeListener");
            target.removeEventListener(type, handler);
        } else if (target.detachEvent) {
            console.log("detachEvent");
            target.detachEvent("on" + type, function () {
                handler.call(target);
            });
            //target.detachEvent("on" + type, handler);
        } else {
            target["on" + type] = null;
        }
    },
    getEvent: function (e) {      //获取事件对象
        var evt = window.event || e;
        return evt;
    },
    getTarget: function (e) {      //获得目标对象
        var evt = EventUtil.getEvent(e);
        var target;
        if (evt.target) {
            target = evt.target;
        } else {
            target = evt.srcElement;
        }
        return target;
    },
    stopPropagation: function (e) {  //停止冒泡
        var evt = EventUtil.getEvent(e);
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    },
    preventDefault: function (e) {   //阻止默认行为的发生
        var evt = EventUtil.getEvent(e);
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
}

function canvasSupport() {
    try {
        document.createElement('canvas').getContext("2d");
        return true;
    } catch (err) {
        return false;
    }
}

// 判断输赢函数
function win(x, y, chessBoard) {
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

