(function () {
    if(canvasSupport()){
        console.log("支持canvas");
        var h5gobang = new H5Gobang();
        h5gobang.initBoard();
    }else{
        console.log("不支持canvas");
        var domgobang = new DomGobang();
        domgobang.initBoard();
    }
}());