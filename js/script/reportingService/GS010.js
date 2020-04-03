//删除id数组
var deleteIds = [];
var bodyIndex = 0;
var date = $.param.getEtlDate();
var lastQueryParams = {};
//菜单id
var mid = getUrlParam('mid');
var filedNameArray = ['xuhao','org_num','org_name','day_bal','cld_incremt','clm_incremt','clq_incremt',
                      'cly_incremt', 'negu_index_val','negu_index_val_diff','negu_index_cmplt_ratio'];
$(function(){
	$("#DATA_DT").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
	$("#DATA_DT").val(date);
	
	//机构层级联动机构
	/*$("#ORG_HIRCHY").change(function(){
		findOrgByLevel("ORG_ID","ORG_HIRCHY");
	});
	findAuthOrgHirchy('ORG_HIRCHY',"5",mid);*/
	$("#ORG_HIRCHY").html("").append(
			$.param.getSelectOptionOrder("TB0056"))
			.selectpicker('refresh').selectpicker('val', "5").change();
	
	$("#ORG_NUM").on('changed.bs.select',function(a,b,c,d){
		if(!$(this).selectpicker('val')){
			//必选
			document.getElementById("ORG_NUM").options.selectedIndex = b;
			$("#ORG_NUM").selectpicker('refresh');
			layer.msg("机构必选",{icon:3});
		}
	});
	//初始化机构
	initOrgNum = $.param.getOrgByLevels('LV5',mid);
	$("#ORG_NUM").html("").append($.param.getOrgByLevel('LV5',mid))
	.selectpicker('refresh').selectpicker('val', initOrgNum[0].orgNum);
	
    $("#CURR_CD").html("").append(
			$.param.getSelectOptionOrder("CURR_CD"))
			.selectpicker('refresh').selectpicker('val', "03");
    $("#DW").html("").append(
    		$.param.getSelectOptionOrder("MONETARY_UNIT"))
    		.selectpicker('refresh').selectpicker('val', "02");
    
   /* var html="";
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
				
				//$("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val',firstValue).change();
				$("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val','5').change();

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
	});*/
    
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
    
    query();
    
    //初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'A_COB_DAILY_DPST_ORG-GS010'
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
/**
 * 根据机构层级查找机构
 * @param eleId 机构id
 * @param levelEleId 机构层级id
 */
function findOrgByLevel(eleId,levelEleId){
	var html = "";
	var level = $("#"+levelEleId).val();
	level = "LV" + level;
	$.ajax({
		url : portal.bp() + '/org/findOrgByLevel',
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'level' : level,
			'mid':mid
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				var s = data.data;
				var tipsMap = {};
				$.each(s,function(index,item){
					eval("tipsMap."+item.orgName.replace(/[\u0000-\u00FF]/g,"")+"='"+item.childOrgNames+"'");
					html += '<option value="'+item.orgNum+'">'+item.orgName+'</option>';
				});
				$("#"+eleId).empty().append(html);
				//默认选中第一个
				document.getElementById(eleId).options.selectedIndex = 0;
				$("#"+eleId).selectpicker('refresh');
				
				if(level=='LV3'||level=='LV4'){
                	//主管行和管辖行新增鼠标移入移出事件
                	var tipsindex;
                	$("#"+eleId).parent().find(".dropdown-menu ul li").on('mouseover',function(){
                		
                		var tipsMsg = eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,""));
                		if(tipsMsg!=null&&tipsMsg!='null'){
                			tipsindex = layer.tips(eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,"")),$(this));
                		}
                	});
                	$("#"+eleId).parent().find(".dropdown-menu ul li").on('mouseout',function(){
                		layer.close(tipsindex);
                	});
                }
			}
		}
	});
}
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
    $("#tab1").click();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $("#DATA_DT").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5").change();
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
    $("#D_CLD_CHANGE_AMT").selectpicker('refresh').selectpicker('val', "1");
}
var oldTable;
var TableObjPage = {
		table1: function () {
	        var columns = [
	              [
	               
					{
						  field:'xuhao',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:1,
		                  /*formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
						  */
					 },
					 {
						  field:'org_num',
						  title:'经营单位编号',
						  align: "center",
						  valign: "middle",
						  rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:2,
					 },
					 {
						 field:'org_name',
						 title:'经营单位名称',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:3,
						
					 },
					 {
						 field:'day_bal',
						 title:'今日余额',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:4,
						
					 },
					 {
						 field:'cld_incremt',
						 title:'比上日',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:5,
					
					 },
					 {
						 field:'clm_incremt',
						 title:'比上月',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:6,
					
					 },
					 {
						 field:'clq_incremt',
						 title:'比上季',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:7,
					 },
					 {
						 field:'cly_incremt',
						 title:'比年初 ',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:8,
					 },
					 {
						 field:'negu_index_val',
						 title:'指标',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:8,
					 },
					 {
						 field:'negu_index_val_diff',
						 title:'较指标差距',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:10,
					
					 },
					 {
						 field:'negu_index_cmplt_ratio',
						 title:'完成比(%)',
						 align: "center",
						 valign: "middle",
						 rowspan: 2,
		                  colspan: 1,
		                  rowNumber:1,
		                  colNumber:11,
						
					 },
					 {
						 field:'',
						 title:'大额存款变动',
						 align: "center",
						 valign: "middle",
						 rowspan: 1,
		                  colspan: 3,
		                  rowNumber:1,
		                  colNumber:12,
						
					 },
					 
					],[
						 {
							 field:'cust_name',
							 title:'单位名称',
							 align: "center",
							 valign: "middle",
							 rowspan: 1,
			                  colspan: 1,
			                  rowNumber:2,
			                  colNumber:12,
							 
						 },
						 {
							 field:'d_cld_change_amt',
							 title:'变动情况',
							 align: "center",
							 valign: "middle",
							 rowspan: 1,
			                  colspan: 1,
			                  rowNumber:2,
			                  colNumber:13,
	
						 }, {
							 field:'memo',
							 title:'备注',
							 align: "center",
							 valign: "middle",
							 rowspan: 1,
			                  colspan: 1,
			                  rowNumber:2,
			                  colNumber:14,
	
						 }, 
		               ], 
	        ];
	        $('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/GS010query',
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
		                	'dataDt':$("#DATA_DT").val(),
		                	'orgNum':$("#ORG_NUM").val(),
		                	'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
		                	'DW':$("#DW").selectpicker("val"),
		                	'currCd':$("#CURR_CD").selectpicker("val"),
		                	'dCldChangeAmt':$("#D_CLD_CHANGE_AMT").val(),
	            			'logTableName':'A_COB_DAILY_DPST_CUST-GS010',
	            			'logMenuId':mid,
	            	}
	                return {
	                	'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,
	                	'dataDt':$("#DATA_DT").val(),
	                	'orgNum':$("#ORG_NUM").val(),
	                	'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
	                	'DW':$("#DW").selectpicker("val"),
	                	'currCd':$("#CURR_CD").selectpicker("val"),
	                	'dCldChangeAmt':$("#D_CLD_CHANGE_AMT").val(),
	                	'logTableName':'A_COB_DAILY_DPST_CUST-GS010',
	                	'logMenuId':mid,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            height:getTableHeight(document), //表格固定高度
	          /*  responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },*/
	            responseHandler: function (res) { //服务端返回数据
					if (res.code == '200') {

						resultCells = res.data.sameArray;
						return res.data.pageFinder;
					} else {
						layer.msg(res.message, {icon: 2});
						return ;
					}
				},
				onLoadSuccess: function (data) {
					mergeCell(data.rows, 'key', 1, '#table1',resultCells);
					resizeTables();
				},
	            columns: columns
	            
	        });
	    }
}


