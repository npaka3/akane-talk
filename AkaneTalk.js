//====================
//定数
//====================
//システム
var KEY_NONE=-999;
var WIDTH=320;
var HEIGHT=320;
var TALK_NUM=160;
var TALK_ANIM=new Array( 
    -1, -2, -2, -3, -3, -3, -3, -2, -2, -1, 
    1, 2, 2, 3, 3, 3, 3, 2, 2, 1);
var RATE=1;

//キー
var KEY_SELECT=13;
var KEY_SOFT1=16;
var KEY_SOFT2=18;
var KEY_UP=38;
var KEY_DOWN=40;
var KEY_LEFT=37;
var KEY_RIGHT=39;

//シーン
var S_LAUNCH=0;
var S_TITLE=1;
var S_SELECT=2;
var S_TALK=3;
var S_BUTTON=4;
var S_DRESSED=5;
var S_MEMORY=6;
        
//モード
var M_NONE=0;
var M_FRIEND=1;
var M_TIME=2;
      
//====================
//変数
//====================  
//ベース
var g;
var resImg=new Array();
var resText;
        
//システム
var scene=S_LAUNCH;
var init=S_LAUNCH;
var keyCode=KEY_NONE;
var tick=0;
var mode;
var select;
var waveFlag;
var kisekaeText;
        
//コマンド
var akaneImg=new Array();
var akanePos;
var akaneColor=new Array();
var akaneType;

//コマンド
var cmd;
var cmdPos;

//トーク
var talk;
var talkPos;
var talkNum;
        
//友達
var friend;
var friendN;

//var debug=100;

//====================
//初期化
//====================
//初期化
function onLoad() {
    //グラフィックス
    var canvas =document.getElementById("myCanvas");
    g=new Graphics(canvas);

    //イベント
    if (navigator.userAgent.indexOf('iPhone')>0 ||
        navigator.userAgent.indexOf('iPod')>0 || 
        navigator.userAgent.indexOf('iPad')>0 ||
        navigator.userAgent.indexOf('Android')>0) {
        canvas.addEventListener("touchstart",onTouchStart,false);
    } else {
        canvas.addEventListener("mousedown",onMouseDown,false);
        canvas.addEventListener("mousemove",onMouseMove,false);
    }

    //リソース
    for (var i=0;i<15;i++) {
        var ext=(i==0 || i==2)?".jpg":".png";
        resImg[i]=g.loadImage("res/r"+i+ext);                
    }
    resText=parseStr(http2str("res/r.txt"),'\n');

    //ステータス
    readStatus();
    akaneImg[0]=g.loadImage("res/a" + akaneType+".jpg");

    //タイマーの開始
    setInterval('onTick()',100);
}

//シーンの初期化
function initScene() {
    if (init<0) return;
    var i;
    var j;
    scene=init;
    init=-1;
    tick=0;

    //タイトル
    if (scene==S_TITLE) {
        //ステータスの読み込み
        akanePos=0;
        readStatus();
            
        //起動イベント
        select=0;
        cmd=null;
        var date=new Date();
        if (friendN<=0) {
            readCmd("fe0");
            friendN=10;
            writeStatus();
        } else {
            if (!readCmd("c"+ 
                c(date.getMonth()+1,2)+             
                c(date.getDate(),2))) {
                cmd=null;
            }
        }            
        if (cmd==null) {
            i=date.getHours();
            j=13;
            if (i<=3 || 18<=i) {
                j=14;
            } else if (i<=11) {
                j=12;
            }
            cmd=new Array("", resText[j], resText[Math.floor(i/2)], "b");
        }    
    }
    //ボタン
    if (scene==S_BUTTON) {
        akanePos=0;
    }
    //トーク
    if (scene==S_TALK) {
        cmdPos=0;
        nextCmd();
        if (waveFlag) {
            talkPos=-25;
            waveFlag=false;
        }
    }  
    //回想
    if (scene==S_MEMORY) {
        j=(friendN-30)/10;
        if (friendN<=50) j=friendN / 20;
        j=Math.floor(j);
        talk=new Array(j*2);
        for (i=0;i<j;i++) {
            talk[i*2]=resText[i+15];
            talk[i*2+1]="fe"+(i+1);
        }        
    }
    //ボタン・選択・着せ替え・回想
    if (scene==S_BUTTON || scene==S_SELECT || 
        scene==S_DRESSED || scene==S_MEMORY) {
        select=-1;
        tick=0;
    }
}

