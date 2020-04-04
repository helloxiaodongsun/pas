var url_suffix=portal.bp();
var menuDesc = '';
var selectFromFavorites='02';
var menuId = getUrlParam("menuId");
$(function(){
	document.onkeydown=kewDownSearch;
	
    TableObj.menuTable();
    /*$('#add_favorites').attr("style", "display:inline");
    $('#remove_favorites').attr("style", "display:none");
    $('#add_favorites').click(add_favorites);
    $('#remove_favorites').click(remove_favorites);*/
    /*$("body").bind('keyup',function(event){
    	if(event.keyCode=='13'){
    		//回车事件
    		TableObj.menuTable();
    	}
    });*/
});
function kewDownSearch(e){
	var theEvent = e||window.event;
	var code = theEvent.keyCode||theEvent.which||theEvent.charCode;
	if(code==13){
		menu_query();
		return false;
	}
	return true;
}
var TableObj={
  menuTable:function(){
      var columns = [
          {
              field: 'Number',
              title: '序号',
              align: 'center',
              formatter: function (value, row, index) {
                  return index + 1;
              }
          },
          {
              field: 'menuDesc',
              title: '报表名称',
             /* events: operateEvents,*/
              formatter: function (value, row, index) {
                  var  html='';
                  if (value != ''
                      && value != null
                      && value != undefined
                      && row != null
                      && row != ''
                      && row != undefined
                      && row['urlAddress'] !=''
                      && row['urlAddress'] !=null
                      && row['urlAddress'] !== undefined) {
                      html='<a href="#" data-url="'+url_suffix+
                          row['urlAddress']+'?menuId='+row['menuId']+'&mid='+
                          row['menuId']+'" id="'+url_suffix+row['urlAddress']+
                          '?menuId='+row['menuId']+'&mid='+row['menuId']+
                          '" data-index="'+row['menuId']+'" onclick="tab1(this)">'+row['menuDesc']+
                          '</a>';
                  }
                  return html;
              }
          },
          {
        	  field:'isFavorite',
        	  title:'收藏',
        	  formatter: function (value, row, index) {
        		  var  html='';
        		  if(value=='1'){
        			  html='<span onclick="removeFav(\''+row.menuId+'\');" class="glyphicon glyphicon-star" aria-hidden="true" style="color: #ff0000;cursor: pointer;"></span>';
        		  }else{
        			  html='<span onclick="addFav(\''+row.menuId+'\');" class="glyphicon glyphicon-star-empty" aria-hidden="true" style="cursor: pointer;"></span>';
        		  }
        		  return html;
        	  }
          }
      ];

      $('#menuTable').bootstrapTable('destroy').bootstrapTable({
          url: portal.bp() + './../json/api/menus/getMenuInfo.'+menuId+'.json',
          method: 'post',      //请求方式（*）
          striped: true,      //是否显示行间隔色
          cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
          pagination: true,     //是否显示分页（*）
          singleSelect: false,    //是否单选，true时没有全选按钮
          showHeader:true,
          height:getTableHeight(document),
          contentType: "application/x-www-form-urlencoded",
          queryParams: function (params) {
              return {
                  'pageSize': params.limit,
                  'pageNum': (params.offset / params.limit) + 1,
                  'menuId':menuId,
                  'menuDesc':menuDesc,
                  'selectFromFavorites':selectFromFavorites
              };
          },
          sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
          pageNum: 1,      //初始化加载第一页，默认第一页
          pageSize: 15,      //每页的记录行数（*）
          pageList: [15,25],  //可供选择的每页的行数（*）
          clickToSelect: false,    //是否启用点击选中行
          rowStyle:rowStyle,
          responseHandler: function (res) { //服务端返回数据
              if (res.code == '200') {
                  return res.data;
              } else {
                  layer.msg(res.message, {icon: 2});
                  return {};
              }
          },
          columns: columns,
          onLoadSuccess: function (data) {
              $('#menuTable').bootstrapTable('resetView',{
                  height:getTableHeight(document)
              });
              resizeTables();
          }
      });
  }

};
//查询
function menu_query() {
   var menuDescTmp= $('#menuDesc').val()
    if(menuDescTmp !='' || menuDescTmp !=null || menuDescTmp != undefined) {
        menuDesc = $.trim(menuDescTmp);
    }else {
        menuDesc = '';
    }
    /*selectFromFavorites=$('#selectFromFavorites').val();
    if(selectFromFavorites=='01'){
        $('#add_favorites').attr("style", "display:none");
        $('#remove_favorites').attr("style", "display:inline");
    }else{
        $('#add_favorites').attr("style", "display:inline");
        $('#remove_favorites').attr("style", "display:none");
    }*/
    TableObj.menuTable();
};
//重置
function resetForm() {
    menuDesc = '';
    $('#formSearch')[0].reset();
};
//添加收藏
function add_favorites() {
    if(selectFromFavorites == '01'){
        layer.msg('当前处于查看收藏夹状态，不能进行添加收藏操作', {icon: 2})
        return;
    }
    var selectedDatas = $('#menuTable').bootstrapTable('getSelections');
    if(selectedDatas == null || selectedDatas.length <=0){
        layer.msg('至少选择一条数据', {icon: 2});
        return;
    }
    var menuIdArray = new Array();
    $.each(selectedDatas,function (index, value) {
        menuIdArray.push(value['menuId']);
    });
    $.ajax({
        url: portal.bp() + './../json/api/menus/operationUserTableFavorites.json',
        type: 'post',
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'oprType':'1',
            'menuIds':menuIdArray
        },
        success: function (data) {
            if (data.code == '200') {
                layer.msg("收藏成功", {icon: 1});
                TableObj.menuTable();
            } else {
                layer.msg(data.msg, {icon: 2});
            }
        }
    });
}
//移除收藏
function remove_favorites() {
    if(selectFromFavorites == '02'){
        layer.msg('当前未处于查看收藏夹状态，不能进行移除收藏操作', {icon: 2})
        return;
    }
    var selectedDatas = $('#menuTable').bootstrapTable('getSelections');
    if(selectedDatas == null || selectedDatas.length <=0){
        layer.msg('至少选择一条数据', {icon: 2});
        return;
    }
    var menuIdArray = new Array();
    $.each(selectedDatas,function (index, value) {
        menuIdArray.push(value['menuId']);
    });
    $.ajax({
        url: portal.bp() + './../json/api/menus/operationUserTableFavorites.json',
        type: 'post',
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'oprType':'0',
            'menuIds':menuIdArray
        },
        success: function (data) {
            if (data.code == '200') {
                layer.msg("收藏成功", {icon: 1});
                TableObj.menuTable();
            } else {
                layer.msg("收藏失败", {icon: 2});
            }
        }
    });
}
function addFav(menuId){
	 var menuIdArray = new Array();
	 menuIdArray.push(menuId);
    $.ajax({
        url: portal.bp() + './../json/api/menus/operationUserTableFavorites.json',
        type: 'post',
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'oprType':'1',
            'menuIds':menuIdArray
        },
        success: function (data) {
            if (data.code == '200') {
                TableObj.menuTable();
            } else {
                layer.msg(data.msg, {icon: 2});
            }
        }
    });
}
function removeFav(menuId){
	var menuIdArray = new Array();
        menuIdArray.push(menuId);
    $.ajax({
        url: portal.bp() + './../json/api/menus/operationUserTableFavorites.json',
        type: 'post',
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'oprType':'0',
            'menuIds':menuIdArray
        },
        success: function (data) {
            if (data.code == '200') {
                TableObj.menuTable();
            } else {
                layer.msg("收藏失败", {icon: 2});
            }
        }
    });
}
function getTableHeight(document){
    var windowHeight = $(document).height();
    var topHeight = $(document).find(".ibox-content").offset().top;
    var tableHeight = windowHeight - topHeight;
    return tableHeight;
}
function tab1(obj) {
    var o = $(obj).attr("data-url"), m =$(obj).data("index"), l = $.trim($(obj).text()), k = true;
    if (o == undefined || $.trim(o).length == 0 || $.trim(o) === '#') {
        return false
    }
    $(".J_menuTab",parent.document).each(
        function() {
            if ($(this).data("id") == o) {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active").siblings(".J_menuTab")
                        .removeClass("active");
                    g(this);
                    $(".J_mainContent .J_iframe",parent.document).each(
                        function() {
                            if ($(this).data("id") == o) {
                                $(this).show()
                                    .siblings(".J_iframe")
                                    .hide();
                                return false
                            }
                        })
                }
                k = false;
                return false
            }
        });
    if (k) {
        var p = '<a href="javascript:;" class="active J_menuTab" data-id="'
            + o + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
        $(".J_menuTab",parent.document).removeClass("active");
        var n = '<iframe class="J_iframe" name="iframe' + m
            + '" width="100%" height="100%" src="' + o
            + '" frameborder="0" data-id="' + o
            + '" seamless></iframe>';
        $(".J_mainContent",parent.document).find("iframe.J_iframe").hide().parents(
            ".J_mainContent",parent.document).append(n);
        $(".J_menuTabs .page-tabs-content",parent.document).append(p);
        tab2($(".J_menuTab.active",parent.document))
    }
    return false
};