function mergeCell(data, fieldName, colspan, target,numArr) {

	if (data.length == 0) {
		return;
	}

	if (data.length == 1 || numArr == undefined) {
		//$(target).bootstrapTable('updateCell', {index: 0, field: 'Number', value: 1});
		return;
	}



	var merIndex = 0;
	for (var i = 0; i < numArr.length; i++) {
		mergeTool(target, merIndex, filedNameArray, colspan, numArr[i]);
		merIndex += numArr[i];
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


function exportCurrentPageExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	lastQueryParams.mergeColumns="org_num:1,org_name:2,day_bal:3,cld_incremt:4,clm_incremt:5,clq_incremt:6,cly_incremt:7," +
			"negu_index_val:8,negu_index_val_diff:9,negu_index_cmplt_ratio:10";
	publicReportExcel(lastQueryParams,"exportExcelGS010");
}

function exportAllDataExcel(){
	var columns = $("#table1").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=true;
	//需要合并单元格的列，格式:  字段名1:列数1,字段名2:列数2
	lastQueryParams.mergeColumns="org_num:1,org_name:2,day_bal:3,cld_incremt:4,clm_incremt:5,clq_incremt:6,cly_incremt:7," +
			"negu_index_val:8,negu_index_val_diff:9,negu_index_cmplt_ratio:10";
	publicReportExcel(lastQueryParams,"exportExcelGS010");
}