//次コマンド
function nextCmd() {
    var i;
    var strs;
    cmdPos++;
    keyCode=KEY_NONE;
    //最終行
    if (cmdPos==cmd.length-1) {
        //ボタン
        if (cmd[cmdPos] == "b") {
            select=0;
            init=S_BUTTON;
        }
        //終了
        else if (cmd[cmdPos]=="e") {
            init=S_TITLE;
        }
        //ジャンプ
        else if (cmd[cmdPos].indexOf("j")==0) {
            var name=cmd[cmdPos].substring(1);
            readCmd(name);
            init=S_TALK;
        }
        //選択肢
        else {
            init=S_SELECT;
            select=0;
            talk=parseStr(cmd[cmdPos],'\t');
        }
        return;
    }
    //イベント画像表示
    else if (cmd[cmdPos].indexOf("#i")==0) {
        akanePos=parseInt(cmd[cmdPos].substring(2));
        nextCmd();
        return;
    }
    //塗り潰し
    else if (cmd[cmdPos].indexOf("#c")==0) {
        akanePos=10;
        akaneColor[0]=parseInt(cmd[cmdPos].substring(2, 4),16);
        akaneColor[1]=parseInt(cmd[cmdPos].substring(4, 6),16);
        akaneColor[2]=parseInt(cmd[cmdPos].substring(6, 8),16);
        nextCmd();
        return;
    }
    //茜画像変更
    else if (cmd[cmdPos].indexOf("#a")==0) {
        strs=parseStr(cmd[cmdPos],'\t');
        var idx=parseInt(strs[0].substring(2));
        if (idx != akaneType) {
            //情報
            akaneType=idx;
            akaneImg[0]=g.loadImage("res/a" + akaneType+".jpg");
            writeStatus();
            kisekaeText=strs[1];
            init=S_DRESSED;
        } else {
            nextCmd();
        }
        return;
    }
    //友好度変更
    else if (cmd[cmdPos].indexOf("#f")==0) {
        friend+=parseInt(cmd[cmdPos].substring(2));    
        if (friend>=100) friend=100;    
        if (friend<0)    friend=0;    
        writeStatus();
        nextCmd();
        return;
    }
    //友好度ジャンプ
    else if (cmd[cmdPos].indexOf("#j")==0) {
        strs=parseStr(cmd[cmdPos],'\t');
        if (parseInt(strs[0].substring(2))<=friend) {
            readCmd(strs[1]);
            init=S_TALK;
            return;
        }
        nextCmd();
        return;
    }
    //バイブレーション
    else if (cmd[cmdPos].indexOf("#v")==0) {
        nextCmd();
        return;
    }
    //トーク
    talk=parseStr(cmd[cmdPos],'\t');
    talkPos=-2;
}

