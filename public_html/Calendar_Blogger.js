// Calendar_Bloggerモジュール
var Calendar_Blogger = Calendar_Blogger || function() {
    var cl = {
        all: function(elemID) {  // ここから開始する。
            vars.elem = document.getElementById(elemID);  
            if (vars.elem) {  
                createCalendar();
            } 
        }        
        
    };  // end of cl
    var vars = {
        elem : null
        
        
        
    };
    
    
    function createCalendar() {  // URLからラベル名と現在のページ番号を得、その後総投稿数を得るためのフィードを取得する。
        var today = new Date(); 
        
        
        
        
//        var thisUrl = location.href;  // 現在表示しているURL。
//        if (/\/search\/label\//i.test(thisUrl)) {  // ラベルインデックスページの場合URLからラベル名を取得。
//            vars.postLabel = /\/search\/label\/(.+)(?=\?)/i.exec(thisUrl)[1];  // 後読みは未実装の可能性あるので使わない。
//        } 
//        if (!/\?q=|\.html$/i.test(thisUrl)) {  // 検索結果や固定ページではないとき。
//            vars.currentPageNo = (/#PageNo=/i.test(thisUrl))?/#PageNo=(\d+)/i.exec(thisUrl)[1]:1;  // URLから現在のページ番号の取得。
//            var url;  // フィードを取得するためのURL。
//            if (vars.postLabel) {  // 総投稿数取得のためにフィードを取得するURLの作成。ラベルインデックスのときはそのラベル名の総投稿数を取得するため。
//                url = '/feeds/posts/summary/-/' + vars.postLabel + "?alt=json-in-script&callback=PageNavi2_Blogger.callback.getTotalPostCount&max-results=1";          
//            } else {
//                url = "/feeds/posts/summary?max-results=1&alt=json-in-script&callback=PageNavi2_Blogger.callback.getTotalPostCount";
//            }
//            writeScript(url); 
//        }
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
    
    
    return cl;
}();

