$(function() {
	huanyingyu();
	getTodoCount(true);
	//每间隔5分钟刷新一次
	window.setInterval(huanyingyu,5*60*1000);
	
	getmenu();
    sideBarCss();
    $("#ckq").attr("data-url",portal.bp() + "/ckq/show?mid=ckqmid").attr('data-index','ckqmid');
    $("#todoBtn").attr("data-url",portal.bp() + "/todoList/index?mid=todomid").attr('data-index','todomid');
    /*$("#ckq").click(function(){
    	window.open(portal.bp()+"/ckq/show");
    })*/
});
function getTodoCount(sync){
	$.ajax({
		url:portal.bp() + '/todoList/count.json?m='+ Math.random(),
		type:'get',
		async:sync,
		cache:false,
		dataType: "json",
		success:function(o){
			if(o.code=='200'){
				if(o.data!=0){
					$("#todoCount").empty().text(o.data);
				}else{
					$("#todoCount").empty();
				}
			}
		}
	});
}
function huanyingyu(){
	var h = new Date().Format("hh");
	var t = "";
	if(parseInt(h)<12){
		t = ",上午好";
	}else if(parseInt(h)>=12&&parseInt(h)<18){
		t = ",下午好";
	}else{
		t= ",晚上好";
	}
	var onlineNum = getOnlineNum();
	$("#huanyingyu").html(empName+t+"<br/>在线人数："+onlineNum);
}
function getOnlineNum(){
	var res = 1;
	$.ajax({
		url:portal.bp() + '/sessions/getOnlineNum.json?m='+ Math.random(),
		type:'get',
		async:false,
		cache:false,
		dataType: "json",
		success:function(o){
			if(o.code=='200'){
				res = o.data;
			}
		}
	});
	return res;
}
function getmenu(){
	$.ajax({
		url:portal.bp() + '/api/menus/user.json?callback=userJson',
		type:'get',
		async:false,
		cache:false,
		dataType: "json",
		success:function(o){
			if(o.code=='200'){
				var data = o.data;
				if(data != null){
					var listr = "";
                    listr = "<li ><a href='#'><i class='fa fa-list'></i>"+   // listr += '<li id="menu-item"><sapn id="menu-switch">操作菜单</sapn></li>'; /* <a id="menu-switch" class="navbar-minimalize minimalize-styl-2">《《 </a>*/
                      "<span class='nav-label'>操作菜单</span></a><li>";
                    for(var i=0;i<data.length;i++){
						var iconclass = "fa fa fa-bar-chart-o";
						if(i%4==0){
							iconclass = "fa fa fa-bar-chart-o";
						}else if(i%4==1){
							iconclass = "fa fa-flask";
						}else if(i%4==2){
							iconclass = "fa fa-table";
						}else if(i%4==3){
							iconclass = "fa fa-picture-o";
						}
						listr+="<li>";
						listr += '<a href="#" id="'+ data[i].id +'"><i class="'+iconclass+'"></i><span class="nav-label">';
						listr += data[i].name;
						listr += '</span> <span class="fa arrow"></span></a>';
						var special=false;
						var zh_4 = false;
						if(data[i].id == '3000'){
							special=true;
						}
						if(data[i].children != undefined){
							listr += '<ul id="'+data[i].code+'U" class="nav nav-second-level">';
							listr+=ment(data[i].children,special);
							listr+="</ul>";
						}
						listr+="</li>";
					}
					$("#side-menu").empty().append(listr);
				}
			}else{
				layer.msg(o.message,{icon:2});
			}
		}
	});

}

/*function ment(data){
	var listr="";
	for(var i=0;i<data.length;i++){
		var url = "#";
		if(data[i].url != undefined&&data[i].url != null){
			if(data[i].url.indexOf("?")>-1){
				url = portal.bp()+data[i].url+"&mid="+data[i].id;
			}else{
				url = portal.bp()+data[i].url+"?mid="+data[i].id;
			}
		}
		if(data[i].children != undefined){
			listr += '<li><a href="#"><span class="fa fa-arrow-circle-right"></span>&nbsp;&nbsp;'+data[i].name+'<span class="fa arrow"></span></a>';
		}else{
			listr += '<li><a title= "'+data[i].name+'" class="J_menuItem" href="'+url+'">'+data[i].name+'</a></li>';
		}
		if(data[i].children != undefined){
			listr+='<ul class="nav nav-third-level">';
			listr+=ment(data[i].children);
			listr+='</ul>';
			listr+='</li>';
		}
	}
	return listr;
}*/

function ment(data,special){
	var listr="";
	for(var i=0;i<data.length;i++){
		var url = "#";
		if(data[i].url != undefined&&data[i].url != null){
			if(data[i].url.indexOf("?")>-1){
				url = portal.bp()+data[i].url+"&mid="+data[i].id;
			}else{
				url = portal.bp()+data[i].url+"?mid="+data[i].id;
			}
		}

		if(data[i].children != undefined && !special){
			listr += '<li><a href="#"><span class="fa fa-arrow-circle-right"></span>&nbsp;&nbsp;'+data[i].name+'<span class="fa arrow"></span></a>';
			listr+='<ul class="nav nav-third-level">';
			listr+=ment(data[i].children,special);
			listr+='</ul>';
			listr+='</li>';
		}else if( data[i].code == '4600'|| data[i].code == '4700'){
            listr += '<li><a title= "'+data[i].name+'" class="J_menuItem" href="'+url+'"><span class="fa fa-arrow-circle-right"></span>&nbsp;&nbsp;'+data[i].name+'</a></li>';
        }else{
            listr += '<li><a title= "'+data[i].name+'" class="J_menuItem" href="'+url+'">'+data[i].name+'</a></li>';
        }

	}
	return listr;
}

function sideBarCss() {
    var width =  $("#side-menu").width();
    $("#left-bar-scroll").scroll(function () {
        var offSet =  $("#left-bar-scroll").scrollLeft();
        $("#side-menu").css("width",width + offSet);
    });
}