//====================
//定期処理
//====================
//定期処理
function onTick() {
    //イメージの読み込み待ち
    //--------------------
    if (g.getLoadingCount()>0) return;
    var i;

    //初期化
    //--------------------
    initScene();
            
    //起動
    //--------------------
    if (scene==S_LAUNCH) {
        //描画
        g.setColor(255,255,255);
        g.fillRect(0,0,WIDTH,HEIGHT);
        g.drawImage(resImg[0],0,0);
        
        //処理
        tick++;
        if (tick==10) init=S_TITLE;
    } 

    //タイトル
    //--------------------
    if (scene==S_TITLE) {
        //描画
        g.setColor(255,255,255);
        g.fillRect(0,0,WIDTH,HEIGHT);
        g.drawImage(resImg[2],0,0);    
        if (tick%20<10) {
            g.drawImage(resImg[3],13,290);
        }                

        //イベント
        if (keyCode==KEY_SELECT) {
            init=S_TALK;
            mode=M_FRIEND;
            g.setColor(255,255,255);
            g.fillRect(0,0,WIDTH,HEIGHT);
        }
        keyCode=KEY_NONE;
        if (++tick>999) tick=0;                
    }

    //トーク
    //--------------------
    if (scene==S_TALK) {
        if (talkPos<60) {
            if (keyCode==KEY_SELECT) {
                talkPos=60;
                keyCode=KEY_NONE;                
            }
        }
    }

    //背景
    //--------------------
    if ((scene==S_TALK && (talkPos<0 || talkPos>=60)) || 
        scene==S_BUTTON || 
        scene==S_SELECT || scene==S_DRESSED ||
        scene==S_MEMORY) {        
        //描画
        if (akanePos<=3) {
            for (i=0;i<=akanePos;i++) {
                g.drawImage(akaneImg[i],0,0);
            }
        } else {
            g.setColor(akaneColor[0],akaneColor[1],akaneColor[2]);
            g.fillRect(0,0,WIDTH,HEIGHT);
        }
        if (scene!=S_MEMORY) drawMode();
    }

    //着せ替え
    //--------------------
    if (scene==S_DRESSED) {
        g.drawImage(resImg[7],15,188);
        g.setColor(255,255,255);
        g.drawString(kisekaeText,34,198+25);
        g.drawImage(resImg[8],39,258);       
        g.setColor(255,204,204);
        g.fillRect(38,283,245,5);    
        tick+=20;
        i=(tick>245)?245:tick;
        g.setColor(255,153,153);       
        g.fillRect(38,283,i,5);
        if (tick>=275) {
            init=S_BUTTON;
            nextCmd();
        }
    }

    //ボタン
    //--------------------
    if (scene==S_BUTTON) {
        //描画
        if (select!=0 || isBtnShow()) {
            var dy=(select==-1)?TALK_ANIM[tick%TALK_ANIM.length]:0;
            g.drawImage(resImg[5],90,250+dy);
        } 
        if (select!=1 || isBtnShow()) {
            g.drawImage(resImg[6],4,285);
        } 
        if (select!=2 || isBtnShow()) {
            if (friendN>=30) g.drawImage(resImg[14],320-4-92,285);
        }
        
        //選択前
        if (tick<2000) {
            if (++tick>999) tick=0;
            //イベント
            if (keyCode==KEY_SELECT) {
                if (select<0) return;
                tick=2000;
            }
        } 
        //選択後
        else {
            if (++tick>2010) {
                if (select==0) {
                    //if (friendN<100) {friend=100;friendN=100;}//デバッグ

                    //友好度イベント
                    if (friend>=friendN) {
                        if (friendN==10 || friendN==30) friendN+=10;
                        friendN+=10;
                        var idx=(friendN-30)/10;
                        if (friendN<=50) idx=friendN/20;
                        readCmd("fe"+Math.floor(idx));        
                        writeStatus();
                        init=S_TALK;
                    }
                    //トークイベント
                    else {
                        readCmd("t"+rand(TALK_NUM));
                        
                        //デバッグ
                        //readCmd("t"+debug);
                        //debug++;
                        
                        init=S_TALK;
                        waveFlag=true;
                    }            
                } else if (select==1) {
                    cmd=new Array("",resText[23],"e");
                    init=S_TALK;            
                } else if (select==2) {
                    if (friendN>=30) init=S_MEMORY;
                }
            }
        }        
    } 
    //選択
    //--------------------
    else if (scene==S_SELECT) {
        //描画
        g.drawImage(resImg[7],15,188);
        if (select>=0 && isBtnShow()) {
            g.drawImage(resImg[11],22,198-1+35*select);
        }
        g.setColor(255,255,255);
        for (i=0;i<talk.length/2;i++) {
            g.drawString(talk[i*2],34,198+25+i*35);
        }
        
        //選択前
        if (tick<2000) {
            //if (tick%10<5) {
            //    g.drawImage(resImg[9],5+85,290);
            //}
            if (++tick>999) tick=0;
            //イベント
            if (keyCode==KEY_UP) {
                if (select>0) select--;
            } else if (keyCode==KEY_DOWN) {
                if (select<Math.floor(talk.length/2)-1) select++;
            } else if (keyCode==KEY_SELECT) {
                if (select>=0) tick=2000;
            }    
        } 
        //選択後
        else {
            if (++tick>2010) {
                readCmd(talk[select*2+1]);
                init=S_TALK;
                waveFlag=true;
            }
        }
    } 
    //トーク
    //--------------------
    else if (scene==S_TALK) {
        //描画
        talkPos+=RATE;
        if (talkPos==0 || talkPos>=60) g.drawImage(resImg[7],15,188);
        if (talkPos>=60) {
            if (tick%10<5) {
                g.drawImage(resImg[12],290,286);
            }            
        }
        g.setColor(255,255,255);
        if (talkPos<-4) {
            if (Math.floor((-talkPos)%10)<5) g.drawImage(resImg[4],25,-10);
        } else if (talkPos<0) {
        } else if (talkPos<20) {
            i=g.stringWidth(talk[0].substring(0,talkPos-1));
            g.drawString(talk[0].substring(talkPos-1,talkPos),34+i,198+25);
            if (talkPos>=talk[0].length) {
                talkPos=20;
                if (talk.length<=1) talkPos=60;
            }
        } else if (talkPos<40) {
            i=g.stringWidth(talk[1].substring(0,talkPos-21));
            g.drawString(talk[1].substring(talkPos-21,talkPos-20),34+i,198+25+35);
            if (talkPos>=talk[1].length+20) {
                talkPos=40;
                if (talk.length<=2) talkPos=60;
            }
        } else if (talkPos<60) {
            i=g.stringWidth(talk[2].substring(0,talkPos-41));
            g.drawString(talk[2].substring(talkPos-41,talkPos-40),34+i,198+25+35*2);
            if (talkPos>=talk[2].length+40) {
                talkPos=60;
            }
        } else {
            for (var k=0;k<talk.length;k++) {
                for (var j=1;j<=talk[k].length;j++) {
                    i=g.stringWidth(talk[k].substring(0,j-1));
                    g.drawString(talk[k].substring(j-1,j),34+i,198+25+35*k);
                }
            }
            if (talkPos>60+100) keyCode=KEY_SELECT;
            if (keyCode==KEY_SELECT) {
                nextCmd();
            }            
        }
        if (talkPos<60) {keyCode=KEY_NONE;tick=0;}
        if (++tick>999) tick=0;
    }

    //回想
    //--------------------
    else if (scene==S_MEMORY) {        
        //描画
        g.drawImage(resImg[10],15,15);    
        if (select>=0 && select!=99 && isBtnShow()) {                
            g.drawImage(resImg[11],22,20-1+35*select);
        }
        g.setColor(255,255,255);
        for (i=0;i<talk.length/2;i++) {                    
            g.drawString(talk[i*2],34,20+25+i*35);                    
        }
        if (select!=99 || isBtnShow()) {                
            g.drawImage(resImg[13],286,4);
        }
                
        //選択前
        if (tick<2000) {
            if (++tick>999) tick=0;
            //イベント
            if (keyCode==KEY_SELECT) {
                if (select>=0) tick=2000;
            }
        } 
        //選択後
        else {
            if (++tick>2010) {
                if (select!=99) {
                    readCmd(talk[select*2+1]);
                    init=S_TALK;
                } else {
                    init=S_BUTTON;
                }
            }
        }                
    }            
            
    //モード
    //--------------------
    if (keyCode==KEY_SOFT1) {
        if (mode==3) {
            mode=0;
        } else {
            mode++;
        }
        tick=0;
    }            
    keyCode=KEY_NONE;
}

