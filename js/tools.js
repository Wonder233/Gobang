/**
 * 事件处理程序
 * @type {{addListener: Function, removeListener: Function, getEvent: Function, getTarget: Function, stopPropagation: Function, preventDefault: Function}}
 */
var EventUtil = {
    addListener: function (target, type, handler, scope) {
        function fn(event) {
            var evt = event ? event : window.event;
            evt.target = event.target || event.srcElement;
            return handler.apply(scope || this, arguments);
        }

        target.eventHash = target.eventHash || {};
        (target.eventHash [type] = target.eventHash [type] || []).push({
            "name": type,
            "handler": handler,
            "fn": fn,
            "scope": scope
        });
        if (target.addEventListener) {
            target.addEventListener(type, fn, false);
        } else if (target.attachEvent) {
            target.attachEvent("on" + type, fn);
        } else {
            target["on" + type] = fn;
        }
    },
    removeListener: function (target, type, handler, scope) {
        target.eventHash = target.eventHash || {};
        var evtList = target.eventHash [type] || [], len = evtList.length;
        if (len > 0) {
            for (; len--; ) {
                var curEvttarget = evtList[len];
                if (curEvttarget.name == type && curEvttarget.handler === handler && curEvttarget.scope === scope) {
                    if (target.removeEventListener) {
                        target.removeEventListener(type, curEvttarget.fn, false);
                    } else if (target.detachEvent) {
                        target.detachEvent("on" + type, curEvttarget.fn);
                    } else {
                        target["on" + type] = null;
                    }
                    evtList.splice(len, 1);
                    break;
                }
            }
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

function addHandler(obj, type, handler, scope) {
    function fn(event) {
        var evt = event ? event : window.event;
        evt.target = event.target || event.srcElement;
        return handler.apply(scope || this, arguments);
    }

    //为需要注册事件处理程序的对象定义一个保存事件的hash对象，并把事件处理程序和作用域保存在该事件类型的队列里面
    obj.eventHash = obj.eventHash || {}; 
    (obj.eventHash [type] = obj.eventHash [type] || []).push({
        "name": type,
        "handler": handler,
        "fn": fn,
        "scope": scope
    });
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
        obj.attachEvent("on" + type, fn);
    } else {
        obj["on" + type] = fn;
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

// 继承原型
function inheritPrototype(subType,superType){
    var prototype = Object(superType.prototype);  //创建对象
    prototype.constructor = subType;              //增强对象
    subType.prototype = prototype;                //指定对象
}

// 判断输赢函数
/*function win(x, y, chessBoard) {
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
}*/

