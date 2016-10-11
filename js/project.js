function getProjectData(){
	var dictPost={"plugin":"pano","action":"get_project_data"};
	console.log(dictPost);
	var jsonResp=[];
	$.ajax({
		type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
        	        console.log(response);
        	        jsonResp=JSON.parse(response);
        	        if(jsonResp['success']==true){
                                for (var i=1;i<=jsonResp.project.length;i++){
                                get_user_info_by_id(i,jsonResp);
                                if (jsonResp.project[i-1].public==true){
                                    jsonResp.project[i-1].private="Public";
                                }
                                else {
                                    jsonResp.project[i-1].private="Private";
                                }
                                if (jsonResp.project[i-1].img_src==""){
                                    jsonResp.project[i-1].img_src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAuUlEQVR4Ae2XP8rCUBAHp5F4gPxBsA45mpUgXkt4Se4Rkc97fIQkhVZrK+JbxGwhujN9Bh77K8IPsWTPkSsXOnYkGLPmjNx5YoUhCX/Igx0LzNgiT9zwBhU1AxLxQEpGQCJOtFT653tEMQUgRxR7LVEjqhkABaLaEGVAVAM5BQ2iOhJFjPSAXeBVPKADfqa+Aw/4Dr53Bx6wD/iZfkZgQgwcidIiBgb0H5CZ/lOClmgYZzxOoMRxjLkBL3E6cltSSnYAAAAASUVORK5CYII=';
                                }
                        }
                        loadproject(jsonResp);
        	        }
        	        else{
                        alert("Error!");
        	        }
                }
	});
}

function add0(m){return m<10?'0'+m:m }
function date(shijianchuo)
{
var time = new Date(1000*shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function get_user_info_by_id(i,obj) {
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data_by_id","user_id":obj.project[i-1].user_id};
    console.log(dictPost);
    var jsonResp=[];
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            console.log(response);
            jsonResp = JSON.parse(response);
            if(jsonResp['success']==true) {
                 obj.project[i-1].user_name=jsonResp.user_name;
            }
            else {
                Materialize.toast(jsonResp['error'], 2500, 'rounded');
            }
        }
    });
}

function prepareRemoveData(i){
    return function(){
        var id="fdrg";
        document.getElementById("remove_project_id").innerHTML=id;
    }
}

function sendRemoveRequest(i){
   return function(){
        var user=document.getElementById("this_is_a_user_name").innerHTML;
        var id=obj.project[i-1].id;
        var dictPost={"plugin":"pano","action":"delete","id":id};
        console.log(dictPost);
        var jsonResp=[];
        $.ajax({
                type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
                        console.log(response);
                        jsonResp=JSON.parse(response);
                        if(jsonResp['success']==true){
                                alert('Successfully removed!');
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
    }
}

function sendCreateRequest(){
   return function(){
        var user=document.getElementById("this_is_a_user_name").innerHTML;
        var name=document.getElementById("add_project_name").value;
        var privacy=null;
        if(document.getElementById("add_private_state_private").checked=true){
                privacy=false;
        }
        if(document.getElementById("add_private_state_public").checked=true){
                privacy=true;
        }
        if(name==null||remark==null||privacy==null||name.length==0){
                alert("Please complete the information!");
                return;
        }
        var dictPost={"plugin":"pano","action":"new","title":name,"img":null,"public":privacy,"data":'{"nodes":[],"edges":[]}'};
        console.log(dictPost);
        var jsonResp=[];
        $.ajax({
                type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
                        console.log(response);
                        jsonResp=JSON.parse(response);
                        if(jsonResp['success']==true){
                                alert('Successfully created!');
                                window.location="pano.html#"+jsonResp['id'];
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
   }
}