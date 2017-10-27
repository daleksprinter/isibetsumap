document.addEventListener('pageinit',function(page){
   if(page.target.id == "databaseadmin"){
       document.getElementById("spotdata").style.display="none";
     var db = openDatabase("database", "1.0", "testdatabase", 1000000);
     db.transaction(
         function(tr){
             tr.executeSql("SELECT * FROM SpotTag",[],function(rt,rs){
                 var l= rs.rows.length;
                 var spotselectbox = document.getElementById("selectspot");
                 for(var i=0;i<l;i++){
                    var option = document.createElement('option');
                    option.setAttribute('value', rs.rows.item(i).id);
                    option.innerHTML = rs.rows.item(i).title;
                    spotselectbox.appendChild(option);
                 }
                 var option = document.createElement('option');
                    option.setAttribute('value', "other");
                    option.innerHTML = "その他";
                    spotselectbox.appendChild(option);
                 
             });
         }); 
         
           var option = document.createElement('option');
                    option.setAttribute('value', "other");
                    option.innerHTML = "その他";
                    spotselectbox.appendChild(option);
   } 
});

function showspotform(){
    if(document.getElementById("selectspot").value=='other'){
        document.getElementById("spotdata").style.display="block";
    }else{
        document.getElementById("spotdata").style.display="none";
    }
}

var imagebase64;
function snapphoto(){
        
        navigator.camera.getPicture (onSuccess, onFail, 
            { quality: 50, destinationType: Camera.DestinationType.DATA_URL,allowEdit:true});
        
        function onSuccess (imageData) {
       
              var image = document.getElementById ('viewgetphoto');
            image.src = "data:image/jpeg;base64," + imageData;
         imagebase64 = image.src;
       console.log("自動で撮影時間、季節、場所を挿入します");
       var date = new Date();
      /* document.getElementById("datatime").value = gettime(date);
       document.getElementById("dataseason").value = getseason(date);*/
        document.getElementById("photodata").style.display="none";
       
       
       
        }

        //A callback function when snapping picture is fail.
        function onFail (message) {
            alert ('Error occured: ' + message);
        }

} 

function getphoto(){
     navigator.camera.getPicture (onSuccess, onFail, 
            { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,allowEdit:true});
        
        function onSuccess (imageData) {
       
              var image = document.getElementById ('viewgetphoto');
                image.src = "data:image/jpeg;base64," + imageData;
                  imagebase64 = image.src;
                  document.getElementById(imagestr).textContent=imagebase64;
          
        }

        //A callback function when snapping picture is fail.
        function onFail (message) {
            alert ('Error occured: ' + message);
        }
}
/*
function getlocation(){
   
  var suc = function(position){
        document.getElementById("datamapx").value = position.coords.latitude;
        document.getElementById("datamapy").value = position.coords.longitude;
    };
    var err = function(message){
        
    };
    var option = {
      frequency: 5000,
      timeout: 6000
     };
      navigator.geolocation.getCurrentPosition( suc , err , option ) ;
}*/

function insert(){
   
     var db = openDatabase("database", "1.0", "testdatabase", 1000000);
         
    var id = document.getElementById("dataid").value
     var title = document.getElementById("datatitle").value;
     var info = document.getElementById("datainfo").value;
  
 
     db.transaction(
         function(tr){
           tr.executeSql('INSERT INTO TestTable VALUES(?,?,?,?,?,?,?,?,?,?,?)',[id,title,info,"","","","","","","",imagebase64] );
              
         }
         );
}
  

function init(){
    
    var db = openDatabase("database", "1.0", "testdatabase", 1000000);
    
    db.transaction(
        function(tr){
            tr.executeSql('DROP TABLE IF EXISTS TestTable');
        }
    );
}
