var date = $.param.getEtlDate();
var mid = getUrlParam('mid');
var lastorgNum,
	lastorgId,
	lastorgHirchy,
	lastdataDt,
	lastcurrCd,
	lastDW,
	lastmdlBizIncomStdAccts,
	isHJ;
var lastQueryParams = {};
var sublastQueryParams = {};
var orgHirchy = undefined;
var orgNumByLevel = undefined;
var currCd = undefined;
var resultInit = undefined;
$(function(){
	$(".date-dt").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
	orgHirchy = $.param.getSelectOptionOrder("TB0056");
	resultInit = $.param.getOrgByLevels("LV5",mid);
	orgNumByLevel = $.param.getOrgByLevel("LV5", mid);
	 currCd = $.param.getSelectOptionOrder("CURR_CD");

	$("#DATA_DT").val(date);
	$("#ORG_HIRCHY").html("").append(orgHirchy)
			.selectpicker('refresh').selectpicker('val', "5");
	$("#ORG_NUM").html("").append(orgNumByLevel)
			.selectpicker('refresh').selectpicker('val', resultInit[0].orgNum);
	$("#CURR_CD").html("").append(currCd).selectpicker('refresh').selectpicker('val', "03");
    $("#DATA_DT").change(function(){
        var dateDt = $(this).val();
        if(dateDt ==""){
            $("#DATA_DT").val(date);
        }
    });
    $("#ORG_HIRCHY").change(function(){
        var level = $(this).val();       
        level = "LV"+level;
       var result = $.param.getOrgByLevel(level,mid);
        $("#ORG_NUM").html("").append(result);
        document.getElementById('ORG_NUM').options.selectedIndex = '0';
        $('#ORG_NUM').selectpicker('refresh');
    });

    $("#query").click(function(){
    	var orgNum = $("#ORG_NUM").val();
    	if(orgNum==""||orgNum==null){
    		layer.msg("机构必选",{icon:3});
    		return;
    	}
    	query();
    });
    query();
    
    var tipsindex;
	$("#ORG_NUM").parent().on('mouseover','.dropdown-menu ul li',function(){
		var oh = $("#ORG_HIRCHY").val();
		if(tipsMap&&(oh=='3'||oh=='4')){
			var tipsMsg = eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,""));
			if(tipsMsg!=null&&tipsMsg!='null'){
				tipsindex = layer.tips(eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,"")),$(this));
			}
		}
	});
	$("#ORG_NUM").parent().on('mouseout','.dropdown-menu ul li',function(){
		layer.close(tipsindex);
	});

	//初始化报表说明(备注)
	$.ajax({
		url: portal.bp() + '/table/queryNote',
		type: "get",
		async: false, // 同步 为全局变量赋值
		data: {
			'tableName': 'A_COB_INV_BANK_MDL_BIZ_INCOM-GS033'
		},
		cache: false,
		success: function (data) {
			var s = data.data;
			if(s.length == 0){
				var trHtml = "<tr><td>暂无报表说明!</td></tr>";
				$("#noteList").append(trHtml);
			}else{
				for(var i = 0;i<s.length;i++){
					//console.log(s[i].table_NOTE);
					var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>"+s[i].table_NOTE+"</td></tr>";
					$("#noteList").append(trHtml);
				}
				$("#noteList .no-records-found").hide();
			}
		}
	});
});
//查询
function query() {
	if($("#ORG_NUM").length>0){
		if($("#ORG_NUM").val()==undefined||$("#ORG_NUM").val()==null||$("#ORG_NUM").val()==""){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
	if($("#SUPER_ORG_NUM").length>0){
		if($("#SUPER_ORG_NUM").val()==undefined||$("#SUPER_ORG_NUM").val()==null||$("#SUPER_ORG_NUM").val()==""){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
	TableObjPage.table1();
}
var orgNameFnc = function index(value, row, index) {
    var html = '';
    html += '<a href="javascript:void(0)" id="showModel">' + value + '</a>';
    return html;
};
window.operateEvents = {
    "click #showModel": function (e, value, row, index) {
    	lastorgNum = row.org_num;
    	if(row.org_name.indexOf("合计")>-1){
    		isHJ = '1';
    	}else{
    		isHJ = '0';
    	}
        $("#detailModelTitle").text("投行中间业务收入查询-下钻");
        $("#detailModel").modal("show");
        TableObjSubPage.table1();
    }

}
var TableObjPage = {
		table1: function () {
			var columns = $.param.getTableNewHeaderByType("GS033");
	        //给机构名称增加方法
			columns[0][2].events = operateEvents;
	        columns[0][2].formatter = orgNameFnc;
	        
			$('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/GS033query',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,     //是否显示分页（*）
	            sortStable: false,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {
	            	lastorgId = $("#ORG_NUM").val();
	            	lastorgHirchy = $("#ORG_HIRCHY").selectpicker("val");
	            	lastdataDt = $("#DATA_DT").val();
	            	lastcurrCd = $("#CURR_CD").val();

	            	lastQueryParams = {
		                    'orgId':$("#ORG_NUM").val(),
		                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
		                	'dataDt':$("#DATA_DT").val(),
		                	'currCd':$("#CURR_CD").val(),
		                	'logTableName':'A_COB_INV_BANK_MDL_BIZ_INCOM-GS033',
		                	'logMenuId':mid,

	            	};
	                return {
	                    'orgId':$("#ORG_NUM").val(),
	                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
	                	'dataDt':$("#DATA_DT").val(),
	                	'currCd':$("#CURR_CD").val(),
	                	'logTableName':'A_COB_INV_BANK_MDL_BIZ_INCOM-GS033',
	                	'logMenuId':mid,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 1000,      //每页的记录行数（*）
	            pageList: [500,1000],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            //height:450, //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            onLoadSuccess: function (data) {
                    $('#table1').bootstrapTable('resetView',{
                        height:getTableHeight(document)
                    });
                    resizeTables();
	            },
	            columns: columns

	        });
	    }
}

var TableObjSubPage = {
		table1: function () {
			var columns = $.param.getTableNewHeaderByType("GS033_1");
	        
			$('#detailModelTable').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/GS033_1query',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {
	            	sublastQueryParams = {
	            			'pageSize': params.limit,
		                    'pageNum': (params.offset / params.limit) + 1,
		                    'orgHirchy':lastorgHirchy,
		                	'dataDt':lastdataDt,
		                	'currCd':lastcurrCd,
		                	'orgNum':lastorgNum,
		                	'logTableName':'A_COB_INV_BANK_MDL_BIZ_INCOM_CUST-GS033_1',
		                	'logMenuId':mid,
	            	};
	                return {
	                	'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,
	                    'orgHirchy':lastorgHirchy,
	                	'dataDt':lastdataDt,
	                	'currCd':lastcurrCd,
	                	'orgNum':lastorgNum,
	                	'logTableName':'A_COB_INV_BANK_MDL_BIZ_INCOM_CUST-GS033_1',
	                	'logMenuId':mid,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            //height:450, //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            onLoadSuccess: function (data) {
                    $('#detailModelTable').bootstrapTable('resetView',{
                        height:getTableHeight(document)
                    });
                    resizeTables();
	            },
	            columns: columns,

	        });
	    }
}

function exportCurrentPageExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	publicReportExcel(lastQueryParams,"exportExcelGS033");
}
function exportAllDataExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=true;
	publicReportExcel(lastQueryParams,"exportExcelGS033");
}
function subexportCurrentPageExcel(){
	var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	sublastQueryParams.tableHead = JSON.stringify(result);
	sublastQueryParams.AllData=false;
	publicReportExcel(sublastQueryParams,"exportExcelGS033_1");
}
function subexportAllDataExcel(){
	var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	sublastQueryParams.tableHead = JSON.stringify(result);
	sublastQueryParams.AllData=true;
	publicReportExcel(sublastQueryParams,"exportExcelGS033_1");
}
function resetForm() {
	$("#DATA_DT").val(date);
	$("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5");
	$("#ORG_NUM").html("").append(orgNumByLevel)
		.selectpicker('refresh').selectpicker('val', resultInit[0].orgNum);
	$("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
}