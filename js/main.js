(function () {
    if(canvasSupport()){
        console.log("支持canvas");
        H5Gobang();
    }else{
        console.log("不支持canvas");
        DomGobang();
    }
}());