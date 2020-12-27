# **あかねと～くスクリプト仕様書**
## **1. イベントの種類**

あかねト〜クには以下の5種類のイベントがあります。
<TABLE border="1">
  <TBODY>
    <TR>
      <TD nowrap><B>イベントの種類</B></TD>
      <TD nowrap><B>発生タイミング</B></TD>
      <TD><B>説明</B></TD>
    </TR>
    <TR>
      <TD>はじめましてイベント</TD>
      <TD>アプリ起動時</TD>
      <TD>はじめてゲームを開始した時のイベントです。</TD>
    </TR>
    <TR>
      <TD>カレンダーイベント</TD>
      <TD>アプリ起動時</TD>
      <TD>「コミケの日」や「ゲームの発売日」などの月日に対応したイベントです。カレンダーイベントが存在する日はアプリを起動するたびに実行されます。よって友好度の変更はしないようにしてください。</TD>
    </TR>
    <TR>
      <TD>挨拶イベント</TD>
      <TD>アプリ起動時</TD>
      <TD>「おはよう」や「こんばんわ」などの時刻に対応したイベントです。</TD>
    </TR>
    <TR>
      <TD>友好度イベント</TD>
      <TD>トークボタン</TD>
      <TD>友好度が上昇し、はじめて規定値(10,30,50,60,70,80,90,100)に達した時に発生するイベントです。一度見た友好度イベントはカイソウボタンで再生することができます。</TD>
    </TR>
    <TR>
      <TD>トークイベント</TD>
      <TD>トークボタン</TD>
      <TD>ランダムに発生するイベントです。</TD>
    </TR>
  </TBODY>
</TABLE><BR>
アプリ起動時に発生するイベントの優先順位は「はじめましてイベント&gt;カレンダーイベント&gt;挨拶イベント」です。優先度の低いイベントは実行されません。トークボタンを押したときに発生するイベントの優先順位は「友好度イベント&gt;トークイベント」です。優先度の低いイベントは実行されません。<BR><BR>

## **2. データファイルの種類**
あかねと～くには以下の7種類のデータファイルがあります。
<BR>
<TABLE border="1">
  <TBODY>
    <TR>
      <TD nowrap><B>ファイルの種類</B></TD>
      <TD nowrap><B>ファイル名の書式</B></TD>
      <TD><B>説明</B></TD>
    </TR>
    <TR>
      <TD>はじめましてスクリプト</TD>
      <TD>0.txt</TD>
      <TD>はじめましてイベントのスクリプトです。</TD>
    </TR>
    <TR>
      <TD>カレンダースクリプト</TD>
      <TD>c&lt;月日&gt;.txt</TD>
      <TD>カレンダーイベントのスクリプトです。1月1日のイベントスクリプトのファイル名は「0101.txt」となります。</TD>
    </TR>
    <TR>
      <TD>友好度スクリプト</TD>
      <TD>fe&lt;1-8&gt;.txt</TD>
      <TD>友好度イベントのスクリプトです。</TD>
    </TR>
    <TR>
      <TD>トークスクリプト</TD>
      <TD>t&lt;連番数字&gt;.txt</TD>
      <TD>トークイベントのスクリプトです。「0.txt」から順番に作成し、数を変更したら初期化スクリプトを変更してください。</TD>
    </TR>
    <TR>
      <TD>ジャンプスクリプト</TD>
      <TD>&lt;任意&gt;.txt</TD>
      <TD>トークイベントからジャンプ命令で飛んでくるイベントのスクリプトです。</TD>
    </TR>
    <TR>
      <TD>茜画像</TD>
      <TD>a&lt;1-255&gt;.jpg</TD>
      <TD>アプリに常駐する茜の画像です。「a2.jpg」はゲーム開始時の茜です。画像サイズは320x320ドットです。</TD>
    </TR>
    <TR>
      <TD>イベント画像</TD>
      <TD>fe&lt;任意&gt;.jpg</TD>
      <TD>イベントで一時的に表示する画像です。画像サイズは120x130ドット(機種によっては上10ドットが見えません)です。</TD>
    </TR>
  </TBODY>
</TABLE>
<BR><BR>

## **3. イベントスクリプトの書式**
「はじめましてスクリプト」と「カレンダースクリプト」と「友好度スクリプト」と「トークスクリプト」と「ジャンプスクリプト」は、ファイル名の書式とイベントの発生タイミングが異なるだけで、スクリプトの書式は同じです。これらをまとめて「イベントスクリプト」と呼びます。区切り文字は改行とタブです。わかりやすいように、改行は&lt;改行&gt;、タブは&lt;タブ&gt;と記述しています。
<TABLE border="1">
  <CAPTION>書式(全体)</CAPTION>
  <TBODY>
    <TR>
      <TD>画像ファイル名&lt;改行&gt;<BR>
      メッセージ or 命令&lt;改行&gt;<BR>
      　　　　　　　<B>:</B><BR>
      メッセージ or 命令&lt;改行&gt;<BR>
      終了時の処理&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例(全体)</CAPTION>
  <TBODY>
    <TR>
      <TD>e4&lt;改行&gt;<BR>
      抜き打ち！&lt;タブ&gt;お兄ちゃんのお部屋&lt;タブ&gt;チェーック！！&lt;改行&gt;<BR>
      お兄ちゃんのお部屋&lt;タブ&gt;を物色だよ～！&lt;改行&gt;<BR>
      何が出るかな♪&lt;タブ&gt;何が出るかな♪&lt;改行&gt;<BR>
      #i1&lt;改行&gt;<BR>
      名無し少女の&lt;タブ&gt;等身大ＰＯＰ～！！&lt;改行&gt;<BR>
      漢(おとこ)だねぇ、&lt;タブ&gt;お兄ちゃん………。&lt;改行&gt;<BR>
      #f1&lt;改行&gt;<BR>
      b&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR><BR>

