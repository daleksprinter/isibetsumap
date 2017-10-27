


 
function createbutton(id,method,modifier){
     var btn = document.createElement("ons-button");
                      btn.setAttribute("id",id);
                      btn.setAttribute("onclick", method);
                      btn.setAttribute("modifier", modifier);
                      return btn;
                     
}

function refineimg(){
    var db = openDatabase("database", "1.0", "testdatabase", 1000000);
   $("#photo").empty();
    
    var now = new Date();
    var nownum = now.getHours()*100+now.getMinutes();
    console.log(nownum);
    var time   = gettime(now);
    var season = getseason(now);
   console.log(time,season,flug(seasonbtn));
    
    db.transaction(
         function(tr){
            tr.executeSql("SELECT * FROM TestTable WHERE 1==? ",[flug(seasonbtn)],function(rt,rs){
                 var l= rs.rows.length;
                console.log("refining");
               
          //console.log(rs.rows.item(i).title + ",lati "  + typeof(rs.rows.item(i).mapx) + ", opentime  "+typeof(rs.rows.item(i).opentime)+", season  "+typeof(rs.rows.item(i).season));
                 for(var i=0;i<l;i++){

                    var button=createbutton(i,"loadpage(this)","light");
        
                    //loadImage
                     var img = viewimg(rs.rows.item(i).imageurl,100,100);
                      button.appendChild(img);
                     //setComponent
                     photo.appendChild(button);
                     ons.compile(button);
                 }
             });
         });
         
          myNavigator.popPage();
}



function flug(id){
        if(id.isChecked()){
            return 0;
        }else{
            return 1;
        }
    }

function getseason(nowtime){
    
   if( nowtime.getMonth()+1 <= 3){
       return 'wint'
   }
   if(3 > nowtime.getMonth+1 <= 5){
       return 'sum'
   }
   if(5<nowtime.getMonth+1 <= 8){
       return 'sum'
   }
   if(9<nowtime.getMonth+1 <=11){
       return 'sum'
   }
   else{
       return 'wint'
   }
}

function gettime(nowtime){
      if(  nowtime.getHours() <= 6 || 18 <= nowtime.getHours() ){
       return 'noon';
   }else{
        return 'noon';
   }
}