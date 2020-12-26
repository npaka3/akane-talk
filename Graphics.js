//コンストラクタ
function Graphics(canvas) {
    this.canvas =canvas;
    this.context=canvas.getContext("2d");
    this.loadingCount=0;
    this.context.font="12px Helvetica";
}

//色の指定
Graphics.prototype.setColor=function(r,g,b) {
    var color="rgb("+r+","+g+","+b+")";
    this.context.strokeStyle=color;
    this.context.fillStyle  =color;
}

//フォントサイズの指定
Graphics.prototype.setFontSize=function(fontSize) {
    this.context.font=fontSize+"px Helvetica";
}

//文字列幅の取得
Graphics.prototype.stringWidth=function(str) {
    return this.context.measureText(str).width;
}

//文字列の描画
Graphics.prototype.drawString=function(str,x,y) {
    this.context.fillText(str,x,y);
}

//ラインの描画
Graphics.prototype.drawLine=function(x0,y0,x1,y1) {
    this.context.beginPath();
    this.context.moveTo(x0,y0);
    this.context.lineTo(x1,y1);   
    this.context.stroke();
}

//ポリラインの描画
Graphics.prototype.drawPolyline=function(ax,ay) {
    this.context.beginPath();
    this.context.moveTo(ax[0],ay[0]);
    for (var i=1;i<ax.length;i++){
        this.context.lineTo(ax[i],ay[i]);   
    }
    this.context.stroke();
}

//四角形の描画
Graphics.prototype.drawRect=function(x,y,w,h) {
    this.context.strokeRect(x,y,w,h);
}

//四角形の塗り潰し
Graphics.prototype.fillRect=function(x,y,w,h) {
    this.context.fillRect(x,y,w,h);
}

//円の描画
Graphics.prototype.drawCircle=function(x,y,r) {
    this.context.beginPath();
    this.context.arc(x,y,r,0,Math.PI*2,true);
    this.context.stroke();
}

//円の塗り潰し
Graphics.prototype.fillCircle=function(x,y,r) {
    this.context.beginPath();
    this.context.arc(x,y,r,0,Math.PI*2,true);
    this.context.fill();
}

//読み込み中イメージ数の取得
Graphics.prototype.getLoadingCount=function() {
    return this.loadingCount;
}

//イメージの読み込み
Graphics.prototype.loadImage=function(src) {
    this.loadingCount++;
    var image=new Image();
    var source=this;
    image.onload=function() {
        source.loadingCount--;
    }
    image.src=src;
    return image;
}

//イメージの描画
Graphics.prototype.drawImage=function(image,x,y) {
    this.context.drawImage(image,x,y);
}