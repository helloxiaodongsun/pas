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
        format:"yyyy-mm-dd",
        minView:2,
        autoclose:true,
        todayBtn:true,
        clearBtn:false,
    });
    $("#DATA_DT").val(date);
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
            'tableName': 'A_REB_OPRR_RETAIL_PRFT_STRU_SITU-LS030'
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
        field:'product_firsttitle',
        title:'项目',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:1,
        rowNumber:1

    },
    {
        field:'ass_prft',
        title:'利润余额',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:1,
        rowNumber:1

    },
    {
        field:'ass_proft_ratio',
        title:'占比',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:1,
        rowNumber:1

    },
    {
        field:'m_incremt',
        title:'当月增量',
        align: "center",
        valign: "middle",
        rowspan: 1,
        colspan: 1,
        colNumber:1,
        rowNumber:1
    }
    ]
];

var TableObjPage = {
    table1: function () {
        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/LS030query',
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
                lastorgId = $("#ORG_NUM").val();
                lastorgHirchy = $("#ORG_HIRCHY").selectpicker("val");
                lastdataDt = $("#DATA_DT").val();
                lastcurrCd = $("#CURR_CD").val();
                lastDW = $("#DW").selectpicker("val");

                lastQueryParams = {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'orgIds[]':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'dataDt':$("#DATA_DT").val(),
                    'DW':$("#DW").selectpicker("val"),
                    'logTableName':'A_REB_OPRR_RETAIL_PRFT_STRU_SITU-LS030',
                    'logMenuId':mid,
                }
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'orgIds[]':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'DW':$("#DW").selectpicker("val"),
                    'dataDt':$("#DATA_DT").val(),
                    'logTableName':'A_REB_OPRR_RETAIL_PRFT_STRU_SITU-LS030',
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
                $('#table1').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                resizeTables();

            },
            columns: columns,

        });
    }
};


function exportCurrentPageExcel(){
    var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData=false;
    publicReportExcel(lastQueryParams,"exportExcelLS030");
}
function exportAllDataExcel(){
   var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData=true;
    publicReportExcel(lastQueryParams,"exportExcelLS030");
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
    $("#DATA_DT").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "4");
    $("#ORG_NUM").html("").append(orgNumByLevel)
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}
