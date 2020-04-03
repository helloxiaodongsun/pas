var url_suffix=portal.bp();
var lastPageNum;
$(function(){
	document.onkeydown=kewDownSearch;
	$("#menu").empty().append($.param.getSelectOptionOrder("todo_menu"));
    TableObj.menuTable();
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
        	  field:'isShow',
        	  title:'提醒',
        	  formatter: function (value, row, index) {
        		  var  html='';
        		  if(value=='1'){
        			  html='<span onclick="removeFav(\''+row.pkId+'\');" class="glyphicon glyphicon-star" aria-hidden="true" style="color: #ff0000;cursor: pointer;"></span>';
        		  }else{
        			  html='<span onclick="addFav(\''+row.pkId+'\');" class="glyphicon glyphicon-star-empty" aria-hidden="true" style="cursor: pointer;"></span>';
        		  }
        		  return html;
        	  }
          },
          {
        	  field:'menuId',
        	  title:'提醒类型',
        	  formatter: function (value, row, index) {

        		  return $.param.getDisplay('todo_menu', row.menuIdCustomer != null && row.menuIdCustomer !=''?row.menuIdCustomer:value);
        	  }
          },
          {
              field: 'showMsg',
              title: '提醒事项',
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
                	  if(row['isShow']=='1'){
                		  var presuffix='<a href="#" data-url="'+url_suffix+
	                		  row['urlAddress']+'?mid='+
	                		  row['menuId'];
                          var suffix= '" id="' + url_suffix + row['urlAddress'] +
                              '?mid=' + row['menuId'] + '" data-index="' + row['menuId'] + '" onclick="tab1(this,\'' + row['menuDesc'] + '\')">' + row['showMsg'] +
                              '</a>';
                		  if(row['businessParams'] !=='' && row['businessParams'] !=null){
                              var queryParam = '&' + row['businessParams'];
                              presuffix += queryParam;
                          }
                          html = presuffix + suffix;
                	  }else{
                		  html = value;
                	  }
                  }
                  return html;
              }
          },
          {
        	  field: 'lastModrId',
              title: '最新处理人',
          },
          {
        	  field: 'lastDealTimeStr',
        	  title: '最新处理时间',
          },
          {
        	  field: 'dealComntDesc',
        	  title: '拒绝原因',
          },
          {
        	  field: 'opeType',
        	  title: '操作类型',
          },
          
      ];

      $('#menuTable').bootstrapTable('destroy').bootstrapTable({
          url: portal.bp() + '/todoList/find',
          method: 'post',      //请求方式（*）
          striped: true,      //是否显示行间隔色
          cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
          pagination: true,     //是否显示分页（*）
          singleSelect: false,    //是否单选，true时没有全选按钮
          showHeader:true,
          height:getTableHeight(document),
          contentType: "application/x-www-form-urlencoded",
          queryParams: function (params) {
        	  lastPageNum = (params.offset / params.limit) + 1;
              return {
                  'pageSize': params.limit,
                  'pageNum': (params.offset / params.limit) + 1,
                  'showMsg':$("#showMsg").val(),
                  'menuIds':$("#menu").val(),
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
              if(lastPageNum==1){
            	//只在第一页时重新获取待办事项，防止频繁查询待办
            	  //调用index页面的查询数量方法
            	  parent.getTodoCount(true);
              }
          }
      });
  }

};
//查询
function menu_query() {
    TableObj.menuTable();
};
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#menu').selectpicker('refresh');
};
function addFav(pkId){
	 var pkIdArray = new Array();
	 pkIdArray.push(pkId);
    $.ajax({
        url: portal.bp() + '/todoList/operationUserTableFavorites',
        type: 'post',
        async:false,
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'isShow':'1',
            'pkIds':pkIdArray
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
function removeFav(pkId){
	var pkIdArray = new Array();
        pkIdArray.push(pkId);
    $.ajax({
        url: portal.bp() + '/todoList/operationUserTableFavorites',
        type: 'post',
        async:false,
        cache: false,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: {
            'isShow':'0',
            'pkIds':pkIdArray
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
function getTableHeight(document){
    var windowHeight = $(document).height();
    var topHeight = $(document).find(".ibox-content").offset().top;
    var tableHeight = windowHeight - topHeight;
    return tableHeight;
}