//モードの描画
function drawMode() {
    if (mode==M_NONE) return;
    g.drawImage(resImg[1],240,10);
    g.setFontSize(25);
    g.setColor(254,121,122);
    g.drawString(c(friend,3),268,8+20);
    g.setFontSize(28);
}

//ボタン表示するかどうか
function isBtnShow() {
    return tick<2000 || 2004<tick || Math.floor(tick%2)<1;
}

//====================
//イベント
//====================
//マウスダウンイベントの処理
function onMouseDown(event) {
    var rect=event.target.getBoundingClientRect();
    var mx=event.clientX-rect.left;
    var my=event.clientY-rect.top;
    onClick(mx,my);
}

//タッチスタートイベントの処理
function onTouchStart(event) {
    var rect=event.target.getBoundingClientRect();
    var mx=event.touches[0].pageX-rect.left;
    var my=event.touches[0].pageY-rect.top;
    onClick(mx,my);
}

//クリックイベントの処理
function onClick(mx,my) {
    if (tick>=2000) return;
    
    //タイトル・トーク
    if (scene==S_TITLE || scene==S_TALK) {
        keyCode=KEY_SELECT;
    }
    //ボタン 
    else if (scene==S_BUTTON) {
        if (hitRect(70,240,180,60,mx,my)) {
            select=0;
            keyCode=KEY_SELECT;
        } else if (hitRect(4,285,92,32,mx,my)) {
            select=1;
            keyCode=KEY_SELECT;
        } else if (hitRect(320-4-92,285,92,32,mx,my)) {
            if (friendN>=30) {
                select=2;
                keyCode=KEY_SELECT;
            }
        }
    }
    //選択・回想
    else if (scene==S_SELECT || scene==S_MEMORY) {
        select=-1;
        if (talk==null) return;
        var dy=198;
        var dh=35;
        if (scene==S_MEMORY) {
            dy=20;
            dh=35;
        }
        for (var i= 0;i<Math.floor(talk.length/2);i++) {
            if (hitRect(22,dy-2+dh*i,275,35,mx,my)) {
                select=i;
                keyCode=KEY_SELECT;
            }
        }
        if (scene==S_MEMORY) {
            if (hitRect(280,0,40,40,mx,my)) {
                select=99;
                keyCode=KEY_SELECT;
            }
        }
    }
}

