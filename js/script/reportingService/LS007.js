var date = $.param.getEtlDate();
var mid = getUrlParam('mid');
var lastQueryParams = {};

$(function(){
    $(".date-dt").datetimepicker({
        language:"zh-CN",
        format:"yyyy-mm-dd",
        minView:2,
        autoclose:true,
        todayBtn:true,
        clearBtn:false,
    });
    $("#MATURE_PROD_MAT_DT_S").val(date);
    $("#MATURE_PROD_MAT_DT_E").val(date);
    $("#RENEW_PROD_RENEW_DT_S").val(date);
    $("#RENEW_PROD_RENEW_DT_E").val(date);
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
    $("#ORG_NUM").html("").append($.param.getOrgByLevel('LV4',mid))
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);

    $("#DW").html("").append(
        $.param.getSelectOptionOrder("MONETARY_UNIT"))
        .selectpicker('refresh').selectpicker('val', "02");

    $("#RELA_ROLE").html("").append(
        $.param.getSelectOptionOrder("AB0006"))
        .selectpicker('refresh').selectpicker('val', "001");

    $("#ORG_HIRCHY").change(function(){
        var levels = $(this).val();
        levels = "LV"+levels;
        var results = $.param.getOrgByLevels(levels,mid);
        if(results.length>0){
        	
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
        	.selectpicker('refresh').selectpicker('val', results[0].orgNum);
        	//$("#ORG_NUM").selectpicker('refresh').selectpicker('val', results[0].orgNum).change();
        }else{
        	$("#ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
        	.selectpicker('refresh');
        }

    });

    //初始化报表说明(备注)
    $.ajax({
        url: portal.bp() + '/table/queryNote',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {
            'tableName': 'A_REB_PROD_MATURE_SITU-LS007'
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

var TableObjPage = {
    table1: function () {
        var columns = [
            [

                {
                    field:'number',
                    title:'序号',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:1,
                    rowNumber:1,
                    formatter: function (value, row, index) {
                        row.number = index + 1;
                        return index + 1;
                    }
                },
                {
                    field:'lev4_org_num',
                    title:'管辖行编号',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:2,
                    rowNumber:1,
                },
                {
                    field:'lev4_org_name',
                    title:'管辖行名称',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:3,
                    rowNumber:1,

                },
                {
                    field:'lev5_org_num_1',
                    title:'支行编号',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:4,
                    rowNumber:1,
                },
                {
                    field:'lev5_org_name',
                    title:'支行名称',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:5,
                    rowNumber:1,

                },
                {
                    field:'cust_name',
                    title:'客户姓名',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:6,
                    rowNumber:1,

                },
                {
                    field:'cer_type',
                    title:'证件类型',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:7,
                    rowNumber:1,

                },
                {
                    field:'cer_num',
                    title:'证件代码',
                    align: "center",
                    valign: "middle",
                    rowspan: 2,
                    colspan: 1,
                    colNumber:8,
                    rowNumber:1,

                },
                {
                    field:'',
                    title:'到期产品信息',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 7,
                    colNumber:9,
                    rowNumber:1,

                },
                {
                    field:'',
                    title:'续存产品信息',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 5,
                    colNumber:10,
                    rowNumber:1,

                },


            ],[

                {
                    field:'mature_prod_acct',
                    title:'账号',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:9,
                    rowNumber:2,
                },
                {
                    field:'mature_prod_prod_num',
                    title:'到期产品编号',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:10,
                    rowNumber:2,
                },
                {
                    field:'mature_prod_prod_name',
                    title:'产品名称',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:11,
                    rowNumber:2,
                },
                {
                    field:'mature_prod_start_int_dt',
                    title:'起始日期',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:12,
                    rowNumber:2,

                },
                {
                    field:'mature_prod_mat_dt',
                    title:'到期日',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:13,
                    rowNumber:2,

                },
                {
                    field:'mature_prod_mature_amt',
                    title:'到期金额',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:14,
                    rowNumber:2,

                },
                {
                    field:'relr_info',
                    title:'关联人信息',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:15,
                    rowNumber:2,

                },
                {
                    field:'renew_prod_renew_dt',
                    title:'续存日期',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:16,
                    rowNumber:2,

                }, {
                    field:'renew_prod_prod_num',
                    title:'产品编码',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:17,
                    rowNumber:2,

                },
                {
                    field:'renew_prod_prod_name',
                    title:'产品名称',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:18,
                    rowNumber:2,

                },
                {
                    field:'renew_prod_mature_amt',
                    title:'续存金额',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:19,
                    rowNumber:2,

                },
                {
                    field:'renew_relr_info',
                    title:'关联人信息',
                    align: "center",
                    valign: "middle",
                    rowspan: 1,
                    colspan: 1,
                    colNumber:20,
                    rowNumber:2,

                }
            ],
        ];


        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/LS007query',
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
            	lastQueryParams = {
            			'pageSize': params.limit,
                        'pageNum': (params.offset / params.limit) + 1,
                        'orgIds':$("#ORG_NUM").val(),
                        'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                        'DW':$("#DW").selectpicker("val"),
                        'relRole': $("#RELA_ROLE").selectpicker("val"),
                        'proDs':$("#MATURE_PROD_MAT_DT_S").val(),
                        'proDe':$("#MATURE_PROD_MAT_DT_E").val(),
                        'renewDs':$("#RENEW_PROD_RENEW_DT_S").val(),
                        'renewDe':$("#RENEW_PROD_RENEW_DT_E").val(),
                        'empId':$("#EMP_ID").val(),
                        'logTableName':'A_REB_PROD_MATURE_SITU-LS007',
                        'logMenuId':mid,	
            	};
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'orgIds':$("#ORG_NUM").val(),
                    'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
                    'DW':$("#DW").selectpicker("val"),
                    'relRole': $("#RELA_ROLE").selectpicker("val"),
                    'proDs':$("#MATURE_PROD_MAT_DT_S").val(),
                    'proDe':$("#MATURE_PROD_MAT_DT_E").val(),
                    'renewDs':$("#RENEW_PROD_RENEW_DT_S").val(),
                    'renewDe':$("#RENEW_PROD_RENEW_DT_E").val(),
                    'empId':$("#EMP_ID").val(),
                    'logTableName':'A_REB_PROD_MATURE_SITU-LS007',
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
    publicReportExcel(lastQueryParams,"exportExcelLS007");
}
function exportAllDataExcel(){
    var columns = $("#table1").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    lastQueryParams.tableHead = JSON.stringify(result);
    lastQueryParams.AllData=true;
    publicReportExcel(lastQueryParams,"exportExcelLS007");
}
/*function subexportCurrentPageExcel(){
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData=false;
    publicReportExcel(sublastQueryParams,"exportExcelGS018_1");
}
function subexportAllDataExcel(){
    var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
    var result = tableNeedCopy(columns,0);
    sublastQueryParams.tableHead = JSON.stringify(result);
    sublastQueryParams.AllData=true;
    publicReportExcel(sublastQueryParams,"exportExcelGS018_1");
}*/
function resetForm() {
    $("#DATA_DT").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5").change();
    /*$("#ORG_NUM").html("").append(initOrgNum)
        .selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);*/
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
    $("#mdlBizIncomStdAcct").selectpicker('refresh');
}
