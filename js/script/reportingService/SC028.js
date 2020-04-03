//删除id数组
var deleteIds = [];
var bodyIndex = 0;
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
var belongBrchNum="";		
$(function(){
	$("#ADDT_RCRD_TM").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
	$("#ADDT_RCRD_TM").val(date);
	
	//机构层级联动机构
	$("#ORG_HIRCHY").change(function(){
		findOrgByLevel("ORG_ID","ORG_HIRCHY");
	});
	findAuthOrgHirchy('ORG_HIRCHY',"5",mid);
	/*$("#ORG_HIRCHY").html("").append(
			$.param.getSelectOptionOrder("TB0056"))
			.selectpicker('refresh').selectpicker('val', "5").change();*/
	$("#ORG_ID").on('changed.bs.select',function(a,b,c,d){
		if(!$(this).selectpicker('val')){
			//必选
			document.getElementById("ORG_ID").options.selectedIndex = b;
			$("#ORG_ID").selectpicker('refresh');
			layer.msg("机构必选",{icon:3});
		}
	});
	belongBrchNum = $.param.queryBelongBrchNum(belongOrgNum);	
    $("#CURR_CD").html("").append(
			$.param.getSelectOptionOrder("CURR_CD"))
			.selectpicker('refresh').selectpicker('val', "03");
    $("#DW").html("").append(
    		$.param.getSelectOptionOrder("MONETARY_UNIT"))
    		.selectpicker('refresh').selectpicker('val', "02");
    //新增行
    $("#btn_add").click(function(){
    	var length = $("#table1").bootstrapTable("getData").length;
        var addtRcrdTm = getSystemDate("yyyy-MM-dd HH:mm:ss");
    	$("#table1").bootstrapTable("insertRow",{
            index:length,
            row:{
            	isAdd : true,
            	custName :'',
            	acctNum	:'',
            	amt	:'',
            	startIntDt	:'',
            	matDt	:'',
            	rate	:'',
            	addtRcrdTm	:addtRcrdTm,
            	addtRcrdPersonEmpno	:empNum,
            }
        });
    	//更新表中修改过字段的颜色
    	updateCellDataClass($("#table1"));
    	var dataName = 'acctNum';
    	var tableData = $("#table1").bootstrapTable("getData");
    	$.each(tableData,function(index,item){
    		if(item.isAdd==true){
    	    	$("#table1 tbody").find('tr').eq(index).find('[data-name="'+dataName+'"]').editable("enable");
    		}
    		
    	});
    });
    //删除行
	$("#btn_del").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
		var ids=[];
		$.each(checklist,function(index,item){
			ids.push(item.number);
			if(item.acctNum!=undefined&&item.acctNum!=null&&item.acctNum!=''){
				deleteIds.push(item.acctNum);
			}
		});
        $("#table1").bootstrapTable("remove",{
            field:'number',
            values:ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));
	});
	//保存
	$("#btn_save").click(function(){
		//bootstrapTable 编辑列表校验
		var validateError = validateBootStrapTableEdit($("#table1"));
		if(validateError!=null){
			layer.msg(validateError,{icon:2});
			return;
		}
		
		var addData = [];
		var updateData = [];
		var deleteData = deleteIds;		
		 
		var tableData = $("#table1").bootstrapTable("getData");
		$.each(tableData,function(index,item){
		
			if(item.acctNum!=undefined&&item.acctNum!=null&&item.acctNum!=''){
				//修改数据
				if(item.updateCell&&Object.keys(item.updateCell).length>0){
					updateData.push(item)
				}
				if(item.isAdd==true){
					//新增数据
					addData.push(item);
				}
			}else{
				
			}
		});
		if(addData.length==0&&updateData.length==0&&deleteData==0){
			layer.msg("没有任何修改，无需保存",{icon:3});
			return;
		}
		
		var data = {
				'addData':addData,
				'updateData':updateData,
				'deleteData':deleteData,
				'belongBrchNum':belongBrchNum
		};
		var index;
		$.ajax({
			url : portal.bp() + '/table/addRecord/SC028saveAll',
			type:'post',
			cache:false,
			contentType: "application/json;charset=UTF-8",
			dataType: "json",
			data:JSON.stringify(data),
			success : function(data) {
				if(data.code=='200'){
					layer.msg("保存成功",{icon:1});
					query();
				}else{
					layer.msg(data.message, {icon: 2});
				}
			},
			beforeSend:function(XMLHttpRequest){
				index = layerLoad();
			},
			complete:function(XMLHttpRequest){
				layerClose(index);
			}
		});
		
	});
    query();
    
    //初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'R_IBDPSTS_ADDT_RCRD_INFO-SC028'
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
    $("input").focus(function(){
        $(this).parent().children(".input_clear").show();
 	});
    
    $("input").blur(function(){        
        if($(this).val()==''){
        	$(this).parent().children(".input_clear").hide();
        }
 	});
    
    $(".input_clear").click(function(){
    	$(this).parent().find("input").val('');
    	$(this).hide();
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
	deleteIds = [];
    TableObjPage.table1();

    $("#tab1").click();
}
//查询修改记录
function queryHistory() {
	TableObjPageHistory.table2();
	$("#tab2").click();
}
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $("#ADDT_RCRD_TM").val(date);
    $("#CUST_NAME").val("");
    $("#ACCT_NUM").val("");
    $("#DW").selectpicker('refresh').selectpicker('val', "02");
}
var oldTable;
var TableObjPage = {
		table1: function () {
	        var columns = [
	              [
	               {
	            	   field:'check',
	            	   checkbox:true,
	               },
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },
					 {
						  field:'custName',
						  title:'客户名称',
						  align: "center",
						  valign: "middle",
						  editable:{
			                    type:'text',
			                    title:'客户名称',
			                    placement:'top',
			                    emptytext:"空",	
			                   
			                },
					 },
					 {
						 field:'acctNum',
						 title:'账号',
						 align: "center",
						 valign: "middle",
						 editable:{
			                    type:'text',
			                    title:'账号',
			                    disabled:true,
			                    placement:'top',
			                    emptytext:"空",			                  
			                    validate: function (value) {
			                    	$el = $(this);
			                    	if (value==null||value==''){
			                    		return '账号必填';
			                    	}else{
			                    		var acct = $.param.getAcctNum(value,"");
			                    		//var isExist = $.param.getAcctNum(value,belongBrchNum);
			                    		if(acct=='0'){
			                    			return '账号不存在,请重新输入';
			                    		}
			                    		
			                    	}
			                    }
			                }
					 },
					 {
						 field:'amt',
						 title:'金额',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'金额',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(!checkFloat(value)) return "金额必须为数字";
			                    },
						 }
					 },
					 {
						 field:'startIntDt',
						 title:'起息日',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'起息日',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(value==null||value=='') return "起息日必填";
			                    },
						 }
					 },
					 {
						 field:'matDt',
						 title:'到期日',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'到期日',
							 placement:'top',
							 emptytext:"空",
							 
						 }
					 },
					 {
						 field:'rate',
						 title:'利率(%)',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'利率',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(!checkFloat(value)) return "利率必须为数字";
			                    },
						 }
					 },					 
					 {
						 field:'addtRcrdTm',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addtRcrdPersonEmpno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	               ], 
	        ];
	        $('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/SC028query',
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
	                	'addtRcrdTm':$("#ADDT_RCRD_TM").val(),
	                	'acctNum':$("#ACCT_NUM").val(),
	                	'custName':$("#CUST_NAME").val(),
	                	'DW':$("#DW").selectpicker("val"),
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	oldTable = JSON.parse(JSON.stringify(res.data));
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            rowStyle:function(row,index){
	            	if(row.isAdd){
	            		//新增行样式
	            		/*['active','success','info','warning','danger']*/
	            		/*return {
	            				css:{
	            					'color':'green'
	            				}
	            		}*/
	            		return {classes:'info'};
	            	}else{
	            		return {};
	            	}
	            },
	            onLoadSuccess: function (data) {
	            	initBootStrapTablevalidateEdit($("#table1"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){
			    	$("#table1").bootstrapTable("resetView");
	            	if(row.acctNum!=null&&row.acctNum!=''){
			    		//修改
						$.each(oldTable.rows,function(index,item){
							//alert(item.acctNum+"-"+row.acctNum+"-"+item.isAdd+"-"+row.isAdd);
							if(item.acctNum===row.acctNum&&row.isAdd!=true){
								if(eval("item."+field)===eval("row."+field)){
									$el.removeClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									delete row.updateCell[field];
								}else{
									$el.addClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									row.updateCell[field] = '1';
								}
							}
						});
					}
				},
	            columns: columns
	            

	        });
	    }
}

var TableObjPageHistory = {
		table2: function () {
	        var columns = [
	              [
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },					
					 {
						 field:'custName',
						 title:'客户名称',
						 align: "center",
						 valign: "middle",
					 },					
					 {
						 field:'acctNum',
						 title:'账号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'amt',
						 title:'金额',
						 align: "center",
						 valign: "middle",						
					 },
					 {
						 field:'startIntDt',
						 title:'起息日',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'matDt',
						 title:'到期日',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'rate',
						 title:'利率(%)',
						 align: "center",
						 valign: "middle",						
					 },					 
					 {
						 field:'addtRcrdTm',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addtRcrdPersonEmpno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'opeTypeCd',
						 title:'操作类型',
						 align: "center",
						 valign: "middle",						
					 },
	               ], 
	        ];
	        $('#table2').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/SC028queryAll',
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
	                    'addtRcrdTm':$("#ADDT_RCRD_TM").val(),
	                	'acctNum':$("#ACCT_NUM").val(),
	                	'custName':$("#CUST_NAME").val(),
	                	'DW':$("#DW").selectpicker("val"),
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
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
	            columns: columns

	        });
	    }
}