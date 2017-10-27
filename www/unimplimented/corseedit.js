var chklist;
var listcount;

var findUl;
var findLi; 

function corseslc(){
    chklist = new Array();
    listcount=photo.childElementCount;
　　corseselect.textContent = "キャンセル";
　　corseselect.setAttribute('onclick','cancel()');

　findUl=document.getElementById('photo'),
　findLi = findUl.children;

    for (var i = 0; i < findLi.length; i++){
        findLi[i].setAttribute('onclick','check(this)');
        chklist.push("false");
        }
        
        var ok = createbutton('okbtn','setmap()','light');
        ok.innerHTML  = 'ルート決定';
        root.appendChild(ok);
        ons.compile(ok);
  
}

function check(e){
                                
   if(chklist[e.id]=="false"){
       chklist[e.id]="true";
       e.setAttribute('modifier','cta');
   }else if(chklist[e.id]=="true"){
       chklist[e.id]="false";
       e.setAttribute('modifier',"light");  //????????
   }
  ons.compile(e);
  
}

function cancel(){
    for(var i =0;i<findLi.length;i++){
        findLi[i].setAttribute('onclick','loadpage(this)');
        findLi[i].setAttribute('modifier','light');
       ons.compile(findLi[i]);
    }
    corseselect.textContent = "コース選択";
    corseselect.setAttribute('onclick','corseslc()');
    root.textContent=null;//速度低下
    
}

function setmap(){
    cancel();
    myNavigator.pushPage('rootmap.html');
console.log(chklist);
}