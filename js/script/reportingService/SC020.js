var date = $.param.getEtlDate();
var mid = getUrlParam('mid');
var result;
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
    
	$("#DATA_DT").val(date);
	//result = $.param.getOrgByLevels("LV5",mid);
	$("#ORG_HIRCHY").html("").append(
			$.param.getSelectOptionOrder("TB0056"))
			.selectpicker('refresh').selectpicker('val', "5");
	/*$("#ORG_NUM").html("").append($.param.getOrgByLevel("LV5",mid))
			.selectpicker('refresh').selectpicker('val', result[0].orgNum);*/
	
    $("#CURR_CD").html("").append(
			$.param.getSelectOptionOrder("CURR_CD"))
			.selectpicker('refresh').selectpicker('val', "03");
    $("#DW").html("").append(
    		$.param.getSelectOptionOrder("MONETARY_UNIT"))
    		.selectpicker('refresh').selectpicker('val', "02");
    
    $("#DATA_DT").change(function(){
        var dateDt = $(this).val();
        if(dateDt ==""){
            $("#DATA_DT").val(date);
        }
    });
    
    var html="";
    var level="";
    $.ajax({
		url : portal.bp() + '/org/findAuthOrgHirchy',
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'mid':mid
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				var s = data.data;
				var firstValue='';
				$.each(s,function(index,item){
					if(item.ENCODE=='4'){
						firstValue = item.ENCODE;
						html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
					}else{
						html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
					}
				});
				if(firstValue==''){
					firstValue == '5';
				}
				$("#ORG_HIRCHY").empty().append(html);
				
				$("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val',firstValue).change();
				
				if(firstValue=="1"){
					level="LV1";
				}else if(firstValue=="2"){
					level="LV2";
				}else if(firstValue=="3"){
					level="LV3";
				}else if(firstValue=="4"){
					level="LV4";
				}else{
					level="LV5";
				}
				result = $.param.getOrgByLevels(level,mid);
				$("#ORG_NUM").html("").append($.param.getOrgByLevel(level,mid))
				.selectpicker('refresh').selectpicker('val', result[0].orgNum);
			}
		}
	});
    
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
    
    
    
    $("#query").click(function(){
    	var orgNum = $("#ORG_NUM").val();
    	if(orgNum==""||orgNum==null){
    		layer.msg("机构必选",{icon:3});
    		return;
    	}
    	query();
    });
    query();
    
    $("#tab1").click(function(){
    	TableObjNotPage.table1();
    });
    
    //初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'A_MKB_IBANK_MDL_BIZ_INCOM_PER-SC020'
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
function exportCurrentPageExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	//lastQueryParams.mergeColumns="product_firsttitle:0";
	publicReportExcel(lastQueryParams,"exportExcelSC020/table1");
}
function exportAllDataExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=true;
	publicReportExcel(lastQueryParams,"exportExcelSC020/table1");
}
//查询
function query() {
	if($("#ORG_NUM").length>0){
		if($("#ORG_NUM").val()==undefined||$("#ORG_NUM").val()==null||$("#ORG_NUM").val()==null){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
	if($("#SUPER_ORG_NUM").length>0){
		if($("#SUPER_ORG_NUM").val()==undefined||$("#SUPER_ORG_NUM").val()==null||$("#SUPER_ORG_NUM").val()==null){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
    TableObjNotPage.table1();
    
}
function initTable(tableId,columns){
	$('#'+tableId).bootstrapTable('destroy').bootstrapTable({
        url: portal.bp() + '/table/SC020/'+tableId,
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
    			'DATA_DT':$("#DATA_DT").val(),
            	'ORG_NUM':$("#ORG_NUM").val(),
            	'ORG_HIRCHY':$("#ORG_HIRCHY").selectpicker("val"),
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'A_MKB_IBANK_MDL_BIZ_INCOM_PER-SC020',
            	'logMenuId':mid,
        	}
            return {
        		'pageSize': params.limit,
                'pageNum': (params.offset / params.limit) + 1,
            	'DATA_DT':$("#DATA_DT").val(),
            	'ORG_NUM':$("#ORG_NUM").val(),
            	'ORG_HIRCHY':$("#ORG_HIRCHY").selectpicker("val"),
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'A_MKB_IBANK_MDL_BIZ_INCOM_PER-SC020',
            	'logMenuId':mid,
            };
        },
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        pageNum: 1,      //初始化加载第一页，默认第一页
        pageSize: 50,      //每页的记录行数（*）
        pageList: [50,100],  //可供选择的每页的行数（*）
        clickToSelect: true,    //是否启用点击选中行
        resizable:true,			//是否可调整列宽度
        responseHandler: function (res) { //服务端返回数据
            if (res.code == '200') {
                return res.data;
            } else {
                layer.msg(res.message, {icon: 2});
                return {};
            }
        },
        onLoadSuccess: function (data) {
            var activeIndex = $("#nav-tabs").find(".active").prevAll().length;
            $('#'+tableId).bootstrapTable('resetView',{
                height:getTableHeight(document,activeIndex)
            });
            resizeTables();
        },
        columns: columns

    });
}

var numArr = [];
var filedNameArray = ['product_firsttitle'];

function mergeCell(data, fieldName, colspan, target) {
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
var TableObjNotPage = {
		table1: function () {
	        var columns = [
	              [
					{
					    field: 'xuhao',
					    title: '序号',
					    align: 'center',
					    rowspan: 1,
	                    colspan: 1,
	                    align: "center",
	                    valign: "middle",
	                    rowNumber:1,
	                    colNumber:1,
					    formatter: function (value, row, index) {
					        return index + 1;
					    }
					},
	               {
	            	  field:'org_num',
	            	  title:'经营单位编号',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "center",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:2,
	               },
	               {
	            	  field:'org_name',
	            	  title:'经营单位名称',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:3,
	               },
	               {
	            	   field:'m_trust_mdl_biz_incom',
	            	   title:'当月托管中收',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:4,
	               },
	               {
	            	   field:'m_agn',
	            	   title:'当月代销',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:5,
	               },
	               {
	            	   field:'m_agn_hq_alloc',
	            	   title:'当月代销总行划拨',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:6,
	               },
	               {
	            	   field:'accum_trust_mdl_biz_incom',
	            	   title:'累计托管中收',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:7,
	               },
	               {
	            	   field:'accum_agn',
	            	   title:'累计代销',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:8,
	               },
	               {
	            	   field:'accum_trust_mdl_biz_incom_and_agn',
	            	   title:'累计托管中收及代销',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:9,
	               },
	               {
	            	   field:'negu_index_val',
	            	   title:'托管及代销中收月度指标',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:10,
	               },
	               {
	            	   field:'negu_index_cmplt_ratio',
	            	   title:'托管及代销中收月度指标完成比',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:11,
	               },
	               {
	            	   field:'m_ibank_mdl_biz_incom',
	            	   title:'当月同业中收',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:12,
	               },
	               {
	            	   field:'accum_ibank_mdl_biz_incom',
	            	   title:'累计同业中收',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "left",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:13,
	               },
	              ],
	        ];
	        initTable("table1",columns);
	    },	    
	};
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $("#DATA_DT").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "4").change();
    if($("#ORG_HIRCHY").val()=='4'){
    	
    }else{
    	$("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5").change();
    }
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}