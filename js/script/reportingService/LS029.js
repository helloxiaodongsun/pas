var date = $.param.getEtlDate();
var mid = getUrlParam('mid');

var lastorgNum,
    lastorgId,
    lastorgHirchy,
    lastdataDt,
    lastcurrCd,
    lastDW;
var lastQueryParams = {};
var sublastQueryParams = {};

var orgHirchy = undefined;
var orgNumByLevel = undefined;
var currCd = undefined;
var resultInit = undefined;

$(function(){
    $(".date-dt").datetimepicker({
        language:"zh-CN",
        format:"yyyy-mm",
        minView:3,
        startView:3,
        autoclose:true,
        todayBtn:true,
        clearBtn:false,
    });
    $("#DATA_DT").val(date.split('-')[0]+"-"+date.split('-')[1]);
    $("#ORG_HIRCHY").html("").append(
        $.param.getSelectOptionOrder("TB0056"))
        .selectpicker('refresh').selectpicker('val', "4").change();

    $("#ORG_NUM").on('changed.bs.select',function(a,b,c,d){
        if(!$(this).selectpicker('val')){
            //必选
            document.getElementById("ORG_NUM").options.selectedIndex = b;
            $("#ORG_NUM").selectpicker('refresh');
            layer.msg("机构必选",{icon:3});
        }
    });

    //初始化机构
    initOrgNum = $.param.getOrgByLevels('LV4',mid);
    orgNumByLevel = $.param.getOrgByLevel("LV4", mid);
    $("#ORG_NUM").html("").append($.param.getOrgByLevel('LV4',mid))
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);

    $("#DW").html("").append(
        $.param.getSelectOptionOrder("MONETARY_UNIT"))
        .selectpicker('refresh').selectpicker('val', "02");


    $("#ORG_HIRCHY").change(function(){
        var levels = $(this).val();
        levels = "LV"+levels;
        var results = $.param.getOrgByLevels(levels,mid);
        if(results.length>0){
        	
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
        	.selectpicker('refresh').selectpicker('val', results[0].orgNum);
        	$("#ORG_NUM").selectpicker('refresh').selectpicker('val', results[0].orgNum).change();
        }else{
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
        	.selectpicker('refresh');
        }

    });

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
            'tableName': 'A_REB_MDL_BIZ_INCOM_STRU_SITU-LS029'
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

    query();
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

var columns = [

    [
    {
        field:'cate',
        title:'类别',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:1,
        rowNumber:1

    },
    {
        field:'biz_type',
        title:'业务类型',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:2,
        rowNumber:1

    },
    {
        field:'proj_name',
        title:'项目名称',
        align: "left",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:3,
        rowNumber:1

    },
    {
        field:'mdl_biz_incom_bal',
        title:'中收余额',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:4,
        rowNumber:1
    },
    {
    	field:'pct',
    	title:'占比',
    	align: "center",
    	valign: "middle",
    	rowspan: 1,
    	colspan: 1,
    	colNumber:5,
    	rowNumber:1
    },
    {
    	field:'biz_type_sum_pct',
    	title:'业务类型合计占比',
    	align: "center",
    	valign: "middle",
    	rowspan: 1,
    	colspan: 1,
    	colNumber:6,
    	rowNumber:1
    },
    {
    	field:'m_incremt',
    	title:'当月增量',
    	align: "center",
    	valign: "middle",
    	rowspan: 1,
    	colspan: 1,
    	colNumber:7,
    	rowNumber:1
    },
    ]
];

var TableObjPage = {
    table1: function () {
        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/LS029query',
            method: 'get',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                lastorgNum = $("#ORG_NUM").val();
                lastorgHirchy = $("#ORG_HIRCHY").selectpicker("val");
                lastdataDt = $("#DATA_DT").val();
                lastcurrCd = $("#CURR_CD").val();
                lastDW = $("#DW").selectpicker("val");

                lastQueryParams = {
                    'orgNum':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'dataDt':$("#DATA_DT").val(),
                    'DW':$("#DW").selectpicker("val"),
                    'logTableName':'A_REB_MDL_BIZ_INCOM_STRU_SITU-LS029',
                    'logMenuId':mid,
                }
                return {
                    'orgNum':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'DW':$("#DW").selectpicker("val"),
                    'dataDt':$("#DATA_DT").val(),
                    'logTableName':'A_REB_MDL_BIZ_INCOM_STRU_SITU-LS029',
                    'logMenuId':mid,
                };
            },
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
            	mergeCell(data, 'cate', 1, '#table1',['cate']);
            	mergeCell(data, 'biz_type', 1, '#table1',['biz_type']);
            	mergeColspan(data,['biz_type','proj_name'],'#table1');
            	countFormat();
            	resizeTables();

            },
            columns: columns,

        });
    }
};
//var filedNameArray = ['cate','biz_type'];

function mergeCell(data, fieldName, colspan, target,filedNameArray) {
    //

    if (data.length == 0) {
        return;
    }

    numArr = [];
    var value = data[0][fieldName];
    var num = 0;
    for (var i = 0; i < data.length; i++) {
        if (value != data[i][fieldName]) {
            numArr.push(num);
            value = data[i][fieldName];
            num = 1;
            continue;
        }
        num++;
    }
    if(num>1){
    	numArr.push(num);
    }
    if (numArr.length == 0) {
        mergeTool(target, 0, filedNameArray, colspan, data.length);

    } else {

        var merIndex = 0;
        for (var i = 0; i <= numArr.length; i++) {
            merIndex += numArr[i];
        }
        var merIndex = 0;
        for (var i = 0; i < numArr.length; i++) {
            mergeTool(target, merIndex, filedNameArray, colspan, numArr[i]);
            merIndex += numArr[i];
        }
    }

}

function mergeTool(target, merIndex, filedNameArray, colspan, rowspan) {
    for (var j = 0; j < filedNameArray.length; j++) {
        $(target).bootstrapTable('mergeCells', {
            index: merIndex,
            field: filedNameArray[j],
            colspan: colspan,
            rowspan: rowspan
        });
    }
}

function mergeColspan(data,fieldNameArr,target){
	if(data.length==0) return;
	if(fieldNameArr.length==0) return;
	var num = -1;
	var index=0;
	for(var i=0;i<data.length;i++){
		num++;
		for(var v=0;v<fieldNameArr.length;v++){
			index = 1;
			if(data[i][fieldNameArr[v]]!=data[i][fieldNameArr[0]]){
				index = 0;
				break;
			}
		}
		if(index == 0){
			continue;
		}
		$(target).bootstrapTable('mergeCells',{index:num,field:fieldNameArr[0],colspan:fieldNameArr.length,rowspan:1});
	}
}
function exportCurrentPageExcel(){
    var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData=false;
    //需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	lastQueryParams.mergeColumns="cate:0,biz_type:1";
    publicReportExcel(lastQueryParams,"exportExcelLS029");
}
function exportAllDataExcel(){
   var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData=true;
    //需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	lastQueryParams.mergeColumns="cate:0,biz_type:1";
    publicReportExcel(lastQueryParams,"exportExcelLS029");
}
/*function subexportCurrentPageExcel(){
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData=false;
    publicReportExcel(sublastQueryParams,"exportExcelLS030_1");
}
function subexportAllDataExcel(){
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData=true;
    publicReportExcel(sublastQueryParams,"exportExcelLS030_1");
}*/
function resetForm() {
    $("#DATA_DT").val(date.split('-')[0]+"-"+date.split('-')[1]);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "4");
    $("#ORG_NUM").html("").append(orgNumByLevel)
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}