## **4. 画像ファイル名**
イベントスクリプトの1行目には、そのスクリプト内で使用する画像ファイル名(常駐している茜画像はいりません)を&lt;タブ&gt;で区切ってならべます。拡張子は取ってください。最大3つまでです。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>&lt;画像ファイル名1&gt;&lt;タブ&gt;&lt;画像ファイル名2&gt;&lt;タブ&gt;&lt;画像ファイル名3&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE><BR>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>e4&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

## **5. メッセージ**
ウィンドウに1回で表示できるメッセージを記述します。1行全角9文字(半角18文字)で、最大3行まで使えます。行ごとに&lt;タブ&gt;区切りで並べます。絵文字は色が機種によって異なるので注意してください。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>&lt;メッセージ1行目&gt;&lt;タブ&gt;&lt;メッセージ2行目&gt;&lt;タブ&gt;&lt;メッセージ3行目&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>抜き打ち！&lt;タブ&gt;お兄ちゃんのお部屋&lt;タブ&gt;チェーック！！&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE><BR>
<BR>

## **6. 命令**
イベントスクリプトの命令には、以下の5種類があります。
- **イベント画像表示**
- **茜画像変更**
- **友好度変更**
- **友好度ジャンプ**
- **バイブレーション**
<BR><BR>

### **6-1. イベント画像表示**

イベント画像を表示します。再び命令で変更しなければ、スクリプト終了時まで表示し続けます。イメージ番号にはイベントスクリプトの1行目で指定した画像ファイル名中で、左から何番目の画像を表示するかを指定します。0を指定すると常駐している茜画像に戻ります。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>#i&lt;イメージ番号&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#i1&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

### **6-2. 茜画像変更**

アプリに常駐している茜画像を変更します。拡張子は取ってください。画像を読み込んでいる時に表示するメッセージも指定します。<BR>
<BR>
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>#a&lt;2-255&gt;&lt;タブ&gt;&lt;メッセージ&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#a3&lt;タブ&gt;変身～!&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

### **6-3. 画面塗り潰し**
茜画像を表示しないで、画面を一色で塗り潰します。RGBの16進数文字列を指定します。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>#c&lt;0-FF&gt;&lt;0-FF&gt;&lt;0-FF&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#cFF0000&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR><BR>

### **6-4. 友好度変更**

友好度に任意の値(マイナスでもOK)を加算します。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>#f&lt;友好度に加算する値&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#f1&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE><BR><BR>

### **6-5. 友好度ジャンプ**

友好度が任意の値以上の時、それ以降の命令を処理しないで、他のイベントスクリプトにジャンプします。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>#j&lt;任意の友好度の値&gt;&lt;タブ&gt;&lt;ジャンプ先スクリプト名&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#j90&lt;タブ&gt;t5a&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

### **6-6. バイブレーション**

少しの間バイブレーションで携帯を揺らします。P503iシリーズ、F503iシリーズ、N503iシリーズで動作します。端末でバイブレーション機能をONにしておく必要があります。<BR>
<BR>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>#v&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

## **7. 終了時の処理**

イベントスクリプトの最終行には終了時の処理を記述します。終了時の処理には以下の4種類があります。

- **ボタン**
- **アプリ終了**
- **ジャンプ**
- **選択肢**
<BR>
<BR>

### *7-1. *ボタン**

「トーク」ボタンと「さよなら」ボタンの画面に移ります。
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>b&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR>
<BR>

### **7-2. アプリの終了**

アプリを強制的に終了します。
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>e&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<BR><BR>

### **7-3. ジャンプ**

別のイベントスクリプトに移ります。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>j&lt;移動先スクリプト名&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>j10a&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE><BR>
<BR>

### **7-4. 選択肢**

1～3つの選択肢の画面に移ります。
<TABLE border="1">
  <CAPTION>書式</CAPTION>
  <TBODY>
    <TR>
      <TD>&lt;選択肢メッセージ1&gt;&lt;タブ&gt;&lt;ジャンプスクリプト1&gt;&lt;タブ&gt;&lt;選択肢メッセージ2&gt;&lt;タブ&gt;&lt;ジャンプスクリプト2&gt;&lt;タブ&gt;&lt;選択肢メッセージ3&gt;&lt;タブ&gt;&lt;ジャンプスクリプト3&gt;&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>
<TABLE border="1">
  <CAPTION>使用例</CAPTION>
  <TBODY>
    <TR>
      <TD>知りたい！&lt;タブ&gt;0a&lt;タブ&gt;べつに…。&lt;タブ&gt;0b&lt;改行&gt;</TD>
    </TR>
  </TBODY>
</TABLE>