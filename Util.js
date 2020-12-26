//====================
//システム
//====================
//乱数の取得
function rand(num) {
    return Math.floor(Math.random()*num);
}
        
//衝突判定
function hitRect(x,y,w,h,px,py) {
    return (x<px && px<x+w && y<py && py<y+h);
}

//要素の取得
function getElement(name) {
    if(document.getElementById) return document.getElementById(name);
    if(document.all) return document.all(name);
    return null;
}

//====================
//文字列
//====================
//文字列を任意の文字で分割
function parseStr(str,sep) {
    //最後尾に分割文字
    if (str=="" || str.substring(str.length-1) != sep) str+=sep;

    //分割
    var size=0;
    var j=0;
    var i=str.indexOf(sep);
    var result=new Array();
   while (i>=0) {                
        result.push(str.substring(j,i));
        j=i+1;
        i=str.indexOf(sep,j);
    }
    return result;
}

//文字長さ補正
function c(num,len) {
    var str=""+num;
    while (str.length<len) str="0"+str;
    return str;
}    

//HTTP→文字列
function http2str(url) {
    try {
        var request=new XMLHttpRequest();
        request.open("GET",url,false);
        request.send(null);
        if (request.status==200 || request.status==0) {
            return request.responseText;
        }
    } catch (e) {
    }
    return null;
}
