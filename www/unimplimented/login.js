function logindatabase(){
    var user = document.getElementById('authority').value;
    var pass = document.getElementById('password').value;
    var datas = {auth:user,pass:pass};
if(user == "" || user == null){
    console.log("空文字でござる");
}else{
    $.ajax({
        type:"post",
        url:"http://test1492.php.xdomain.jp/login.php",
        data:datas,
        success:function(data,dataType){
　　　　　　console.log(data);
         if(data == "matched"){
              myNavigator.pushPage('page1.html');
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
}

