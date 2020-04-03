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
					}
					if(item.ENCODE=='5'){
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
    $("#tab2").click(function(){
    	TableObjNotPage.table2();
    });
});
/*function exportCurrentPageExcel(){
	var id = $("#nav-tabs").find(".active").children()[0].id;
	var tableId = "table"+ id.substr(id.length-1);
	var columns = $("#"+tableId).bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0,true);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	//lastQueryParams.mergeColumns="product_firsttitle:0";
	publicReportExcel(lastQueryParams,"exportExcelSC017/"+tableId);
}*/
function exportAllDataExcel(){
	var reportExcelDTO_SC017 = [];
	var d1 = {"tableNo":1};
	var d2 = {"tableNo":2};
	
	var columns1 = $("#table1").bootstrapTable('getOptions').columns;
	var result1 = tableNeedCopy(columns1,0,true);
	d1.tableHead = JSON.stringify(result1);
//	d1.mergeColumns = "product_firsttitle:0";
	d1.tableName = $("#tab1").text();
	reportExcelDTO_SC017.push(d1);
	
	var columns2 = $("#table2").bootstrapTable('getOptions').columns;
	var result2 = tableNeedCopy(columns2,0,true);
	d2.tableHead = JSON.stringify(result2);
//	d2.mergeColumns = "product_firsttitle:0";
	d2.tableName = $("#tab2").text();
	reportExcelDTO_SC017.push(d2);
	
	
	var data = {
		"reportExcelMoreTable":reportExcelDTO_SC017,
		"dATA_DT":lastQueryParams.DATA_DT,
		"oRG_NUM":lastQueryParams.ORG_NUM,
		"oRG_HIRCHY":lastQueryParams.ORG_HIRCHY,
		"cURR_CD":lastQueryParams.CURR_CD,
		"dW":lastQueryParams.DW,
		"listdata1":$("#table1").bootstrapTable("getData")
	}
	$.ajax({
		url : portal.bp() + '/report/exportExcelSC017',
		type:'post',
		cache:false,
		async : false,
		contentType: "application/json;charset=UTF-8",
		dataType: "json",
		data:JSON.stringify(data),
		success : function(d) {
			if(d.code=='200'){
				downloadByFileName(d.data);
			}else{
				layer.msg(d.message,{icon:2});
			}
		}
	});
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
	var oh = $("#ORG_HIRCHY").val();
	
	var orgNumText = $("#ORG_NUM").find("option:selected").text();
	if(oh=='4'){
		var html = "<ul class=\"ul-basicinfo\" id=\"gxhInfo\">\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">统计日期：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showDateDT\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">机构号：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showOrgNum\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">机构名称：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showOrgName\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">管辖行所含支行个数：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showZHNum\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								    </ul>";
		$("#basicInfoDIV").empty().append(html);
		
		$("#zhList").show();
		
		$("#showDateDT").text($("#DATA_DT").val());
		$("#showOrgName").text(orgNumText.split("-")[1]);
		$("#showOrgNum").text(orgNumText.split("-")[0]);
		TableObjNotPage.table1();
	}else if(oh=='5'){
		var html = "<ul class=\"ul-basicinfo\" id=\"zhInfo\">\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">统计日期：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showDateDTZH\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">机构号：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showOrgNumZH\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">机构名称：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showOrgNameZH\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">所属管辖行机构号：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showSuperOrgNum\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								        <li>\r\n" + 
		"								        	<span class=\"ul-basicinfo-title\">所属管辖行机构名称：</span>\r\n" + 
		"								        	<span class=\"ul-basicinfo-body\" id=\"showSuperOrgName\">-</span>\r\n" + 
		"								        </li>\r\n" + 
		"								    </ul>";
		$("#basicInfoDIV").empty().append(html);
		
//		$("#gxhInfo").hide();
//		$("#zhInfo").show();
		$("#zhList").hide();
		
		$("#showDateDTZH").text($("#DATA_DT").val());
		$("#showOrgNameZH").text(orgNumText.split("-")[1]);
		$("#showOrgNumZH").text(orgNumText.split("-")[0]);
		queryZHInfo(orgNumText.split("-")[0]);
	}
    TableObjNotPage.table2();
    
}
function queryZHInfo(orgNum){
	$.ajax({
		url : portal.bp() + '/table/SC017/queryZHInfo',
		type : "get",
		async : true,
		data : {
			'orgNum':orgNum
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				$("#showSuperOrgNum").text(data.data.superOrgNum);
				$("#showSuperOrgName").text(data.data.superOrgName);
			}
		}
	});
}
function initTable(tableId,columns){
	$('#'+tableId).bootstrapTable('destroy').bootstrapTable({
        url: portal.bp() + '/table/SC017/'+tableId,
        method: 'get',      //请求方式（*）
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,     //是否显示分页（*）
        sortStable: true,      //是否启用排序
        sortOrder: "desc",     //排序方式
        showColums:false,
        singleSelect: false,    //是否单选，true时没有全选按钮
        "queryParamsType": "limit",
        contentType: "application/x-www-form-urlencoded",
        queryParams: function (params) {
        	lastQueryParams = {
    			'DATA_DT':$("#DATA_DT").val(),
            	'ORG_NUM':$("#ORG_NUM").val(),
            	'ORG_HIRCHY':$("#ORG_HIRCHY").selectpicker("val"),
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),	
            	'logTableName':'A_MKB_IBANK_BIZ_PER_QRY-SC017',
            	'logMenuId':mid,
        	}
            return {
            	'DATA_DT':$("#DATA_DT").val(),
            	'ORG_NUM':$("#ORG_NUM").val(),
            	'ORG_HIRCHY':$("#ORG_HIRCHY").selectpicker("val"),
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'A_MKB_IBANK_BIZ_PER_QRY-SC017',
            	'logMenuId':mid,
            };
        },
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
        	if(tableId=='table1'){
        		$("#showZHNum").text(data.length);
        	}
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
	            	  field:'ORG_NUM',
	            	  title:'支行行号',
	            	  width:'146',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "center",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:1,
	               },
	               {
	            	  field:'ORG_NAME',
	            	  title:'支行名称',
	            	  width:'185',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:2,
	               },
	              ],
	        ];
	        initTable("table1",columns);
	    },	    
	    table2: function () {
	        var columns = [
	              [
	               {
	            	  field:'ass_prft_proj',
	            	  title:'考核利润项目',
	            	  width:'146',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "center",
	                  valign: "middle",
	                  rowNumber:1,
		              colNumber:1,
	               },
	               {
	            	  field:'per_val',
	            	  title:'业绩值',
	            	  width:'185',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
		              colNumber:2,
	               },
	               {
	            	   field:'capt_qtty_size_proj',
	            	   title:'资金量规模项目',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
		               valign: "middle",
		               rowNumber:1,
			           colNumber:3,
	               },
	               {
	            	   field:'num',
	            	   title:'户数(户)',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:4,
	               },
	               {
	            	   field:'crnt_bal',
	            	   title:'当前余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:5,
	               },
	               {
	            	   field:'m_daily_bal',
	            	   title:'月日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:6,
	               },
	               {
	            	   field:'q_daily_bal',
	            	   title:'季日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:7,
	               },
	               {
	            	   field:'y_daily_bal',
	            	   title:'年日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:8,
	               },
	               {
	            	   field:'cld_davgbal',
	            	   title:'较上日余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:9,
	               },
	               {
	            	   field:'mb_davgbal',
	            	   title:'较月初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:10,
	               },
	               {
	            	   field:'qb_davgbal',
	            	   title:'较季初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:11,
	               },
	               {
	            	   field:'yb_davgbal',
	            	   title:'较年初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
	            	   colNumber:12,
	               },
	              ], 
	        ];
	        initTable("table2",columns);
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