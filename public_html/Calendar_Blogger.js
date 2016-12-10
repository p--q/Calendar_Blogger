// Calendar_Bloggerモジュール
var Calendar_Blogger = Calendar_Blogger || function() {
    var cl = {
        callback: {
            getArticles: function(json) {  // 指定した月のフィードを受け取るコールバック関数。
                Array.prototype.push.apply(vars.posts, json.feed.entry);// 投稿のフィードデータを配列に追加。
                if (json.feed.openSearch$totalResults.$t < vars.max) {  // 取得投稿数がvars.maxより小さい時はすべて取得できたと考える。
//                    vars.posts.forEach(function(e){
//                        var href = e.link[4].href;  // 投稿のurl
//                        var title = e.link[4].title;  // 投稿のtitle
//                        var pub = e.published.$t;
//                        var up = e.updated.$t;
//                    })
                    
                    createCalendar();
                    
                    
                    
                    
                } else {  // 未取得のフィードを再取得する。
                    var m = /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d)\.\d\d\d(.\d\d:\d\d)/i.exec(json.feed.entry[json.feed.entry.length-1][vars.poru].$t);
                    var dt = new Date;
                    dt.setTime(new Date(m[1] + m[2]).getTime() - 1 * 1000);  // 1秒早める。
                    if (vars.m==dt.getMonth()+1) {
                        var max = vars.y + "-" + fm(vars.m) + "-" + fm(dt.getDate()) + "T" + fm(dt.getHours()) + ":" + fm(dt.getMinutes()) + ":" + fm(dt.getSeconds()) + "%2B09:00";
                        createURL(max);                       
                    }
                }  
            }
        },
        all: function(elemID) {  // ここから開始する。
            vars.elem = document.getElementById(elemID);  
            if (vars.elem) {  
                var dt = new Date(2013,8,1);  // 月は-1になっている。
                createVars(dt);
                var max = vars.y + "-" + fm(vars.m) + "-" + fm(vars.em) + "T23:59:99%2B09:00";
                createURL(max);
            } 
        }        
    };  // end of cl
    var vars = {
        y: null,  // 年。
        m: null,  // 月。
        em: null,  //月末。
        max: 150,  // Bloggerのフィードで取得できる最大投稿数。
        posts: [], // 投稿のフィードデータの配列。
        poru: "published",  // publishedかupdated。
        elem: null  // 置換するdiv要素。
    };
    function createVars(dt) {
        vars.y = dt.getFullYear();
        vars.m = dt.getMonth() + 1; 
        vars.em = new Date(vars.y, vars.m+1, 0).getDate();  // 月末の日付を取得。
    }
    function createCalendar() {  // URLからラベル名と現在のページ番号を得、その後総投稿数を得るためのフィードを取得する。
        
        var re = /\d\d(?=T\d\d:\d\d:\d\d\.\d\d\d.\d\d:\d\d)/i;
        var dicdays = {};  // アンカーをつける日のデータを入れる辞書。
        var aday;
        vars.posts.forEach(function(e){
            aday = Number(re.exec(e[vars.poru].$t));
            dicdays[aday] = dicdays[aday] || [];
            dicdays[aday].push([e.link[4].href, e.link[4].title]);   
            }
        );
        var day =  new Date(vars.y, vars.m, 1).getDay();  // 1日の曜日を取得。日曜日は0、土曜日は6になる。
        var clNode = createElem("div");  // カレンダーを入れるdiv要素を作成。
        clNode.style.display = "flex";
        clNode.style.flexWrap = "wrap";
        var dNode = createElem("div");
        dNode.style.flexBasis = "14%";
        dNode.style.flexGrow = "1";
        dNode.style.textAlign = "center";
        for(var i = 0; i < day; i++) { // 1日までの空白を取得。
            var eNode = dNode.cloneNode(true);         
            clNode.appendChild(eNode);
        }
        for(var i = 1; i < vars.em+1; i++) { 
            var daNode = dNode.cloneNode(true);
            if (i in dicdays) {
                daNode.appendChild(createElem("a"));
                daNode.firstChild.textContent = i;  // 日付を取得。
                daNode.firstChild.href = "#";
                dicdays[i].forEach(function(e){
                    daNode.firstChild.title += (daNode.firstChild.title)?"\n" + e[1]:e[1];
                });
//                daNode.firstChild.tooltip.backgroundColor = "black";
                
            } else {
                daNode.textContent = i;  // 日付を取得。
            }
            clNode.appendChild(daNode);
        }
        var s = (day+vars.em) % 7;  // 7で割ったあまりを取得。
        if (s > 0) {  // 7で割り切れない時。
            for(var i = 0; i < 7-s; i++) { // 月末以降の空白を取得。
                var eNode = dNode.cloneNode(true);
                clNode.appendChild(eNode);
            }        
        }
        clNode.onmouseover = popUpTitles;
        
        
        vars.elem.appendChild(clNode);
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
    function createURL(max) { 
        var url = "/feeds/posts/summary?alt=json-in-script&orderby=" + vars.poru + "&" + vars.poru + "-min=" + vars.y + "-" + fm(vars.m) + "-01T00:00:00%2B09:00&" + vars.poru + "-max=" + max;  // フィードを取得するためのURL。
        url += "&callback=Calendar_Blogger.callback.getArticles&max-results=" + vars.max;
        writeScript(url); 
    }        
    function fm(m) {  // 数値を2桁の固定長にする。
        return ("0" + m).slice(-2);
    }
    function popUpTitles(e) {
        e=e||event; // IE sucks
        var target = e.target||e.srcElement; // targetはaになる。// and sucks again // target is the element that has been clicked
        if (target.firstChild) {
            target.firstChild.textContent
            
            
            
            return false; // stop event from bubbling elsewhere
        }        
        
        
    }


    
    return cl;
}();

Calendar_Blogger.all("calendar_blogger");