function tab2(n) {
    var o = f($(n).prevAll()), q = f($(n).nextAll());
    var l = f($(".content-tabs",parent.document).children().not(".J_menuTabs"));
    var k = $(".content-tabs",parent.document).outerWidth(true) - l;
    var p = 0;
    if ($(".page-tabs-content",parent.document).outerWidth() < k) {
        p = 0
    } else {
        if (q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
            if ((k - $(n).next().outerWidth(true)) > q) {
                p = o;
                var m = n;
                while ((p - $(m).outerWidth()) > ($(".page-tabs-content",parent.document)
                    .outerWidth() - k)) {
                    p -= $(m).prev().outerWidth();
                    m = $(m).prev()
                }
            }
        } else {
            if (o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(
                true))) {
                p = o - $(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content",parent.document).animate({
        marginLeft : 0 - p + "px"
    }, "fast")
};
function f(l) {
    var k = 0;
    $(l).each(function() {
        k += $(this).outerWidth(true)
    });
    return k
};
function g(n) {
    var o = f($(n).prevAll()), q = f($(n).nextAll());
    var l = f($(".content-tabs",parent.document).children().not(".J_menuTabs"));
    var k = $(".content-tabs",parent.document).outerWidth(true) - l;
    var p = 0;
    if ($(".page-tabs-content",parent.document).outerWidth() < k) {
        p = 0
    } else {
        if (q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
            if ((k - $(n).next().outerWidth(true)) > q) {
                p = o;
                var m = n;
                while ((p - $(m).outerWidth()) > ($(".page-tabs-content",parent.document)
                    .outerWidth() - k)) {
                    p -= $(m).prev().outerWidth();
                    m = $(m).prev()
                }
            }
        } else {
            if (o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(
                true))) {
                p = o - $(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content",parent.document).animate({
        marginLeft : 0 - p + "px"
    }, "fast")
};