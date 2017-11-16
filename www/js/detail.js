var data;//保存用
function int_to_px(size){
    return String(size)+'px';
}

function load_detail(id){
     var db = openDatabase("database", "1.0", "testdatabase", 1000000);
     //スポットデータを読み込む処理。押された写真のIDと一致するタプルを検索
     db.transaction(
         function(tr){
             tr.executeSql("SELECT * FROM Spot INNER JOIN Tag ON Spot.tagid = Tag.id WHERE Spot.id = ?",[id],function(rt,rs){
                 data = rs.rows.item(0);
                 myNavigator.pushPage('phostone/detail.html');
             });
     });
    
}
var latlng
document.addEventListener('pageinit',function(page){
   if(page.target.id == "detail"){
       
    //画像表示
    var img = $("#image")[0];
    img.src = data.imagedata;
    img.width = screen.width;
    img.height = screen.width;
    img.setAttribute('class','view');
    
    //テキスト表示
    $("#title")[0].textContent = data.title;
    $("#info")[0].textContent = data.info;
    // $("#opentime")[0].textContent = '開店時間: ' + Number(data.opentime)/100 + '時';
    // $("#endtime")[0].textContent = '閉店時間: ' + Number(data.endtime)/100+ '時';

document.getElementById('detail_text').style.width = int_to_px(screen.width-20);
document.getElementById('mapcanv').style.width = int_to_px(screen.width);
document.getElementById('mapcanv').style.height = int_to_px(screen.width);

     latlng = new google.maps.LatLng(data.latitude,data.longitude); 
    var map = new google.maps.Map(mapcanv, {
        zoom: 14,       // ズームレベル
        center: latlng     // 中心地を指定
      });
    var marker = new google.maps.Marker({position: latlng, map: map}); 
    directionsRenderer.setMap(map);
    //navigator.geolocation.getCurrentPosition(view_root,errorFunc,optionObj);
    
   } 
});

//お気に入り登録処理
function check_fav(){
    /*s
    if(data.favorite == 'true'){
        console.log('true');
     var db = openDatabase("database", "1.0", "testdatabase", 1000000);
     db.transaction(
         function(tr){
             tr.executeSql("update Spot set favorite = 'false' where id=?",[data.id],
             function(rt,rs){
               console.log('お気に入りを解除しました');
               $("#fav")[0].textContent = 'お気に入り登録';
             },function(err){
                 console.log('error');
             }
             );
     });
     
    }else if(data.favorite == 'false'){
        console.log('false');
        db.transaction(
         function(tr){
             tr.executeSql("update Spot set season = 'true'",[],callback);
       });
       
    }*/
}

function callback(){
    console.log('suc');
}

function view_root(position){
     var start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude); 
  var request = { 
        origin:start,
        destination:latlng,
        travelMode: google.maps.TravelMode.WALKING
        }; 

        directionsService.route(request, function(result, status) { 
            
              if (status == google.maps.DirectionsStatus.OK) { 
 
          
             directionsRenderer.setDirections(result);
             } 
        }); 
}

