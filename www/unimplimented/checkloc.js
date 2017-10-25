document.addEventListener('pageinit',function(page){
    if(page.target.id=="getloc"){
      
    navigator.geolocation.getCurrentPosition(onSuc, onErr);
    }
  }
);
var Latlng;
var marker;
function onSuc(position){
      // 4. Google Maps APIの位置情報オブジェクトを生成
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var latlng = new google.maps.LatLng(latitude, longitude);        

        	
      // 5. 地図を表示
      map = new google.maps.Map(getmapcanv, {
        zoom: 14,       // ズームレベル
        center: latlng 	// 中心地を指定
      });
			
     marker = new google.maps.Marker({position: latlng, map: map, animation: google.maps.Animation.DROP});
     
      addlistener(map);
      
    }
	
    // 7. 現在地取得に失敗した場合の処理
    function onErr(error){
      console.log(JSON.stringify(error));
    }
    
    function addlistener(map){
        google.maps.event.addListener(map, 'mousedown', function (event) {
       start = new Date().getTime();
    });

    google.maps.event.addListener(map, 'mouseup', function (event) {
        if (start) {
            end = new Date().getTime();
            longpress = (end - start < 500) ? false : true;
            
            if(longpress){
               marker.setMap(null);
              
                 Latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());   
                marker = new google.maps.Marker({position: Latlng, map: map, animation: google.maps.Animation.DROP});     
            }
        }
    });
    }
    
    function doneloc(){
        var pos = marker.getPosition();
var lat = pos.lat();
var lng = pos.lng();
 document.getElementById("datamapx").value = lat;
        document.getElementById("datamapy").value = lng;
        myNavigator.popPage();
    }