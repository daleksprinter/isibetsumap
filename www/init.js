function load_database(){
    //テーブル初期化
   delete_table();
   
    //スポットデータの読み込み
   $.ajax({
        type:"GET",
        url:"http://test1492.php.xdomain.jp/getspot.php",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
       async: false,
        success:function(data,dataType){
　　　　  var l = data.length;
　　　  　for(var i = 0; i < l;i++){
　　　　 　　 insertSpot(data[i].id ,data[i].title ,data[i].info ,data[i].time ,data[i].season ,data[i].imagedata ,data[i].tagid);
　　　  　}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
           alert('Error : ' + errorThrown);
           $("#XMLHttpRequest").html("XMLHttpRequest : " + XMLHttpRequest.status);
           $("#textStatus").html("textStatus : " + textStatus);
           $("#errorThrown").html("errorThrown : " + errorThrown);
      }
    });
    
    //タグデータの読み込み
    $.ajax({
        type:"GET",
        url:"http://test1492.php.xdomain.jp/gettag.php",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        success:function(data,dataType){
        
　　　　  var l = data.length;
　　　  　for(var i = 0; i < l;i++){
　　　　 　　 insertTag(data[i].id ,data[i].name,data[i].latitude,data[i].longitude,data[i].opentime,data[i].endtime,data[i].slope);　    
　　　  
　　　  　}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
           alert('Error : ' + errorThrown);
           $("#XMLHttpRequest").html("XMLHttpRequest : " + XMLHttpRequest.status);
           $("#textStatus").html("textStatus : " + textStatus);
           $("#errorThrown").html("errorThrown : " + errorThrown);
      }
    })
    
}

//WebSQL挿入用関数
function insertSpot(id,title,info,time,season,imagedata,tagid){
     var db = openDatabase("database", "1.0", "testdatabase", 1000000);
     db.transaction(
         function(tr){
          tr.executeSql('CREATE TABLE IF NOT EXISTS Spot (id PRIMARY KEY,title,info,time,season,imagedata,favorite,tagid INTEGER)',[],function(){
          });
          tr.executeSql("INSERT INTO Spot VALUES(?,?,?,?,?,?,'false',?)",[id,title,info,time,season,imagedata,tagid],function(rt,rs){
          });
        }
     );
}
function insertTag(id,name,latitude,longitude,opentime,endtime,slope){
    var db = openDatabase("database", "1.0", "testdatabase", 1000000);
     db.transaction(
         function(tr){
          tr.executeSql('CREATE TABLE IF NOT EXISTS Tag (id PRIMARY KEY,name,latitude,longitude,opentime INTEGER,endtime INTEGER,slope)',[],function(){
          });
          tr.executeSql("INSERT INTO Tag VALUES(?,?,?,?,?,?,?)",[id,name,latitude,longitude,opentime,endtime,slope]);
        }
     );
}

function delete_table(){
    
    var db = openDatabase("database", "1.0", "testdatabase", 1000000);
    
    db.transaction(
        function(tr){
            tr.executeSql('DROP TABLE IF EXISTS Spot');
            tr.executeSql('DROP TABLE IF EXISTS Tag');
            
        }
    );
}