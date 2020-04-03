var date = $.param.getEtlDate();
var mid = getUrlParam('mid');
var result;
var lastQueryParams = {};
$(function(){
	/*$("#urla1").attr("href",portal.bp()+"/table/ZH001_1");
	$("#urla2").attr("href",portal.bp()+"/table/ZH001_2");*/
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
					if(index==0){
						firstValue = item.ENCODE;
					}
					
					html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
				});
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
    $("#tab2").click(function(){
    	TableObjNotPage.table2();
    });
    $("#tab3").click(function(){
    	TableObjNotPage.table3();
    });
    $("#tab4").click(function(){
    	TableObjNotPage.table4();
    });
    $("#tab5").click(function(){
    	TableObjNotPage.table5();
    });
    $("#tab6").click(function(){
    	TableObjNotPage.table6();
    });
    $("#tab7").click(function(){
    	TableObjNotPage.table7();
    });


	//初始化报表说明(备注)
	$.ajax({
		url: portal.bp() + '/table/queryNote',
		type: "get",
		async: false, // 同步 为全局变量赋值
		data: {
			'tableName': 'ZH001_NOTE'
		},
		cache: false,
		success: function (data) {
			var s = data.data;
			if(s.length == 0){
				var trHtml = "<tr><td>暂无报表说明!</td></tr>";
				$("#noteList").append(trHtml);
			}else{
				for(var i = 0;i<s.length;i++){
					var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>"+s[i].table_NOTE+"</td></tr>";
					$("#noteList").append(trHtml);
				}
				$("#noteList .no-records-found").hide();
			}




		}
	});

});
function exportCurrentPageExcel(){
	var id = $("#nav-tabs").find(".active").children()[0].id;
	var tableId = "table"+ id.substr(id.length-1);
	var columns = $("#"+tableId).bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	lastQueryParams.mergeColumns="product_firsttitle:0";
	publicReportExcel(lastQueryParams,"exportExcelZH001/"+tableId);
}
function exportAllDataExcel(){
	var reportExcelDTO_ZH001 = [];
	var d1 = {"tableNo":1};
	var d2 = {"tableNo":2};
	var d3 = {"tableNo":3};
	var d7 = {"tableNo":4};
	var d4 = {"tableNo":5};
	var d5 = {"tableNo":6};
	var d6 = {"tableNo":7};
	
	var columns1 = $("#table1").bootstrapTable('getOptions').columns;
	var result1 = tableNeedCopy(columns1,0);
	d1.tableHead = JSON.stringify(result1);
	d1.mergeColumns = "product_firsttitle:0";
	d1.tableName = $("#tab1").text();
	reportExcelDTO_ZH001.push(d1);
	
	var columns2 = $("#table2").bootstrapTable('getOptions').columns;
	var result2 = tableNeedCopy(columns2,0);
	d2.tableHead = JSON.stringify(result2);
	d2.mergeColumns = "product_firsttitle:0";
	d2.tableName = $("#tab2").text();
	reportExcelDTO_ZH001.push(d2);
	
	var columns3 = $("#table3").bootstrapTable('getOptions').columns;
	var result3 = tableNeedCopy(columns3,0);
	d3.tableHead = JSON.stringify(result3);
	d3.mergeColumns = "product_firsttitle:0";
	d3.tableName = $("#tab3").text();
	reportExcelDTO_ZH001.push(d3);
	
	var columns4 = $("#table4").bootstrapTable('getOptions').columns;
	var result4 = tableNeedCopy(columns4,0);
	d4.tableHead = JSON.stringify(result4);
	d4.mergeColumns = "product_firsttitle:0";
	d4.tableName = $("#tab4").text();
	reportExcelDTO_ZH001.push(d4);
	
	var columns5 = $("#table5").bootstrapTable('getOptions').columns;
	var result5 = tableNeedCopy(columns5,0);
	d5.tableHead = JSON.stringify(result5);
	d5.mergeColumns = "product_firsttitle:0";
	d5.tableName = $("#tab5").text();
	reportExcelDTO_ZH001.push(d5);
	
	var columns6 = $("#table6").bootstrapTable('getOptions').columns;
	var result6 = tableNeedCopy(columns6,0);
	d6.tableHead = JSON.stringify(result6);
	d6.mergeColumns = "product_firsttitle:0";
	d6.tableName = $("#tab6").text();
	reportExcelDTO_ZH001.push(d6);
	
	var columns7 = $("#table7").bootstrapTable('getOptions').columns;
	var result7 = tableNeedCopy(columns7,0);
	d7.tableHead = JSON.stringify(result7);
	d7.mergeColumns = "product_firsttitle:0";
	d7.tableName = $("#tab7").text();
	reportExcelDTO_ZH001.push(d7);
	
	
	
	
	var data = {
		"reportExcelMoreTable":reportExcelDTO_ZH001,
		"dATA_DT":lastQueryParams.DATA_DT,
		"oRG_NUM":lastQueryParams.ORG_NUM,
		"oRG_HIRCHY":lastQueryParams.ORG_HIRCHY,
		"cURR_CD":lastQueryParams.CURR_CD,
		"dW":lastQueryParams.DW
	}
	$.ajax({
		url : portal.bp() + '/report/exportExcelZH001',
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
	TableObjNotPage.table1();
    TableObjNotPage.table2();
    TableObjNotPage.table3();
    TableObjNotPage.table7();
    TableObjNotPage.table4();
    TableObjNotPage.table5();
    TableObjNotPage.table6();
    
}
function initTable(tableId,columns){
	$('#'+tableId).bootstrapTable('destroy').bootstrapTable({
        url: portal.bp() + '/table/zhTable/ZH001/'+tableId,
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
            	'logTableName':'ZH001',
            	'logMenuId':mid,
        	}
            return {
            	'DATA_DT':$("#DATA_DT").val(),
            	'ORG_NUM':$("#ORG_NUM").val(),
            	'ORG_HIRCHY':$("#ORG_HIRCHY").selectpicker("val"),
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'ZH001',
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
        	mergeCell(data, 'product_firsttitle', 1, '#'+tableId);
            var dw = $("#DW").val();
            if (dw != undefined && dw != null) {
                var old = $("#"+tableId+" thead tr:eq(1) th div:eq(0)").text();
                if (old.indexOf("单位") > -1) {
                    $("#"+tableId+" thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                }
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
	            	  field:'product_firsttitle',
	            	  title:'',
	            	  width:'146',
	            	  rowspan: 2,
	                  colspan: 1,
	                  align: "center",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:1,
	               },
	               {
	            	  field:'product_secondtitle',
	            	  title:'项目',
	            	  width:'185',
	            	  rowspan: 2,
	                  colspan: 1,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:2,
	                  formatter: function (value, row, index) {
	                	var firstTitle  = row.product_firsttitle;
	                	var seq  = row.seq_num;	
	                	var tableId='1';
	                	//业务规模
	                	// 1-21 表内负债业务下钻
	                	if(seq == "1"){
	                	      return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	                	}else if(seq == "2"){	 
	                	      return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
                	    }else if(seq == "3"){
	                	      return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "4"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "5"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "6"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "7"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "8"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "9"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "10"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "11"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "12"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "13"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "14"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "15"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "16"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "17"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "18"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "19"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "20"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "21"){
							  return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "22"){//22-38表内资产业务下钻
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "23"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "24"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "25"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "26"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "27"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "28"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "29"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "30"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "31"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "32"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "33"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "34"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "35"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "36"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "37"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "38"){
							  return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "39"){//39-43 表外业务下钻
							  return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "40"){
							  return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "41"){
							  return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "42"){
							  return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else if(seq == "43"){
							  return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
						}else{
                		  return value;
						}
	                	
	                  },
	               },
	              /* {
	            	  field:'seq_num',
	            	  title:'序号',
	            	  rowspan: 2,
	                  colspan: 1,
	                  visible:true,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
	                  colNumber:3,
		           },*/
	               {
	            	   field:'',
	            	   title:'时点余额',
	            	   rowspan: 1,
	            	   colspan: 5,
	            	   align: "center",
		               valign: "middle",
		               rowNumber:1,
		               colNumber:3,
	               },
	               {
	            	   field:'',
	            	   title:'日均余额',
	            	   rowspan: 1,
	            	   colspan: 6,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:4,
	               },
	              ], 
	              [
	               {
	            	   field:'pnt_bal',
	            	   title:'时点',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:3,
	               },
	               {
	            	   field:'pnt_bal_cld',
	            	   title:'较上日',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:4,
	               },
	               {
	            	   field:'pnt_bal_clm',
	            	   title:'较上月',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:5,
	               },
	               {
	            	   field:'pnt_bal_clq',
	            	   title:'较上季',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:6,
	               },
	               {
	            	   field:'pnt_bal_yb',
	            	   title:'较年初',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:7,
	               },
	               {
	            	   field:'m_daily',
	            	   title:'月日均',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:8,
	               },
	               {
	            	   field:'m_daily_clm',
	            	   title:'较上月',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:9,
	               },
	               {
	            	   field:'q_daily',
	            	   title:'季日均',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:10,
	               },
	               {
	            	   field:'q_daily_clq',
	            	   title:'较上季',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:11,
	               },
	               {
	            	   field:'y_daily',
	            	   title:'年日均',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:12,
	               },
	               {
	            	   field:'y_daily_cly',
	            	   title:'较上年',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:2,
		               colNumber:13,
	               },
	              ],
	        ];
	        initTable("table1",columns);
	    },	    
	    table2: function () {
	        var columns = [
	              [
	               {
	            	  field:'product_firsttitle',
	            	  title:'',
	            	  width:'146',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "center",
	                  valign: "middle",
	                  rowNumber:1,
		              colNumber:1,
	               },
	               {
	            	  field:'product_secondtitle',
	            	  title:'项目',
	            	  width:'185',
	            	  rowspan: 1,
	                  colspan: 1,
	                  align: "left",
	                  valign: "middle",
	                  rowNumber:1,
		              colNumber:2,
	                  formatter: function (value, row, index) {
		                	var firstTitle  = row.product_firsttitle;
		                	var seq  = row.seq_num;	
		                	var tableId='2';
		                	// 五级分类
		                	if(seq == "1"){
		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
		                	}else if(seq == "2"){
		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   

		                	}else if(seq == "3"){
		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   

		                	}else if(seq == "4"){
		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   

		                	}else if(seq == "5"){
		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   

		                	}else{
		                		return value;
		                	}
	                  }
	                 
	               },
	               /*{
		            	  field:'seq_num',
		            	  title:'序号',
		            	  rowspan: 1,
		                  colspan: 1,
		                  visible:false,
		                  align: "left",
		                  valign: "middle",
			           },*/
	               {
	            	   field:'normal_amt',
	            	   title:'正常金额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
		               valign: "middle",
		               rowNumber:1,
			           colNumber:3,
	               },
	               {
	            	   field:'concn_amt',
	            	   title:'关注金额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:4,
	               },
	               {
	            	   field:'sub_amt',
	            	   title:'次级金额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:5,
	               },
	               {
	            	   field:'doubt_amt',
	            	   title:'可疑金额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:6,
	               },
	               {
	            	   field:'loss_amt',
	            	   title:'损失金额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
			           colNumber:7,
	               },
	              ], 
	        ];
	        initTable("table2",columns);
	    },
	    table3: function () {
	    	var columns = [
	    	               [
	    	                {
	    	                	field:'product_firsttitle',
	    	                	title:'',
	    	                	width:'146',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:1,
	    	                },
	    	                {
	    	                	field:'product_secondtitle',
	    	                	title:'项目',
	    	                	width:'185',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "left",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:2,
	    	                	formatter: function (value, row, index) {
	    		                	var firstTitle  = row.product_firsttitle;
	    		                	var seq  = row.seq_num;	
	    		                	var tableId='3';
	    		                	// 考核利润
	    		                	//1-21 表内负债业务下钻
	    		                	if(seq == "1"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "2"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "3"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "4"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "5"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "6"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "7"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "8"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "9"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "11"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "12"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "13"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "14"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "15"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "16"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "17"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "18"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "19"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "20"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "21"){
	    		                	    return '<a onclick="modelOne(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "22"){//22-33表内资产业务下钻
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "23"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "24"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "25"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "26"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "28"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "29"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "30"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "31"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "32"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "33"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else{
	    		                		return value;
	    		                	}
	    	                  }
	    	                },/*{
	    		            	  field:'seq_num',
	    		            	  title:'序号',
	    		            	  rowspan: 1,
	    		                  colspan: 1,
	    		                  visible:false,
	    		                  align: "left",
	    		                  valign: "middle",
	    			           },*/
	    	                {
	    	                	field:'y_daily',
	    	                	title:'年日均',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:3,
	    	                },
	    	                {
	    	                	field:'int_incom_expns',
	    	                	title:'利息收入/利息支出',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:4,
	    	                },
	    	                {
	    	                	field:'ftp_prft_cost',
	    	                	title:'FTP收益/FTP成本',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:5,
	    	                },
	    	                {
	    	                	field:'ftp_ass_prft',
	    	                	title:'FTP考核利润',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:6,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table3",columns);
	    },
	    table7: function () {
	    	var columns = [
	    	               [
	    	                {
	    	                	field:'product_firsttitle',
	    	                	title:'',
	    	                	width:'146',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:1,
	    	                },
	    	                {
	    	                	field:'product_secondtitle',
	    	                	title:'项目',
	    	                	width:'185',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "left",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:2,
	    	                	formatter: function (value, row, index) {
	    		                	var firstTitle  = row.product_firsttitle;
	    		                	var seq  = row.seq_num;	
	    		                	var tableId='7';
	    		                	// 中间业务收入
	    		                	if(seq == "1"){
	    		                	    return '<a onclick="modelFour(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "2"){
	    		                	    return '<a onclick="modelFour(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "3"){
	    		                	    return '<a onclick="modelFour(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else{
	    		                		return value;
	    		                	}
	    	                  }
	    	                },/*{
	    		            	  field:'seq_num',
	    		            	  title:'序号',
	    		            	  rowspan: 1,
	    		                  colspan: 1,
	    		                  visible:false,
	    		                  align: "left",
	    		                  valign: "middle",
	    			           },*/
	    	                {
	    	                	field:'amt',
	    	                	title:'手续费收入（时点）',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:3,
	    	                },{
	    	                	field:'index',
	    	                	title:'指标',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:4,
	    	                },
	    	                {
	    	                	field:'index_cmplt_ratio',
	    	                	title:'指标完成比',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:5,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table7",columns);
	    },
	    table4: function () {
	    	var columns = [
	    	               [
	    	                {
	    	                	field:'product_firsttitle',
	    	                	title:'',
	    	                	width:'146',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:1,
	    	                },
	    	                {
	    	                	field:'product_secondtitle',
	    	                	title:'项目',
	    	                	width:'185',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "left",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:2,
	    	                },/*{
	    		            	  field:'seq_num',
	    		            	  title:'序号',
	    		            	  rowspan: 1,
	    		                  colspan: 1,
	    		                  visible:false,
	    		                  align: "left",
	    		                  valign: "middle",
	    			           },*/
	    	                {
	    	                	field:'comm_fee_incom',
	    	                	title:'金额',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:3,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table4",columns);
	    },
	    table5: function () {
	    	var columns = [
	    	               [
	    	                {
	    	                	field:'product_firsttitle',
	    	                	title:'',
	    	                	width:'146',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:1,
	    	                },
	    	                {
	    	                	field:'product_secondtitle',
	    	                	title:'项目',
	    	                	width:'185',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "left",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:2,
	    	                },/*{
	    		            	  field:'seq_num',
	    		            	  title:'序号',
	    		            	  rowspan: 1,
	    		                  colspan: 1,
	    		                  visible:false,
	    		                  align: "left",
	    		                  valign: "middle",
	    			           },*/
	    	                {
	    	                	field:'amt',
	    	                	title:'金额',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:3,
	    	                },
	    	                {
	    	                	field:'index',
	    	                	title:'指标',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:4,
	    	                },
	    	                {
	    	                	field:'index_cmplt_ratio',
	    	                	title:'指标完成比',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:5,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table5",columns);
	    },
	    table6: function () {
	    	var columns = [
	    	               [
	    	                {
	    	                	field:'product_firsttitle',
	    	                	title:'',
	    	                	width:'146',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:1,
	    	                },
	    	                {
	    	                	field:'product_secondtitle',
	    	                	title:'项目',
	    	                	width:'185',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "left",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:2,
	    	                	formatter: function (value, row, index) {
	    		                	var firstTitle  = row.product_firsttitle;
	    		                	var seq  = row.seq_num;	
	    		                	var tableId='6';
	    		                	// EVA
	    		                	//1-7表内资产业务
	    		                	if(seq == "1"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "2"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "3"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "5"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "6"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "7"){
	    		                	    return '<a onclick="modelTwo(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "9"){//9-13表外业务下钻
	    		                	    return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "10"){
	    		                	    return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "11"){
	    		                	    return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "12"){
	    		                	    return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else if(seq == "13"){
	    		                	    return '<a onclick="modelThree(' + '\'' + value + '\',\'' + row + '\',\'' + index + '\',\'' + seq + '\',\'' + tableId + '\')">' + value + '</a>';   
	    		                	}else{
	    		                		return value;
	    		                	}
	    	                  }
	    	                },/*{
	    		            	  field:'seq_num',
	    		            	  title:'序号',
	    		            	  rowspan: 1,
	    		                  colspan: 1,
	    		                  visible:false,
	    		                  align: "left",
	    		                  valign: "middle",
	    			           },*/
	    	                {
	    	                	field:'bal',
	    	                	title:'余额（当前时点）',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:3,
	    	                },
	    	                {
	    	                	field:'risk_slw_rels',
	    	                	title:'风险缓释',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:4,
	    	                },
	    	                {
	    	                	field:'risk_expos',
	    	                	title:'风险敞口',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:5,
	    	                },
	    	                {
	    	                	field:'bc_ocup',
	    	                	title:'经济资本占用',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:6,
	    	                },
	    	                {
	    	                	field:'bc_ocup_cost',
	    	                	title:'经济资本占用成本',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    				        colNumber:7,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table6",columns);
	    },
	};
//modle弹框加载数据
/*var TableObjPageSub = {
		
		table1: function (selectStr,tableStr1,whereStr1,tableStr2,whereStr2,tableStr3,whereStr3,tableStr4,whereStr4,orderStr,matrixingTagStr,DW) {
	        var columns = [
	              [	               
					{
						  field:'number',
						  title:'序号',
						  rowspan: 2,
		                  colspan: 1,
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },{
						 field:'proj_name',
						 title:'项目',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'org_name',
						 title:'业务所属机构',
						 rowspan: 2,
		                 colspan: 1,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'acct_num',
						 title:'账户编号',
						 rowspan: 2,
		                 colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'cust_num',
						 title:'客户编号',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'cust_name',
						 title:'客户名称',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'rate',
						 title:'利率(增值税后)',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'int_expns',
						 title:'利息支出',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'ftp_price',
						 title:'FTP价格',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'ftp_prft',
						 title:'FTP收益',
						 rowspan: 2,
		                  colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'ftp_spr',
						 title:'FTP利差',
						 rowspan: 2,
		                 colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'ftp_ass_prft',
						 title:'FTP考核利润',
						 rowspan: 2,
		                 colspan: 1,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'',
						 title:'时点',
						 rowspan: 1,
		                 colspan: 5,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'',
						 title:'日均余额',
						 rowspan: 1,
		                 colspan: 6,
						 align: "center",
						 valign: "middle",						 
					 },
					 
	               ],
	               [
	                  
						{
							 field:'pnt_bal',
							 title:'时点',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",
							 
						},{
							 field:'pnt_bal_cld',
							 title:'较上日',
							 rowspan: 1,
							 colspan: 1,
							 align: "center",
							 valign: "middle",
							 
						},{
							 field:'pnt_bal_clm',
							 title:'较上月',
							 rowspan: 1,
							 colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'pnt_bal_clq',
							 title:'较上季',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'pnt_bal_yb',
							 title:'较年初',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'m_daily',
							 title:'月日均',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'m_daily_clm',
							 title:'较上月',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'q_daily',
							 title:'季日均',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'q_daily_clq',
							 title:'较上季',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'y_daily',
							 title:'年日均',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},{
							 field:'y_daily_cly',
							 title:'较上年',
							 rowspan: 1,
						     colspan: 1,
							 align: "center",
							 valign: "middle",						 
						},
	                  
	                  ] 
	        ];
	        $('#detailModelTableOne').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/ZH001/query',
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
	                return {	                	
	                	'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,	 
	                    'selectStr': selectStr,
	                    'tableStr1': tableStr1,
	                    'whereStr1': whereStr1,
	                    'tableStr2': tableStr2,
	                    'whereStr2': whereStr2,
	                    'tableStr3': tableStr3,
	                    'whereStr3': whereStr3,
	                    'tableStr4': tableStr4,
	                    'whereStr4': whereStr4,
	                    'orderStr': orderStr,
	                    'matrixingTagStr': matrixingTagStr,	  
	                    'DW': DW,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	           // height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	if($.isArray(res.data) && res.data.length==1 && res.data[0] == null){
	    					return [];
	    				}
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            onLoadSuccess: function (data) {
	            	//initBootStrapTablevalidateEdit($("#detailModelTableOne"));
	            	$("#detailModelTableOne").bootstrapTable("resetView");
					resizeTables();
	            },	                        
	            columns: columns,
	        });
	    }

}
*/

/**
*
* 综合表下钻表1 表内负债业务
* @param tableId
*/
function modelOne(value,row,index,seq,tableId) {
	var selectStr ="proj_cd,proj_name,org_name,acct_num,cust_num,cust_name," +
		"rate,int_expns,ftp_price,ftp_prft,ftp_spr,ftp_ass_prft,pnt_bal," +
		"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm," +
		"q_daily,q_daily_clq,y_daily,y_daily_cly";
	var selectStr2="",selectStr3="",selectStr4="";
	var matrixingTagStr ="0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1";
	var tableStr1="",whereStr1="";
	var tableStr2="",whereStr2="";
	var tableStr3="",whereStr3="";
	var tableStr4="",whereStr4="";
	var orderStr='';
	var currCd = $("#CURR_CD").val();
	var DW = $("#DW").val();
	var dataDt = $("#DATA_DT").val();
	var orgNum = $("#ORG_NUM").val();
	var orgHirchy = $("#ORG_HIRCHY").val();
	var title='机构业绩综合统计表-表内负债业务_'+$.trim(value);
	title = encodeURI(title);
	if(tableId=="1"){//业务规模项目
		if(seq == "1"){		  
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = "";
			  whereStr1 = "  1=1 and PROJ_CD in('01','02','03','04','05','06','07') ";
			  whereStr2 = "  1=1 and PROJ_CD ='01' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "2"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "3"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "4"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "5"){
		      tableStr1 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "6"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "7"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "8"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "9"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='07' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "10"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and PROJ_CD in('01','02','03','04','05') ";
			  whereStr2 = " 1=1 and PROJ_CD ='02' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "11"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "12"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "13"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "14"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "15"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "16"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "17"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB ";
			  whereStr1 = " 1=1 and PROJ_CD in( '01','02','03','04','05','06','07') ";
			  whereStr2 = " 1=1 and PROJ_CD in( '01','02') ";
			  whereStr3 = " 1=1 and PROJ_CD in( '01','02','03','04','05') ";
			  orderStr = " order by 1,4";
		}else if(seq == "18"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "19"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "20"){
		  	  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('01','02') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "21"){
		  	  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB ";
			  tableStr4 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB ";
			  whereStr1 = " 1=1 and proj_cd in( '01','02','03','04','05','06','07') ";
			  whereStr2 = " 1=1 and proj_cd in( '01','02') ";
			  whereStr3 = " 1=1 and proj_cd in( '01','02','03','04','05') ";
			  whereStr4 = " 1=1 and proj_cd in( '01','02') ";
			  orderStr = " order by 1,4";
		}
	}else if(tableId=="3"){//考核利润项目
		if(seq == "1"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = "";
			  whereStr1 = "  1=1 and PROJ_CD in('01','02','03','04','05','06','07') ";
			  whereStr2 = "  1=1 and PROJ_CD ='01' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "2"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "3"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "4"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "5"){
		      tableStr1 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "6"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "7"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "8"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "9"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='07' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "11"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and PROJ_CD in('01','02','03','04','05') ";
			  whereStr2 = " 1=1 and PROJ_CD ='02' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "12"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "13"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "14"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "15"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "16"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "17"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "18"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB ";
			  whereStr1 = " 1=1 and PROJ_CD in( '01','02','03','04','05','06','07') ";
			  whereStr2 = " 1=1 and PROJ_CD in( '01','02') ";
			  whereStr3 = " 1=1 and PROJ_CD in( '01','02','03','04','05') ";
			  orderStr = " order by 1,4";
		}else if(seq == "19"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "20"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "21"){
	  		  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_LIAB "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_FIN_LIAB ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_REB_LIAB ";
			  tableStr4 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB ";
			  whereStr1 = " 1=1 and proj_cd in( '01','02','03','04','05','06','07') ";
			  whereStr2 = " 1=1 and proj_cd in( '01','02') ";
			  whereStr3 = " 1=1 and proj_cd in( '01','02','03','04','05') ";
			  whereStr4 = " 1=1 and proj_cd in( '01','02') ";
		  orderStr = " order by 1,4";
		}
	} 
	
	if(currCd=='03'){
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		
	}else{
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		
	}
	
	//modle式弹框
	//TableObjPageSub.table1(selectStr,tableStr1,whereStr1,tableStr2,whereStr2,tableStr3,whereStr3,tableStr4,whereStr4,orderStr,matrixingTagStr,DW);
    //$("#modelOneTitle").text(value); 
	//$("#modelOne").modal("show");
	
	//layer式弹框
	layer.open({
        type:2,
        title:'机构业绩综合统计表-表内负债业务_'+$.trim(value),
        shadeClose:true,
        shade:0.8,
        area:['1000px','650px'],
        content:portal.bp() + "/table/ZH001_01Index?selectStr="+selectStr+"&"+"tableStr1="+tableStr1+"&"+"whereStr1="+whereStr1+"&"+
        	"tableStr2="+tableStr2+"&"+"whereStr2="+whereStr2+"&"+"tableStr3="+tableStr3+"&"+"whereStr3="+whereStr3+"&"+
        	"tableStr4="+tableStr4+"&"+"whereStr4="+whereStr4+"&"+"orderStr="+orderStr+"&"+"matrixingTagStr="+matrixingTagStr+"&"+
        	"DW="+DW+"&"+"title="+title+"&"+"currCd="+currCd+"&"+"dataDt="+dataDt+"&"+"selectStr2="+selectStr2+"&"+"selectStr3="+selectStr3+"&"+"selectStr4="+selectStr4+"&"+"mid="+mid
    });
	
 };
 
 /**
 *
 * 综合表下钻表2 表内资产业务
 * @param tableId
 */
 function modelTwo(value,row,index,seq,tableId) {
	var selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_incom,ftp_price,"+
		"ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
		"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
	var selectStr2="",selectStr3="",selectStr4="";
	var matrixingTagStr ="0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1";
	var tableStr1="",whereStr1="";
	var tableStr2="",whereStr2="";
	var tableStr3="",whereStr3="";
	var tableStr4="",whereStr4="";
	var orderStr='';
	var currCd = $("#CURR_CD").val();
	var DW = $("#DW").val();
	var dataDt = $("#DATA_DT").val();
	var orgNum = $("#ORG_NUM").val();
	var orgHirchy = $("#ORG_HIRCHY").val();
	var title='机构业绩综合统计表-表内资产业务_'+$.trim(value);
	title = encodeURI(title);
	if(tableId=="1"){//业务规模
		if(seq == "22"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = "  1=1 and PROJ_CD ='06' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "23"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('05','06') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "24"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "25"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "26"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "27"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "28"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "29"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "30"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "31"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "32"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET ";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = " 1=1 and proj_cd ='04' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "33"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET ";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('05','06') ";
			  whereStr2 = " 1=1 and proj_cd ='01' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "34"){
			  selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "35"){
			  selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "36"){
			  selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "37"){
			  selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('03','04','05') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "38"){
			  selectStr3 = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
					"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
					"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB ";
			  whereStr1 = " 1=1 and proj_cd in('05','06')  ";
			  whereStr2 = " 1=1 and proj_cd ='01' ";
			  whereStr3 = " 1=1 and proj_cd in('03','04','05') ";
			  orderStr = " order by 1,4";
		}
	}else if(tableId=='2'){//五级分类
		if(seq == "1"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('05','06') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "2"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "3"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('03','04','05') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "4"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "5"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}
	}else if(tableId=='3'){//考核利润
		if(seq == "22"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "23"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "24"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "25"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "26"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "28"){
			tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "29"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET ";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = " 1=1 and proj_cd ='04' ";
			  whereStr3 = "";
			  orderStr = " order by 1,4";
		}else if(seq == "30"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "31"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "32"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "33"){
			  selectStr3 = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
					"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
					"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET ";
			  tableStr3 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB ";
			  whereStr1 = " 1=1 and proj_cd in('05','06') ";
			  whereStr2 = " 1=1 and proj_cd ='01' ";
			  whereStr3 = " 1=1 and proj_cd in('03','04','05') ";
			  orderStr = " order by 1,4";
		}				
	}else if(tableId=='6'){//EVA
		if(seq=="1"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='06' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq=="2"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";			
		}else if(seq=="3"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_REB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq=="5"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq=="6"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq=="7"){
			 selectStr = "proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,rate,int_expns as int_incom,ftp_price,"+
				"ftp_prft as ftp_cost,ftp_spr,ftp_ass_prft,risk_slw_rels,risk_expos,bc_ocup,bc_ocup_cost,fiv_cls,pnt_bal," +
				"pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb,m_daily,m_daily_clm,q_daily,q_daily_clq,y_daily,y_daily_cly";
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_IBANK_LIAB "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='05' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}
		
	}
	
	if(currCd=='03'){
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		
	}else{
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		
	}
	
	//layer式弹框
	layer.open({
        type:2,
        title:'机构业绩综合统计表-表内资产业务_'+$.trim(value),
        shadeClose:true,
        shade:0.8,
        area:['1000px','650px'],
        content:portal.bp() + "/table/ZH001_02Index?selectStr="+selectStr+"&"+"tableStr1="+tableStr1+"&"+"whereStr1="+whereStr1+"&"+
        	"tableStr2="+tableStr2+"&"+"whereStr2="+whereStr2+"&"+"tableStr3="+tableStr3+"&"+"whereStr3="+whereStr3+"&"+
        	"tableStr4="+tableStr4+"&"+"whereStr4="+whereStr4+"&"+"orderStr="+orderStr+"&"+"matrixingTagStr="+matrixingTagStr+"&"+
        	"DW="+DW+"&"+"title="+title+"&"+"currCd="+currCd+"&"+"dataDt="+dataDt+"&"+"selectStr2="+selectStr2+"&"+"selectStr3="+selectStr3+"&"+"selectStr4="+selectStr4+"&"+"mid="+mid
    });
      
  };
  
  /**
  *
  * 综合表下钻表3 表外业务
  * @param tableId
  */
  function modelThree(value,row,index,seq,tableId) {
	var selectStr ="proj_cd,proj_name,org_name,acct_num,cust_num,cust_name,risk_slw_rels," +
			"risk_expos,bc_ocup,bc_ocup_cost,pnt_bal,pnt_bal_cld,pnt_bal_clm,pnt_bal_clq,pnt_bal_yb";
	var selectStr2="",selectStr3="",selectStr4="";
	var matrixingTagStr ="0,0,0,0,0,0,1,1,1,0,1,1,1,1,1";
	var tableStr1="",whereStr1="";
	var tableStr2="",whereStr2="";
	var tableStr3="",whereStr3="";
	var tableStr4="",whereStr4="";
	var orderStr='';
	var currCd = $("#CURR_CD").val();
	var DW = $("#DW").val();
	var dataDt = $("#DATA_DT").val();
	var orgNum = $("#ORG_NUM").val();
	var orgHirchy = $("#ORG_HIRCHY").val();
	var title='机构业绩综合统计表-表外业务_'+$.trim(value);
	title = encodeURI(title);
	if(tableId=="1"){//机构业务
		if(seq == "39"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and PROJ_CD ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "40"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "41"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "42"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "43"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('01','02','03','04') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}
	}else if(tableId=="6"){//EVA
		if(seq == "9"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and PROJ_CD ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "10"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "11"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "12"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_OFF "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='04' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}else if(seq == "13"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_COB_ASSET "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd in('01','02','03','04') ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd,acct_num";
		}
	}
	
	if(currCd=='03'){
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		
	}else{
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		
	}
	
	//layer式弹框
	layer.open({
      type:2,
      title:'机构业绩综合统计表-表外业务_'+$.trim(value),
      shadeClose:true,
      shade:0.8,
      area:['1000px','650px'],
      content:portal.bp() + "/table/ZH001_03Index?selectStr="+selectStr+"&"+"tableStr1="+tableStr1+"&"+"whereStr1="+whereStr1+"&"+
      	"tableStr2="+tableStr2+"&"+"whereStr2="+whereStr2+"&"+"tableStr3="+tableStr3+"&"+"whereStr3="+whereStr3+"&"+
      	"tableStr4="+tableStr4+"&"+"whereStr4="+whereStr4+"&"+"orderStr="+orderStr+"&"+"matrixingTagStr="+matrixingTagStr+"&"+
      	"DW="+DW+"&"+"title="+title+"&"+"currCd="+currCd+"&"+"dataDt="+dataDt+"&"+"selectStr2="+selectStr2+"&"+"selectStr3="+selectStr3+"&"+"selectStr4="+selectStr4+"&"+"mid="+mid
	});
   };

   /**
   *
   * 综合表下钻表4 中收业务
   * @param tableId
   */
   function modelFour(value,row,index,seq,tableId) {
	var selectStr ="proj_cd,proj_name,org_name,cust_num,cust_name,l1_class_desc," +
			"l2_class_desc,subj_id,subj_name,comm_fee_incom";
	var selectStr2="",selectStr3="",selectStr4="";
	var matrixingTagStr ="0,0,0,0,0,0,0,0,0,1";
	var tableStr1="",whereStr1="";
	var tableStr2="",whereStr2="";
	var tableStr3="",whereStr3="";
	var tableStr4="",whereStr4="";
	var orderStr='';
	var currCd = $("#CURR_CD").val();
	var DW = $("#DW").val();
	var dataDt = $("#DATA_DT").val();
	var orgNum = $("#ORG_NUM").val();
	var orgHirchy = $("#ORG_HIRCHY").val();
	var title='机构业绩综合统计表-中收业务_'+$.trim(value);
	title = encodeURI(title);
	if(tableId=="7"){//中间业务
		if(seq == "1"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_MDL_INCOM "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and PROJ_CD ='01' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd";
		}else if(seq == "2"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_MDL_INCOM "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='02' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd";
		}else if(seq == "3"){
			  tableStr1 = " pas_adm.A_INS_ORG_ACCT_MDL_INCOM "
			  tableStr2 = "";
			  tableStr3 = "";
			  whereStr1 = " 1=1 and proj_cd ='03' ";
			  whereStr2 = "";
			  whereStr3 = "";
			  orderStr = " order by proj_cd";
		}
	}
	
	
	if(currCd=='03'){
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' ";
		}
		
	}else{
		if(whereStr1!=""&&whereStr1!=null){
			whereStr1 = whereStr1+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr2!=""&&whereStr2!=null){
			whereStr2 = whereStr2+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr3!=""&&whereStr3!=null){
			whereStr3 = whereStr3+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		if(whereStr4!=""&&whereStr4!=null){
			whereStr4 = whereStr4+" and org_num = '"+orgNum+"' and org_hirchy ='"+orgHirchy+"' and data_dt = '"+ dataDt+"' and curr_cd ='"+currCd+"' ";
		}
		
	}
	
	//layer式弹框
	layer.open({
       type:2,
       title:'机构业绩综合统计表-中收业务_'+$.trim(value),
       shadeClose:true,
       shade:0.8,
       area:['1000px','650px'],
       content:portal.bp() + "/table/ZH001_04Index?selectStr="+selectStr+"&"+"tableStr1="+tableStr1+"&"+"whereStr1="+whereStr1+"&"+
       	"tableStr2="+tableStr2+"&"+"whereStr2="+whereStr2+"&"+"tableStr3="+tableStr3+"&"+"whereStr3="+whereStr3+"&"+
       	"tableStr4="+tableStr4+"&"+"whereStr4="+whereStr4+"&"+"orderStr="+orderStr+"&"+"matrixingTagStr="+matrixingTagStr+"&"+
       	"DW="+DW+"&"+"title="+title+"&"+"currCd="+currCd+"&"+"dataDt="+dataDt+"&"+"selectStr2="+selectStr2+"&"+"selectStr3="+selectStr3+"&"+"selectStr4="+selectStr4+"&"+"mid="+mid

	});
    };




//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $("#DATA_DT").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5");
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}