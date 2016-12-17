// Calendar_Bloggerモジュール
var Calendar_Blogger = Calendar_Blogger || function() {
    var cl = {
        callback: {  // コールバック関数。
            getArticles: function(json) {  // 指定した月のフィードを受け取る。
                Array.prototype.push.apply(vars.posts, json.feed.entry);// 投稿のフィードデータを配列に追加。
                if (json.feed.openSearch$totalResults.$t < vars.max) {  // 取得投稿数がvars.maxより小さい時はすべて取得できたと考える。
                    createCalendar();  // フィードデータからカレンダーを作成する。
                } else {  // 未取得のフィードを再取得する。最新の投稿が先頭に来る。
                    var m = /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d)\.\d\d\d(.\d\d:\d\d)/i.exec(json.feed.entry[json.feed.entry.length-1][vars.poru].$t);  // フィードの最終投稿（最古）データの日時を取得。
                    var dt = new Date;  // 日付オブジェクトを生成。
                    dt.setTime(new Date(m[1] + m[2]).getTime() - 1 * 1000);  // 最古の投稿の日時より1秒早めるた日時を取得。ミリ秒に変換して計算。
                    if (vars.m==dt.getMonth()+1) {  // 1秒早めても同じ月ならば
                        var max = vars.y + "-" + fm(vars.m) + "-" + fm(dt.getDate()) + "T" + fm(dt.getHours()) + ":" + fm(dt.getMinutes()) + ":" + fm(dt.getSeconds()) + "%2B09:00";  // フィード取得のための最新日時を作成。
                        createURL(max);  // フィード取得のURLを作成。                       
                    }
                }  
            }
        },
        all: function(elemID) {  // ここから開始する。
            vars.elem = document.getElementById(elemID);  // idから追加する対象の要素を取得。
            if (vars.elem) {  // 追加対象の要素が存在するとき
                var dt = new Date(2013,8,1);  // 日付オブジェジェクト。例の日付データ:2013年9月1日。
                createVars(dt);  // 日付オブジェクトからカレンダーのデータを作成。
                var max = vars.y + "-" + fm(vars.m) + "-" + fm(vars.em) + "T23:59:59%2B09:00";  // 表示カレンダーの最終日23時59分59秒までのフィードを得るための日時を作成。
                createURL(max);  // フィードを取得するためのURLを作成。
            } 
        }        
    };  // end of cl
    var vars = {  // モジュール内の"グローバル"変数。
        y: null,  // 表示カレンダーの年。
        m: null,  // 表示カレンダーの月。
        em: null,  //表示カレンダーの末日。
        max: 150,  // Bloggerのフィードで取得できる最大投稿数を設定。
        posts: [],  // 投稿のフィードデータを収納する配列。
        poru: "published",  // publishedかupdatedが入る。
        elem: null,  // 置換するdiv要素。
        tt: null, // ツールチップを表示させているノード。
        timer: null,  // timeoutID
        delay: 30  // タイムアウトするミリ秒。
    };
    function createVars(dt) {  // 日付オブジェクトからカレンダーのデータを作成。
        vars.y = dt.getFullYear();  // 表示カレンダーの年を取得。
        vars.m = dt.getMonth() + 1;  // 表示カレンダーの月を取得。
        vars.em = new Date(vars.y, vars.m-1, 0).getDate();  // 表示カレンダーの末日を取得。
    }
    function createCalendar() {  // フィードを元にカレンダーのHTML要素を作成。
        
        
        var re = /\d\d(?=T\d\d:\d\d:\d\d\.\d\d\d.\d\d:\d\d)/i;  //  フィードの日時データから日を取得するための正規表現パターン。
        var dicdays = {};  // キーを日、値を投稿のURLと投稿タイトルの配列、とする辞書。
        var aday;  // 投稿がある日。
        vars.posts.forEach(function(e){  // 投稿のフィードデータについて
            aday = Number(re.exec(e[vars.poru].$t));  // 投稿の日を取得。
            dicdays[aday] = dicdays[aday] || [];  // 辞書の値の配列を初期化する。
            dicdays[aday].push([e.link[4].href, e.link[4].title]);  // 辞書の値の配列に[投稿のURL, 投稿タイトル]の配列を入れて2次元配列にする。
            }
        );


        var day =  new Date(vars.y, vars.m-1, 1).getDay();  // 1日の曜日を取得。日曜日は0、土曜日は6になる。
   
        
        var clNode = createElem("div");  // カレンダーのdiv要素を生成。
        clNode.style.display = "flex";  // flexコンテナにする。
        clNode.style.flexWrap = "wrap";  // flexコンテナの要素を折り返す。
//        clNode.style.padding = "2px";  // flexコンテナからでるときにイベント発火させるため
        
        
        var dNode = createElem("div");  // flexアイテムになるdiv要素を生成。
        dNode.style.flexBasis = "14%";  // flexアイテムの最低幅を1/7弱にする。
        dNode.style.flexGrow = "1";  // flexコンテナの余剰pxを均等に分配する。
        dNode.style.textAlign = "center";  // flexアイテムの内容を中央寄せにする。
        
        
        for(var i = 0; i < day; i++) { // 1日までの空白となるflexアイテムを開始曜日分まで取得。
            var eNode = dNode.cloneNode(true);  // flexアイテムを複製。
            eNode.className = "nontooltip";  // 複製したflexアイテムのクラス名を設定。
            clNode.appendChild(eNode);  // flexコンテナに追加。
        }
        
        
        var daNode = dNode.cloneNode(true); // 投稿のある日となるflexアイテムを複製。  
        daNode.style.position = "relative";  // 投稿のある日となるflexアイテムのstyleを設定。 
        daNode.style.display = "inline-block";
        daNode.style.borderBottom = "1px dotted black";
        
        
        var dsNode = createElem("span");  // ツールチップとなるspan要素を生成。
        dsNode.style.visibility = "hidden";  // ツールチップのstyleを設定。
        dsNode.style.width = "120px";
        dsNode.style.backgroundColor = "black";
        dsNode.style.color = "#fff";
        dsNode.style.textAlign = "center";
        dsNode.style.padding = "5px 0";
        dsNode.style.borderRradius = "6px";
        dsNode.style.position = "absolute";
        dsNode.style.zIndex = "1";
        
        
        for(var i = 1; i < vars.em+1; i++) {  // 1日から末日まで。
            if (i in dicdays) {  // 辞書のキーに日があるとき
                var sNode = dsNode.cloneNode(true);  // ツールチップとなるspan要素を複製。
                dicdays[i].forEach(function(e){  // 辞書の値の配列の各要素に対して
                    var aNode = createElem("a");  // aタグを生成。
                    aNode.href = e[0];  // aタグのhrefに投稿のURLを設定。
                    aNode.textContent = e[1];  // aタグのtextノードに投稿のタイトルを設定。
                    sNode.appendChild(aNode);  // aタグの要素をツールチップとなるspan要素の子ノードに追加。
                });
                var Node = daNode.cloneNode(true); // 投稿のある日となるflexアイテムを複製。  
                Node.className = "tooltip";  // 複製したflexアイテムのクラス名を設定。
                Node.textContent = i;  // 日をtextノードに取得。textContentで代入すると子ノードは消えてしまうので最初に取得する。
                Node.appendChild(sNode);  // ツールチップとなるspan要素をflexアイテムの子ノードに追加。  
            } else {  // 辞書のキーに日がないとき
                var Node = dNode.cloneNode(true); // 投稿のない日となるflexアイテムを複製。  
                Node.className = "nontooltip";  // 複製したflexアイテムのクラス名を設定。
                Node.textContent = i;  // 日をtextノードに取得。
            } 
            clNode.appendChild(Node);  // flexコンテナに追加。
        }
        
        
        var s = (day+vars.em) % 7;  // 7で割ったあまりを取得。
        if (s > 0) {  // 7で割り切れない時。
            for(var i = 0; i < 7-s; i++) { // 末日以降の空白を取得。
                var eNode = dNode.cloneNode(true); // 末日以降のflexアイテムを複製。  
                eNode.className = "nontooltip";  // 複製したflexアイテムのクラス名を設定。
                clNode.appendChild(eNode);  // flexコンテナに追加。
            }        
        } 
        
        
        clNode.addEventListener( 'touchstart', touchStart, false );  // タップしたときのイベントハンドラ。mouseoverより先に実行必要。
        clNode.addEventListener( 'mouseover', onMouse, false );  // カレンダーのdiv要素でイベントバブリングを受け取る。マウスが要素に乗ったとき。
        clNode.addEventListener( 'mouseout', offMouse, false );  // カレンダーのdiv要素でイベントバブリングを受け取る。要素に乗ったマウスが要素から下りたとき。
        vars.elem.textContent = null;  // 追加する対象の要素の子ノードを消去する。
        vars.elem.appendChild(clNode);  // 追加する対象の要素の子ノードにカレンダーのノードを追加する。
    }
    function onMouse(e) {  // マウスが要素に乗ったときのイベントを受け取る関数。
        var target = e.target;  // イベントを発生したオブジェクト。
        offTimer();  // ツールチップを消すタイマーをリセットする。タイマーでツールチップ表示を消すのはカレンダー外の要素に出た時のみ。
        if (target.className=="tooltip") {  // ツールチップを持っている日のとき
            offTooltip();  // 現在のツールチップ表示を消す。
            vars.tt = target;  // ツールチップ表示ノードを再取得。
            vars.tt.lastChild.style.visibility = "visible";  // ツールチップを表示させる。   
        } else if (target.className=="nontooltip") {  // ツールチップを持っていない日のとき
            offTooltip();  // 現在のツールチップ表示を消す。
        }
    } 
    function touchStart(e) {  // 要素をタップしたときのイベントを受け取る関数。
        var target = e.target;  // イベントを発生したオブジェクト。 
        if (target.className=="tooltip") {  // ツールチップを持っているノードのとき
            offTooltip();  // ツールチップ表示を消す
            vars.tt = target;  // ツールチップ表示ノードを再取得。
            vars.tt.lastChild.style.visibility = "visible";  // ツールチップを表示させる。  
            window.setTimeout(offTooltip, 5*1000);  // 5秒後に表示を消す。
        }
    }
    function offMouse(e) {  // マウスが要素から出たときのイベントを受け取る関数。
        var target = e.target;  // イベントを発生したオブジェクト。
        if (target.className=="tooltip" || target.tagName=="SPAN") {  // ツールチップを持っているノードからツールチップに入らずに出るとき、またはツールチップから出るとき。ただしその中のaタグに入った時も発火する。
            vars.timer = window.setTimeout(offTooltip, vars.delay);  // ツールチップ表示を消すのをvars.delayミリ秒遅延させ、そのtimeoutIDを取得する。          
        } 
    }
    function offTooltip(){  // ツールチップ表示を消す関数。
        if (vars.tt) {  // ツールチップを表示している時
            vars.tt.lastChild.style.visibility = "hidden"; // ツールチップ表示を消す。
            vars.tt = null;  // ツールチップ表示ノードの取得を取り消す。 
        }
    }
    function offTimer() {  // ツールチップを消すタイマーをリセットする。
        if (vars.timer) {  // 遅延タイマーが設定されている時。
            window.clearTimeout(vars.timer);  // window.setTimeout() によって設定された遅延を解除する。
            vars.timer = null;
        }
    }
    function writeScript(url) {  // スクリプト注入。
        var ws = createElem('script');
        ws.type = 'text/javascript';
        ws.src = url;
        document.getElementsByTagName('head')[0].appendChild(ws);
    }    
    function createElem(tag){  // tagの要素を作成して返す。
       return document.createElement(tag); 
    }       
    function createURL(max) {  // フィードを取得するためのURLを作成。
        var url = "/feeds/posts/summary?alt=json-in-script&orderby=" + vars.poru + "&" + vars.poru + "-min=" + vars.y + "-" + fm(vars.m) + "-01T00:00:00%2B09:00&" + vars.poru + "-max=" + max;  // 1日0時0分0秒からmaxの日時までの投稿フィードを取得。データは最新の投稿から返ってくる。
        url += "&callback=Calendar_Blogger.callback.getArticles&max-results=" + vars.max;  // コールバック関数と最大取得投稿数を設定。
        writeScript(url);  // スクリプト注入でフィードを取得。。
    }        
    function fm(m) {  // 数値を2桁の固定長にする。
        return ("0" + m).slice(-2);
    }
    return cl;  // グローバルスコープにオブジェクトを出す。
}();
Calendar_Blogger.all("calendar_blogger");  // idがcalendar_bloggerの要素にカレンダーを表示させる。

