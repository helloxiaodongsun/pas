var date = $.param.getEtlDate();
var lastQueryParams = {};
//菜单id
var mid = getUrlParam('mid');
$(function(){
    $(".date-dt").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
   // $('#custInfo').text("主办支行：- 客户名称：- 客户号：- 证件类型：- 证件号码：-");
	$("#DATA_DT").val(date);	
	$("#CER_TYPE").html("").append(
			$.param.getSelectOptionOrderCerType())
			.selectpicker('refresh').selectpicker('val', "11");
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
    $("#CUST_ID").change(function(){
    	var custId = $(this).val();
    	var cerType = $("#CER_TYPE").selectpicker("val");
    	var cerTypeName = $("#CER_TYPE").find("option:selected").text();
    	var cerNum = $("#CER_NUM").val();
    	var result = $.param.getCustInfo(custId,cerType,cerNum); 
    	var orgName ="";
    	var custName = "";
    	
    	if(result!=null&&result!=""){
    		orgName = result.custBelongOrgName;
    		custName = result.custName;
    		cerNum = result.cerNum;
    		
    	}   	
    	$("#CER_NUM").val(cerNum);
    	//客户号后四位脱敏
    	cerNum = cerNum.substr(0,cerNum.length-4)+"****";
    	if(cerNum==""||cerNum==null){
    		cerNum="-";
    	}
    	if(orgName==""||orgName==null){
    		orgName="-";
    	}
    	if(custName==""||custName==null){
    		custName="-";
    	}
    	$("#orgName").html(orgName);
    	$("#custName").html(custName);
    	$("#custId").html(custId);
    	$("#cerNum").html(cerNum);
    	$("#cerTypeName").html(cerTypeName);
    	//$('#custInfo').text("主办支行："+orgName+"  客户名称："+custName+"  客户号："+custId+"  证件类型："+cerTypeName+"  证件号码："+cerNum);
    });
    
    $("#CER_NUM").change(function(){
    	var cerNum = $(this).val();
    	var cerType = $("#CER_TYPE").selectpicker("val");
    	var cerTypeName = $("#CER_TYPE").find("option:selected").text();
    	//根据证件类型和证件号查询客户名称
    	var custId = $("#CUST_ID").val();
    	var result = $.param.getCustInfo(custId,cerType,cerNum);   
    	var orgName ="";
    	var custName = "";   	
    	if(result!=null&&result!=""){
    		orgName = result.custBelongOrgName;
    		custName = result.custName;
        	custId = result.custId;
    	}
    	$("#CUST_ID").val(custId);
    	//客户号后四位脱敏
    	cerNum = cerNum.substr(0,cerNum.length-4)+"****";
    	
    	if(custId==""||custId==null){
    		custId="-";
    	}
    	if(orgName==""||orgName==null){
    		orgName="-";
    	}
    	if(custName==""||custName==null){
    		custName="-";
    	}
    	$("#orgName").html(orgName);
    	$("#custName").html(custName);
    	$("#custId").html(custId);
    	$("#cerNum").html(cerNum);
    	$("#cerTypeName").html(cerTypeName);
    	//$('#custInfo').text("主办支行："+orgName+"  客户名称："+custName+"  客户号："+custId+"  证件类型："+cerTypeName+"  证件号码："+cerNum);

    });
    
    $("#CER_TYPE").change(function(){
    	var cerType = $(this).val();
    	var cerNum = $("#CER_NUM").val();
    	var cerTypeName = $("#CER_TYPE").find("option:selected").text();
    	//根据证件类型和证件号查询客户名称
    	var custId = $("#CUST_ID").val();
    	if(custId!=""||cerNum!=""){
    		var result = $.param.getCustInfo(custId,cerType,cerNum);   
    		var orgName ="";
        	var custName = "";   
        	if(result!=null&&result!=""){
        		orgName = result.custBelongOrgName;
        		custName = result.custName;
        		if(custId!=null&&custId!=""){
        		}else{
        			custId = result.custId;
        		}
        		if(cerNum!=null&&cerNum!=""){
        		}else{
                	cerNum = result.cerNum;
        		}
        	}else{
        		custId ="";
        		cerNum ="";
        	}	
        	$("#CUST_ID").val(custId);
        	$("#CER_NUM").val(cerNum);
        	//客户号后四位脱敏
        	cerNum = cerNum.substr(0,cerNum.length-4)+"****";
        	if(custId==""||custId==null){
        		custId="-";
        	}
        	if(cerNum==""||cerNum==null){
        		cerNum="-";
        	}
        	if(orgName==""||orgName==null){
        		orgName="-";
        	}
        	if(custName==""||custName==null){
        		custName="-";
        	}
        	$("#orgName").html(orgName);
        	$("#custName").html(custName);
        	$("#custId").html(custId);
        	$("#cerNum").html(cerNum);
        	$("#cerTypeName").html(cerTypeName);
        	//$('#custInfo').text("主办支行："+orgName+"  客户名称："+custName+"  客户号："+custId+"  证件类型："+cerTypeName+"  证件号码："+cerNum);

    	}

    });
    
    $("#query").click(function(){
    	var cerNum = $("#CER_NUM").val();
    	if(cerNum==""||cerNum==null){
    		layer.msg("证件号码必填",{icon:3});
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
    $("#tab8").click(function(){
    	TableObjNotPageTotal.table8();
    });


	//初始化报表说明(备注)
	$.ajax({
		url: portal.bp() + '/table/queryNote',
		type: "get",
		async: false, // 同步 为全局变量赋值
		data: {
			'tableName': 'ZH004_NOTE'
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
	var result = tableNeedCopy(columns,0,true);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	if(tableId != "table7" && tableId!="table8"){
		//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
		lastQueryParams.mergeColumns="product_firsttitle:0";
	}
	publicReportExcel(lastQueryParams,"exportExcelZH004/"+tableId);
}
function exportAllDataExcel(){
	var reportExcelDTO_ZH004 = [];
	var d1 = {"tableNo":1};
	var d2 = {"tableNo":2};
	var d3 = {"tableNo":3};
	var d4 = {"tableNo":4};
	var d5 = {"tableNo":5};
	var d6 = {"tableNo":6};
	var d7 = {"tableNo":7};
	var d8 = {"tableNo":8};
	
	var columns1 = $("#table1").bootstrapTable('getOptions').columns;
	var result1 = tableNeedCopy(columns1,0,true);
	d1.tableHead = JSON.stringify(result1);
	d1.mergeColumns = "product_firsttitle:0";
	d1.tableName = $("#tab1").text();
	reportExcelDTO_ZH004.push(d1);
	
	var columns2 = $("#table2").bootstrapTable('getOptions').columns;
	var result2 = tableNeedCopy(columns2,0,true);
	d2.tableHead = JSON.stringify(result2);
	d2.mergeColumns = "product_firsttitle:0";
	d2.tableName = $("#tab2").text();
	reportExcelDTO_ZH004.push(d2);
	
	var columns3 = $("#table3").bootstrapTable('getOptions').columns;
	var result3 = tableNeedCopy(columns3,0,true);
	d3.tableHead = JSON.stringify(result3);
	d3.mergeColumns = "product_firsttitle:0";
	d3.tableName = $("#tab3").text();
	reportExcelDTO_ZH004.push(d3);
	
	var columns4 = $("#table4").bootstrapTable('getOptions').columns;
	var result4 = tableNeedCopy(columns4,0,true);
	d4.tableHead = JSON.stringify(result4);
	d4.mergeColumns = "product_firsttitle:0";
	d4.tableName = $("#tab4").text();
	reportExcelDTO_ZH004.push(d4);
	
	var columns5 = $("#table5").bootstrapTable('getOptions').columns;
	var result5 = tableNeedCopy(columns5,0,true);
	d5.tableHead = JSON.stringify(result5);
	d5.mergeColumns = "product_firsttitle:0";
	d5.tableName = $("#tab5").text();
	reportExcelDTO_ZH004.push(d5);
	
	var columns6 = $("#table6").bootstrapTable('getOptions').columns;
	var result6 = tableNeedCopy(columns6,0,true);
	d6.tableHead = JSON.stringify(result6);
	d6.mergeColumns = "product_firsttitle:0";
	d6.tableName = $("#tab6").text();
	reportExcelDTO_ZH004.push(d6);
	
	var columns7 = $("#table7").bootstrapTable('getOptions').columns;
	var result7 = tableNeedCopy(columns7,0,true);
	d7.tableHead = JSON.stringify(result7);
	d7.tableName = $("#tab7").text();
	reportExcelDTO_ZH004.push(d7);
	
	var columns8 = $("#table8").bootstrapTable('getOptions').columns;
	var result8 = tableNeedCopy(columns8,0,true);
	d8.tableHead = JSON.stringify(result8);
	d8.tableName = $("#tab8").text();
	reportExcelDTO_ZH004.push(d8);
	
	
	
	
	var data = {
		"reportExcelMoreTable":reportExcelDTO_ZH004,
		'dATA_DT':lastQueryParams.DATA_DT,
    	'cUST_NAME':lastQueryParams.CUST_NAME,
    	'cER_TYPE':lastQueryParams.CER_TYPE,
    	'cER_NUM':lastQueryParams.CER_NUM,
    	'cURR_CD':lastQueryParams.CURR_CD,
    	'dW':lastQueryParams.DW,
	}
	$.ajax({
		url : portal.bp() + '/report/exportExcelZH004',
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
	TableObjNotPage.table1();
	TableObjNotPage.table2();
	TableObjNotPage.table3();   
	TableObjNotPage.table4();
	TableObjNotPage.table5();
	TableObjNotPage.table6();
	TableObjNotPage.table7();	
	TableObjNotPageTotal.table8();
    
}
function initTable(tableId,columns){
	$('#'+tableId).bootstrapTable('destroy').bootstrapTable({
        url: portal.bp() + '/table/zhTable/ZH004/'+tableId,
        method: 'get',      //请求方式（*）
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,     //是否显示分页（*）
        sortStable: true,      //是否启用排序
        sortOrder: "desc",     //排序方式
        "queryParamsType": "limit",
        contentType: "application/x-www-form-urlencoded",
        queryParams: function (params) {
        	lastQueryParams = {
    			'CUST_NAME':$("#CUST_NAME").val(),
            	'CER_TYPE':$("#CER_TYPE").val(),
            	'CER_NUM':$("#CER_NUM").val(),
            	'DATA_DT':$("#DATA_DT").val(),           	
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'ZH004',
            	'logMenuId':mid,
        	}
            return {
            	'CUST_NAME':$("#CUST_NAME").val(),
            	'CER_TYPE':$("#CER_TYPE").val(),
            	'CER_NUM':$("#CER_NUM").val(),
            	'DATA_DT':$("#DATA_DT").val(),           	
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'ZH004',
            	'logMenuId':mid,
            };
        },
        clickToSelect: true,    //是否启用点击选中行
        resizable:true,			//是否可调整列宽度
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

function initTableTotal(tableId,columns){
	$('#'+tableId).bootstrapTable('destroy').bootstrapTable({
        url: portal.bp() + '/table/zhTable/ZH004/'+tableId,
        method: 'get',      //请求方式（*）
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,     //是否显示分页（*）
        sortStable: true,      //是否启用排序
        sortOrder: "desc",     //排序方式
        //showFooter:true, 	   //显示合计栏
        singleSelect: false,    //是否单选，true时没有全选按钮
        "queryParamsType": "limit",
        contentType: "application/x-www-form-urlencoded",
        queryParams: function (params) {
            return {
            	'CUST_NAME':$("#CUST_NAME").val(),
            	'CER_TYPE':$("#CER_TYPE").val(),
            	'CER_NUM':$("#CER_NUM").val(),
            	'DATA_DT':$("#DATA_DT").val(),           	
            	'CURR_CD':$("#CURR_CD").selectpicker("val"),
            	'DW':$("#DW").selectpicker("val"),
            	'logTableName':'ZH004',
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
        	var sum1 = 0;var sum2 = 0;var sum3 = 0;var sum4 = 0;var sum5 = 0;
        	var sum6 = 0;var sum7 = 0;var sum8 = 0;var sum9 = 0;var sum10 = 0;
        	var sum11 = 0;var sum12 = 0;var sum13 = 0;var sum14 = 0;var sum15 = 0;
        	var sum16 = 0;var sum17 = 0;var sum18 = 0;var sum19 = 0;var sum20 = 0;
        	var sum21 = 0;var sum22 = 0;var sum23 = 0;var sum24 = 0;var sum25 = 0;
        	var sum26 = 0;var sum27 = 0;var sum28 = 0;var sum29 = 0;var sum30 = 0;
        	//var datas = $("#table8").bootstrapTable("getData");
        	//for(var i in datas,rows){
        	$.each(data,function(index,item){
        		sum1  = parseFloat(sum1)+parseFloat(item.cust_dpst_crnt_bal);     
        		sum2  = parseFloat(sum2)+parseFloat(item.cust_dpst_y_daily_bal);
        		sum3  = parseFloat(sum3)+parseFloat(item.cust_dpst_yb_davgbal);
        		sum4  = parseFloat(sum4)+parseFloat(item.ibank_liab_crnt_bal);
        		sum5  = parseFloat(sum5)+parseFloat(item.ibank_liab_y_daily_bal);
        		sum6  = parseFloat(sum6)+parseFloat(item.ibank_liab_yb_davgbal);
        		sum7  = parseFloat(sum7)+parseFloat(item.cust_loan_crnt_bal);
        		sum8  = parseFloat(sum8)+parseFloat(item.cust_loan_y_daily_bal);
        		sum9  = parseFloat(sum9)+parseFloat(item.cust_loan_yb_davgbal);
        		sum10 = parseFloat(sum10)+parseFloat(item.bill_discount_crnt_bal);
        		sum11 = parseFloat(sum11)+parseFloat(item.bill_discount_y_daily_bal);     
        		sum12 = parseFloat(sum12)+parseFloat(item.bill_discount_yb_davgbal);
        		sum13 = parseFloat(sum13)+parseFloat(item.dir_inv_crnt_bal);
        		sum14 = parseFloat(sum14)+parseFloat(item.dir_inv_y_daily_bal);
        		sum15 = parseFloat(sum15)+parseFloat(item.dir_inv_yb_davgbal);
        		sum16 = parseFloat(sum16)+parseFloat(item.ibank_asset_crnt_bal);
        		sum17 = parseFloat(sum17)+parseFloat(item.ibank_asset_y_daily_bal);
        		sum18 = parseFloat(sum18)+parseFloat(item.ibank_asset_yb_davgbal);
        		sum19 = parseFloat(sum19)+parseFloat(item.stru_fin_crnt_bal);
        		sum20 = parseFloat(sum20)+parseFloat(item.stru_fin_y_daily_bal);
        		sum21 = parseFloat(sum21)+parseFloat(item.stru_fin_yb_davgbal);     
        		sum22 = parseFloat(sum22)+parseFloat(item.bank_acpt_crnt_bal);
        		sum23 = parseFloat(sum23)+parseFloat(item.bank_acpt_y_daily_bal);
        		sum24 = parseFloat(sum24)+parseFloat(item.bank_acpt_yb_davgbal);
        		sum25 = parseFloat(sum25)+parseFloat(item.guar_crnt_bal);
        		sum26 = parseFloat(sum26)+parseFloat(item.guar_y_daily_bal);
        		sum27 = parseFloat(sum27)+parseFloat(item.guar_yb_davgbal);
        		sum28 = parseFloat(sum28)+parseFloat(item.lc_crnt_bal);
        		sum29 = parseFloat(sum29)+parseFloat(item.lc_y_daily_bal);
        		sum30 = parseFloat(sum30)+parseFloat(item.lc_yb_davgbal);

        	});
        	var rows = [];
        	rows.push({
        		cust_name:"合计",
	    		 cust_dpst_crnt_bal:sum1.toFixed(2),
	    		 cust_dpst_y_daily_bal:sum2.toFixed(2),
	    		 cust_dpst_yb_davgbal:sum3.toFixed(2),
	    		 ibank_liab_crnt_bal:sum4.toFixed(2),
	    		 ibank_liab_y_daily_bal:sum5.toFixed(2),
	    		 ibank_liab_yb_davgbal:sum6.toFixed(2),
	    		 cust_loan_crnt_bal:sum7.toFixed(2),
	    		 cust_loan_y_daily_bal:sum8.toFixed(2),
	    		 cust_loan_yb_davgbal:sum9.toFixed(2),
	    		 bill_discount_crnt_bal:sum10.toFixed(2),
	    		 bill_discount_y_daily_bal:sum11.toFixed(2),
	    		 bill_discount_yb_davgbal:sum12.toFixed(2),
	    		 dir_inv_crnt_bal:sum13.toFixed(2),
	    		 dir_inv_y_daily_bal:sum14.toFixed(2),
	    		 dir_inv_yb_davgbal:sum15.toFixed(2),
	    		 ibank_asset_crnt_bal:sum16.toFixed(2),
	    		 ibank_asset_y_daily_bal:sum17.toFixed(2),
	    		 ibank_asset_yb_davgbal:sum18.toFixed(2),
	    		 stru_fin_crnt_bal:sum19.toFixed(2),
	    		 stru_fin_y_daily_bal:sum20.toFixed(2),
	    		 stru_fin_yb_davgbal:sum21.toFixed(2),
	    		 bank_acpt_crnt_bal:sum22.toFixed(2),
	    		 bank_acpt_y_daily_bal:sum23.toFixed(2),
	    		 bank_acpt_yb_davgbal:sum24.toFixed(2),
	    		 guar_crnt_bal:sum25.toFixed(2),
	    		 guar_y_daily_bal:sum26.toFixed(2),
	    		 guar_yb_davgbal:sum27.toFixed(2),
	    		 lc_crnt_bal:sum28.toFixed(2),
	    		 lc_y_daily_bal:sum29.toFixed(2),
	    		 lc_yb_davgbal:sum30.toFixed(2)
        	});
        	$("#table8").bootstrapTable('append',rows);
        	
        	var activeIndex = $("#nav-tabs").find(".active").prevAll().length;
            $('#'+tableId).bootstrapTable('resetView',{
                height:getTableHeight(document,activeIndex)
            });
            
//        	var length = $("#table8").bootstrapTable("getData").length;
//        	$("#table8").bootstrapTable('mergeCells',{index:length-1,field:"cust_name",colspan:3,rowspan:1});
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
	               },
	               {
	            	   field:'pnt_bal',
	            	   title:'时点余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
		               valign: "middle",
		               rowNumber:1,
		               colNumber:3,
	               },
	               {
	            	   field:'yb_davgbal',
	            	   title:'较年初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:4,
	               },
	               {
	            	   field:'qb_davgbal',
	            	   title:'较季初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:5,
	               },
	               {
	            	   field:'mb_davgbal',
	            	   title:'较月初余额增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:6,
	               },
	               {
	            	   field:'y_daily_bal',
	            	   title:'年日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:7,
	               },
	               {
	            	   field:'y_daily_bal_cly_incremt',
	            	   title:'年日均余额较上年增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:8,
	               },
	               {
	            	   field:'q_daily_bal',
	            	   title:'季日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:9,
	               },
	               {
	            	   field:'q_daily_bal_clq_incremt',
	            	   title:'季日均余额较上季增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:10,
	               },
	               {
	            	   field:'m_daily_bal',
	            	   title:'月日均余额',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:11,
	               },
	               {
	            	   field:'m_daily_bal_clm_incremt',
	            	   title:'月日均余额较上月增量',
	            	   rowspan: 1,
	            	   colspan: 1,
	            	   align: "center",
	            	   valign: "middle",
	            	   rowNumber:1,
		               colNumber:12,
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
	               },
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
	    	                },
	    	                {
	    	                	field:'y_daily',
	    	                	title:'年日均余额',
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
	    	                },
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
	    	                },
	    	                {
	    	                	field:'bc_ocup',
	    	                	title:'经济资本占用',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:3,
	    	                },
	    	                {
	    	                	field:'bc_ocup_cost',
	    	                	title:'经济资本占用成本',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:4,
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
	    	                },
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
	    	                ], 
	    	                ];
	    	initTable("table6",columns);
	    },	    
	    table7: function () {
	    	var columns = [
	    	               [	    	               
	    	                {
	    	                	field:'belong_corp_cnt',
	    	                	title:'所属公司个数',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:1,
	    	                },
	    	                {
	    	                	field:'alr_co_cnt',
	    	                	title:'已合作个数',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:2,
	    	                },
	    	                {
	    	                	field:'un_co_cnt',
	    	                	title:'未合作个数',
	    	                	rowspan: 1,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:3,
	    	                },
	    	                ], 
	    	                ];
	    	initTable("table7",columns);
	    },
	    
	};

var TableObjNotPageTotal = {
		table8: function () {
	    	var columns = [
	    	               /*[
	    	                {
	    	                	field:'',
	    	                	title:'客户所属公司信息',
	    	                	rowspan:1,
	    	                	colspan:33,
	    	                	align:"left",
	    	                	valign:"middle",
	    	                	
	    	               }
	    	                ],*/
	    	               [
	    	                {
	    	                	field:'cust_name',
	    	                	title:'客户名称',
	    	                	rowspan: 3,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:1,
	    	                },
	    	                {
	    	                	field:'co_brch_name',
	    	                	title:'合作分行',
	    	                	rowspan: 3,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle", 
	    	                	rowNumber:1,
	    			            colNumber:2,
	    	                },
	    	                {
	    	                	field:'org_name',
	    	                	title:'合作支行',
	    	                	rowspan: 3,
	    	                	colspan: 1,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:3,
	    	                	/*footerFormatter:function(value){
	    	                		return '合计';
	    	                	}*/
	    	                },{
	    	                	field:'',
	    	                	title:'表内负债业务',
	    	                	rowspan: 1,
	    	                	colspan: 6,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:4,
	    	                },{
	    	                	field:'',
	    	                	title:'表内资产业务',
	    	                	rowspan: 1,
	    	                	colspan: 12,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:5,
	    	                },{
	    	                	field:'',
	    	                	title:'表外业务',
	    	                	rowspan: 1,
	    	                	colspan: 12,
	    	                	align: "center",
	    	                	valign: "middle",
	    	                	rowNumber:1,
	    			            colNumber:6,
	    	                },
	    	                ],[
		    	                {
		    	                	field:'',
		    	                	title:'客户存款',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:4,
		    	                	
		    	                },
		    	                {
		    	                	field:'',
		    	                	title:'同业负债',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:5,
		    	                },
		    	                {
		    	                	field:'',
		    	                	title:'客户贷款',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:6,
		    	                },
		    	                {
		    	                	field:'',
		    	                	title:'票据贴现',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:7,
		    	                },{
		    	                	field:'',
		    	                	title:'直投',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:8,
		    	                },{
		    	                	field:'',
		    	                	title:'同业资产',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:9,
		    	                },
		    	                {
		    	                	field:'',
		    	                	title:'结构融资',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:10,
		    	                },{
		    	                	field:'',
		    	                	title:'银承',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:11,
		    	                },{
		    	                	field:'',
		    	                	title:'保函',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:12,
		    	                },{
		    	                	field:'',
		    	                	title:'信用证',
		    	                	rowspan: 1,
		    	                	colspan: 3,
		    	                	align: "center",
		    	                	valign: "middle",
		    	                	rowNumber:2,
		    			            colNumber:13,
		    	                },
		    	                ],
		    	                [
			    	                {
			    	                	field:'cust_dpst_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:4,
			    	                	/*footerFormatter:function(value){
			    	                		
			    	                		var count = 0;
			    	                		for(var i in value){
			    	                			count += parseFloat(value[i].cust_dpst_crnt_bal);
			    	                		}
			    	                		return count.toFixed(2);
			    	                	}*/
			    	                },
			    	                {
			    	                	field:'cust_dpst_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:5,
			    	                },
			    	                {
			    	                	field:'cust_dpst_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:6,
			    	                },{
			    	                	field:'ibank_liab_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:7,
			    	                },
			    	                {
			    	                	field:'ibank_liab_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:8,
			    	                },
			    	                {
			    	                	field:'ibank_liab_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:9,
			    	                },{
			    	                	field:'cust_loan_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:10,
			    	                },
			    	                {
			    	                	field:'cust_loan_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:11,
			    	                },
			    	                {
			    	                	field:'cust_loan_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:12,
			    	                },{
			    	                	field:'bill_discount_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:13,
			    	                },
			    	                {
			    	                	field:'bill_discount_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:14,
			    	                },
			    	                {
			    	                	field:'bill_discount_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:15,
			    	                },{
			    	                	field:'dir_inv_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:16,
			    	                },
			    	                {
			    	                	field:'dir_inv_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:17,
			    	                },
			    	                {
			    	                	field:'dir_inv_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:18,
			    	                },{
			    	                	field:'ibank_asset_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:19,
			    	                },
			    	                {
			    	                	field:'ibank_asset_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:20,
			    	                },
			    	                {
			    	                	field:'ibank_asset_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:21,
			    	                },{
			    	                	field:'stru_fin_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:22,
			    	                },
			    	                {
			    	                	field:'stru_fin_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:23,
			    	                },
			    	                {
			    	                	field:'stru_fin_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:24,
			    	                },{
			    	                	field:'bank_acpt_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:25,
			    	                },
			    	                {
			    	                	field:'bank_acpt_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:26,
			    	                },
			    	                {
			    	                	field:'bank_acpt_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:27,
			    	                },{
			    	                	field:'guar_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:28,
			    	                },
			    	                {
			    	                	field:'guar_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:29,
			    	                },
			    	                {
			    	                	field:'guar_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:30,
			    	                },{
			    	                	field:'lc_crnt_bal',
			    	                	title:'当前余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:31,
			    	                },
			    	                {
			    	                	field:'lc_y_daily_bal',
			    	                	title:'年日均余额',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:32,
			    	                },
			    	                {
			    	                	field:'lc_yb_davgbal',
			    	                	title:'较年初',
			    	                	rowspan: 1,
			    	                	colspan: 1,
			    	                	align: "center",
			    	                	valign: "middle",
			    	                	rowNumber:3,
			    			            colNumber:33,
			    	                }
			    	                ], 
	    	                ];
	    	initTableTotal("table8",columns);
	    },
		
}
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $("#DATA_DT").val(date);
    $("#CER_TYPE").selectpicker('refresh').selectpicker('val', "11");
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}