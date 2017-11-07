var list={};//コース選択されたスポットデータのリスト
var list_count;
var findLi;//サムネイル要素
var key_val = {};//インデックスとキーの連想配列
var val_key={};
var index;

function spot_select(){
    //完了、キャンセルボタンを表示
    $('#spot')[0].style.display="none";
    $('#done')[0].style.display="inline";
    $('#cancel')[0].style.display="inline";
    $('#refine')[0].style.display="none";

    //リストの初期化。メモリの解放がされていない?
    for(var key in list){
      delete list[key];
    }

     list_count = $("#photo")[0].childElementCount;
     findLi =$('#photo')[0].children;

     //全てのサムネイルに押下されたら選択される関数を割り当て
     for (var i = 0; i < list_count; i++){
        findLi[i].setAttribute('onclick','check(this)');
     }
}

//押下されたサムネイルの選択状態を判定
function check(elm){
    //キャンセルの処理
    if(String(elm.id) in list){
        delete list[String(elm.id)];
        elm.setAttribute('class','unselected');
    }else{
        //選択の処理
        var db = openDatabase("database", "1.0", "testdatabase", 1000000);
        db.transaction(
         function(tr){
             tr.executeSql("SELECT * FROM Spot INNER JOIN Tag ON Spot.tagid = Tag.id WHERE Spot.id = ?",[elm.id],function(rt,rs){

                 list[String(elm.id)] = rs.rows.item(0);
             });
        });
        elm.setAttribute('class','selected');
    }
}

//完了ボタンを押した時の処理
function done(){
  if(Object.keys(list).length === 0){
        alert("選択されていません");
    }else{
        myNavigator.pushPage('map.html');
        $('#spot')[0].style.display="inline";
   　　  $('#done')[0].style.display="none";
        $('#cancel')[0].style.display="none";
        $('#refine')[0].style.display="inline";

        for(var i = 0; i<list_count;i++){
            findLi[i].setAttribute('class','unselected');
            findLi[i].setAttribute('onclick','load_detail(this.id)');
        }
  }
}

function cancel(){
    $('#spot')[0].style.display="inline";
    $('#done')[0].style.display="none";
    $('#cancel')[0].style.display="none";
    $('#refine')[0].style.display="inline";

    for(var i = 0; i<list_count;i++){
        findLi[i].setAttribute('class','unselected');
        findLi[i].setAttribute('onclick','load_detail(this.id)');
    }
}

var root_map;
var directionsRenderer = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();

document.addEventListener('pageinit',function(page){
   if(page.target.id == "map"){
     index=0;
       //初期マップの中心地用の座標
       var lati = 41.733614;
       var long = 140.578877;
       var latlng = new google.maps.LatLng(lati,long);

       //マップ描画
       root_map = new google.maps.Map($('#rootmap')[0], {
        zoom: 14,       // ズームレベル
        center: latlng     // 中心地を指定
        });
        directionsRenderer.setMap(root_map);

      //親要素にタッチイベントが伝達しないようにする
      carousel.addEventListener('touchmove',function(event){
        event.preventDefault();
      });

      //カローセルが移動した時の処理
      carousel.addEventListener('postchange',function(event){
        navigator.geolocation.getCurrentPosition( routecalc , errorFunc , optionObj ) ;
      });

      //リストの数だけカローセルアイテムを生成
     for(var key in list){
         key_val[index] = key;
         val_key[key]=index;
         index++;

         var carousel_item = document.createElement('ons-carousel-item');

       //長押しでカローセル削除処理
        carousel_item.addEventListener('touchstart', function(event) {
            start = new Date().getTime();
        });

        carousel_item.addEventListener('touchend', function(event) {

        if (start) {
            end = new Date().getTime();
            longpress = (end - start < 300) ? false : true;

            if(longpress && index-2 > 1){
              //  data = list[this.id];
                this.remove();
                carousel.refresh();
                index -= 1;
                console.log(index);
            }
        }
        });

         carousel_item.appendChild(img(list[key].imagedata,130,130));
      　 carousel_item.appendChild(text(list[key].title,'txt'));
      // carousel_item.appendChild(text(list[key].info,'txt')); //よくわからん
         document.getElementById('carousel').appendChild(carousel_item);


      //マップにマーカーを設置
        lati = list[key].latitude;
        long = list[key].longitude;
        latlng = new google.maps.LatLng(lati,long);

        var marker = new google.maps.Marker({position: latlng, map: root_map,id:index});
        marker.addListener( "click", function ( argument ) {
            console.log( this.get('id') );
            carousel.setActiveIndex(this.get('id'));
        }) ;
        console.log(index);

     }

　　　//追加のマップ操作
      navigator.geolocation.getCurrentPosition(routecalc, errorFunc , optionObj ) ;

    }
});


function text(text,cls){
    var txt = document.createElement('p');
    txt.textContent = text;
    txt.setAttribute('class',cls);
    return txt;
}

function successFunc(position){
    var lati = position.coords.latitude;
    var long = position.coords.longitude;
    var latlng = new google.maps.LatLng(lati,long);
    var marker = new google.maps.Marker({position: latlng, map: root_map});
}

function errorFunc(error){
    console.log('error');
}

var optionObj = {};

//２点間のルートをマップに描画
function routecalc(position){
  // 開始地点の座標を指定
        var start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
   // 目的地点の座標を指定
        var goal = new google.maps.LatLng(list[key_val[carousel.getActiveIndex()]].latitude,list[key_val[carousel.getActiveIndex()]].longitude);

        // origin と destination に変数を指定
        var request = {
        origin:start,
        destination:goal,
        travelMode: google.maps.TravelMode.WALKING
        };
 　　　　
        directionsService.route(request, function(result, status) {
            console.log(status);

              if (status == google.maps.DirectionsStatus.OK) {


             directionsRenderer.setDirections(result);
             }
        });

}
