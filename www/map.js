var list={};//コース選択されたスポットデータのリスト

var findLi;//サムネイル要素
var findli_child;//サムネイル要素の数


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

     findli_child = $("#photo")[0].childElementCount;
     findLi =$('#photo')[0].children;

     //全てのサムネイルにcheck()を割り当て
     for (var i = 0; i < findli_child; i++){
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
  if(Object.keys(list).length == 0){
        alert("選択されていません");
    }else{
        myNavigator.pushPage('map.html');
        $('#spot')[0].style.display="inline";
   　　  $('#done')[0].style.display="none";
        $('#cancel')[0].style.display="none";
        $('#refine')[0].style.display="inline";

        for(var i = 0; i<findli_child;i++){
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

    for(var i = 0; i<findli_child;i++){
        findLi[i].setAttribute('class','unselected');
        findLi[i].setAttribute('onclick','load_detail(this.id)');
    }
}

var root_map;
var directionsRenderer = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();


var marker_list=new google.maps.MVCArray();;


document.addEventListener('pageinit',function(page){
   if(page.target.id == "map"){

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


      //カローセルが移動した時の処理
      carousel.addEventListener('postchange',function(event){
        navigator.geolocation.getCurrentPosition( routecalc , errorFunc , optionObj ) ;
      });

      //カルーセルのタッチ操作イベントが親ノードに伝達しないようにする
　　　　　carousel.addEventListener('touchmove',function(event){
    　　　　　event.preventDefault();
　　　　　});
        //マップのタッチ操作イベントが親ノードに伝達しないようにする
        $('#rootmap')[0].addEventListener('touchmove',function(event){
            event.preventDefault();
        });

      //リストの数だけカローセルアイテムを生成
     for(var key in list){

         var carousel_item = document.createElement('ons-carousel-item');//カルーセルアイテム要素を作成
         carousel_item.setAttribute('class','crsl');//カルーセルアイテムにクラスを割り当て
　　　　　
         //カルーセルアイテムにスポット情報を追加
         var card = document.createElement('div');
         carousel_item.appendChild(img(list[key].imagedata,130,130));
      　 carousel_item.appendChild(text(list[key].title,'txt'));
         carousel_item.setAttribute('id',key);
      　 carousel_item.appendChild(card);
      　 document.getElementById('carousel').appendChild(carousel_item);


       //長押しでカローセル削除する処理をカルーセルアイテムに割り当て
  　　　　carousel_item.addEventListener('touchstart',function(event){
              start = new Date().getTime();
         });

        carousel_item.addEventListener('touchend',function(event){
           var id = this.id
           if(start){
              end = new Date().getTime();
              longpress = (end - start < 300) ? false : true;
              //長押し判定がされた場合の処理
              if(longpress){
              	//カルーセルの要素数が１未満にならないよう制御
                 if(carousel.itemCount > 1){
                 	//全マーカーを取得し、押されたカルーセルアイテムのIDと同じIDを持つマーカーを探す
                     marker_list.forEach(function(marker,i){
                       if(marker.get('id')　==　id){
                         marker.setMap(null);//マーカーの削除処理
                       }
                    });
                     delete list[id];//リストからスポットデータの削除
                     this.remove();//カルーセルアイテムの削除処理
                     carousel.setActiveIndex(0);
                     carousel.refresh();
                }
              }
           }
        });
 　　

      　　//カルーセルにカルーセルアイテムを追加
         carousel.appendChild(carousel_item);


　　　//マーカーに関する処理
      　//マップにマーカーを設置
        lati = list[key].latitude;
        long = list[key].longitude;
        latlng = new google.maps.LatLng(lati,long);

        var marker = new google.maps.Marker({position: latlng, map: root_map,id:key,label:{text:key}});
        marker_list.push(marker);


　　　　　//マーカーがタップされた時の処理。対応するカルーセルを表示する
        marker.addListener( "click", function ( argument ) {
             carousel.setActiveIndex(get_idx(this.get('id')));
        }) ;


     }

　　　//カルーセルの追加を完了したあとルート探索
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

//現在位置から表示されているカルーセルへのルートをマップに描画
function routecalc(position){
  // 開始地点の座標（現在位置）を指定
        var start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
   // 目的地点の座標（表示されているカルーセル）を指定
        var goal = new google.maps.LatLng(list[get_key(carousel.getActiveIndex())].latitude,list[get_key(carousel.getActiveIndex())].longitude);

        // origin と destination に変数を指定
        var request = {
        origin:start,
        destination:goal,
        travelMode: google.maps.TravelMode.WALKING
        };
 　　　　
        directionsService.route(request, function(result, status) {
        　 if (status == google.maps.DirectionsStatus.OK) {
             　　directionsRenderer.setDirections(result);
          }
        });
}

//インデックス番号からIDを取得する
function get_key(i){
  var t=0;
  for(var key in list){
    if(t == i){
        return key;
    }
    t++;
  }
}

//IDからインデックス番号を取得する
function get_idx(k){
    var t=0;
    for(var key in list){
        if(k == key){
            return t;
        }
        console.log(t);
        t++;
    }
  }

 
