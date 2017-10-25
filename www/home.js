//データベースからサムネイルを作成
document.addEventListener('pageinit',function(page){
   if(page.target.id == "home"){
　　　　$("#photo").empty();//子要素の初期化
        var db = openDatabase("database", "1.0", "testdatabase", 1000000);
        db.transaction(
         function(tr){
             tr.executeSql("SELECT id,imagedata FROM Spot",[],function(rt,rs){
                 var l= rs.rows.length;
                 for(var i=0;i<l;i++){
                  //作ったサムネイル要素を追加
                  $("#photo")[0].appendChild( create_thumbnail(rs.rows.item(i).id,rs.rows.item(i).imagedata,94,94) );
                 }
             });
     });  
   } 
});


function create_thumbnail(id,src,width,height){
    //ボタン要素を作成
    var button = document.createElement('button');
    button.setAttribute('id',id);
    button.setAttribute('class', 'unselected');
    button.setAttribute('onclick','load_detail(this.id)');
    button.appendChild(img(src,width,height));
    return button;
}
   
     
function img(src,width,height){  
    var image = document.createElement('img');
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
}