//マウスムーブイベントの処理
function onMouseMove(event) {
    var rect=event.target.getBoundingClientRect();
    var mx=event.clientX-rect.left;
    var my=event.clientY-rect.top;
    if (tick>=2000) return;

    //選択・回想
    if (scene==S_SELECT || scene==S_MEMORY) {
        select=-1;
        if (talk==null) return;
        var dy=198;
        var dh=35;
        if (scene==S_MEMORY) {
            dy=20;
            dh=35;
        }
        for (var i=0;i<Math.floor(talk.length/2);i++) {
            if (hitRect(22,dy-2+dh*i,275,35,mx,my)) {
                select=i;
            }
        }
    }
}

//====================
//読み書き
//====================
//ステータスの読み込み
function readStatus() {
    akaneType=parseInt(localStorage.getItem("akaneType"));
    friend=parseInt(localStorage.getItem("friend"));
    friendN=parseInt(localStorage.getItem("friendN"));
    if (isNaN(akaneType)) akaneType=0;
    if (akaneType<2) akaneType=2;
    if (isNaN(friend)) friend=0;
    if (isNaN(friendN)) friendN=0;
}
        
//ステータスの書き込み
function writeStatus() {
    localStorage.setItem("akaneType",""+akaneType);
    localStorage.setItem("friend",""+friend);
    localStorage.setItem("friendN",""+friendN);
}

//命令の読み込み
function readCmd(name) {
    var i;
    akaneType=0;
            
    //イメージ
    for (i=3;i>0;i--) {
        akaneImg[i+3]=akaneImg[i];
    }

    //テキスト読み込み
    var obj=http2str("res/"+name+".txt");
    if (obj==null) return false;
    cmd=parseStr(obj,'\n');

    //デバッグ
    /*console.log("readCmd>"+name);
    for (var i=0;i<cmd.length;i++) {
        console.log(i+">>"+cmd[i]);
    }*/
            
    //画像ファイル
    if (cmd[0]!="") {
        var strs=cmd[0].split('\t');
        for (i=0;i<strs.length;i++) {
            var ext=isPng(strs[i])?".png":".jpg";
            akaneImg[i+1]=g.loadImage("res/"+strs[i]+ext);
        }
    }
    return true;
}

//拡張子の取得
function isPng(name) {
    return name=="e1" ||
        name=="e4" ||
        name=="e8" ||
        name=="e9_a" ||
        name=="e9_b" ||
        name=="e9_c" ||
        name=="fe0" ||
        name=="fe8_b" ||
        name=="fe8_c";
}