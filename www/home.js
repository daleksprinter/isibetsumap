//データベースからサムネイルを作成
document.addEventListener('pageinit', function (page) {
    if (page.target.id == "home") {　　　　
        $("#photo").empty(); //子要素の初期化
        var db = openDatabase("database", "1.0", "testdatabase", 1000000);

        db.transaction(
            function (tr) {
                tr.executeSql("SELECT id,imagedata FROM Spot", [], function (rt, rs) {
                    var l = rs.rows.length;
                    //作ったサムネイル要素を追加

                    //ヒーローイメージをランダムな画像で表示
                    var hero = Math.floor( Math.random() * (l + 1) );
                    $("#firstPhoto")[0].appendChild(create_thumbnail(rs.rows.item(hero).id, rs.rows.item(hero).imagedata, (screen.width - 1), (screen.width - 1)));

                    /*
                  正規画像が揃ったらコメントアウトを外す
                for(var i=1;i<l;i++){
                 $("#photo")[0].appendChild( create_thumbnail(rs.rows.item(i).id,rs.rows.item(i).imagedata,(screen.width-0.2)/3,(screen.width-0.2)/3));
                   */
                    //現在の画像を5倍分表示して量ごまかし
                    for (var i = 1; i < l * 5; i++) {
                        $("#photo")[0].appendChild(create_thumbnail(rs.rows.item(i % l).id, rs.rows.item(i % l).imagedata, (screen.width - 6) / 3, (screen.width - 6) / 3));

                    }
                });
            });

        }
});


function create_thumbnail(id, src, width, height) {
    //ボタン要素を作成
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.setAttribute('class', 'unselected');
    button.setAttribute('onclick', 'load_detail(this.id)');
    button.appendChild(img(src, width, height));
    return button;
}


function img(src, width, height) {
    var image = document.createElement('img');
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
}
