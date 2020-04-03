var date = $.param.getEtlDate();
var mid = getUrlParam('mid');

var lastorgNum,
    lastorgId,
    lastorgHirchy;
var orgNumByLevel = undefined;
var lastQueryParams = {};

$(function () {
    $(".date-dt").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2,
        autoclose: true,
        todayBtn: true,
        clearBtn: false
    });
    $("#DATA_DT_S").val(date);
    $("#DATA_DT_E").val(date);

    $("#ORG_HIRCHY").html("").append(
        $.param.getSelectOptionOrder("TB0056"))
        .selectpicker('refresh').selectpicker('val', "4").change();

    $("#ORG_NUM").on('changed.bs.select', function (a, b, c, d) {
        if (!$(this).selectpicker('val')) {
            //必选
            document.getElementById("ORG_NUM").options.selectedIndex = b;
            $("#ORG_NUM").selectpicker('refresh');
            layer.msg("机构必选", {icon: 3});
        }
    });

    //初始化机构
    initOrgNum = $.param.getOrgByLevels('LV4', mid);
    orgNumByLevel = $.param.getOrgByLevel("LV4", mid);
    $("#ORG_NUM").html("").append($.param.getOrgByLevel('LV4', mid))
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);

    $("#ORG_HIRCHY").change(function () {
        var levels = $(this).val();
        levels = "LV" + levels;
        var results = $.param.getOrgByLevels(levels, mid);
        if(results.length>0){
        	
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels, mid))
        	.selectpicker('refresh').selectpicker('val', results[0].orgNum);
        	//$("#ORG_NUM").selectpicker('refresh').selectpicker('val', results[0].orgNum).change();
        }else{
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels, mid))
        	.selectpicker('refresh');
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
    var dateS=$('#DATA_DT_S').val();
    var dateE=$('#DATA_DT_E').val();
   if(dateS == null || dateS ==''){
       layer.msg("查询日始必填",{icon:3});
       return;
   }
   if(dateE == null || dateE ==''){
       layer.msg("查询日止必填",{icon:3});
       return;
   }



    TableObjPage.table1();
}

var TableObjPage = {
    table1: function () {
        var columns = [
            [{
                field: 'lev4_org_num',
                title: '管辖行编号',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:1,
            },
            {
                field: 'lev4_org_name',
                title: '管辖行名称',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:2
            },
            {
                field: 'lev5_org_num_1',
                title: '支行编号',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:2
            },
            {
                field: 'lev5_org_name',
                title: '支行名称',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:3
            },
            {
                field: 'y_open_acct_cnt',
                title: '开户数',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:4
            },
            {
                field: 'valid_open_acct_cnt',
                title: '有效开户数',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:5,

            },
            {
                field: 'valid_open_acct_cnt_ratio',
                title: '有效户数占比',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:6,

            },
            {
                field: 'cust_id_count',
                title: '统计期内交易客户数',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:7,

            },
            {
                field: 'trd_the_num_sum',
                title: '统计期内3次以上交易',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:8,

            },
            {
                field: 'open_card_cnt',
                title: '开卡数',
                align: "center",
                valign: "middle",
                rowspan: 1,
                colspan: 1,
                rowNumber:1,
                colNumber:9,

            }]
        ];


        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/LS031query',
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
                lastQueryParams = {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'orgIds[]':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'dateS': $("#DATA_DT_S").val(),
                    'dateE': $("#DATA_DT_E").val(),
                    'logTableName':'A_REB_MOBBANK_PER_STAT-LS031',
                    'logMenuId':mid,

                }
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'orgIds[]': $("#ORG_NUM").val(),
                    'orgHirchy': $("#ORG_HIRCHY").selectpicker("val"),
                    'dateS': $("#DATA_DT_S").val(),
                    'dateE': $("#DATA_DT_E").val(),
                    'logTableName':'A_REB_MOBBANK_PER_STAT-LS031',
                    'logMenuId':mid,
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50, 100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
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
                $('#table1').bootstrapTable('resetView', {
                    height: getTableHeight(document)
                });
                resizeTables();
            },
            columns: columns,

        });
    }
};


function exportCurrentPageExcel() {
    var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns, 0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData = false;
    publicReportExcel(lastQueryParams, "exportExcelLS031");
}

function exportAllDataExcel() {
    var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns, 0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData = true;
    publicReportExcel(lastQueryParams, "exportExcelLS031");
}

/*function subexportCurrentPageExcel() {
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns, 0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData = false;
    publicReportExcel(sublastQueryParams, "exportExcelLS031_1");
}

function subexportAllDataExcel() {
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns, 0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData = true;
    publicReportExcel(sublastQueryParams, "exportExcelLS031_1");
}*/

function resetForm() {
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "4");
    $("#ORG_NUM").html("").append(orgNumByLevel)
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);
    $("#DATA_DT_S").val(date);
    $("#DATA_DT_E").val(date);
}
