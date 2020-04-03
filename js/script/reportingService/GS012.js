//删除id数组
var deleteIds = [];
var bodyIndex = 0;
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
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
            	orgNum	:'',
            	orgName	:'',
            	orgHirchy	:'',
            	custName	:'',
            	orgCode	:'',
            	acct	:'',
            	glNum :'',
            	tranOutDrct	:'',
            	tranOutCntptyNum	:'',
            	tranOutCntpty	:'',
            	bizType	:'',
            	tranOutRatio	:'',
            	tranOutBeginDt	:'',
            	tranOutMatDt	:'',
            	dpstPnt	:'',
            	dpstDaily	:'',
            	dpstPrft	:'',
            	loanPnt	:'',
            	loanDaily	:'',
            	loanPrft	:'',
            	mdlBizIncom	:'',
            	addtRcrdTm	:addtRcrdTm,
            	addtRcrdPersonEmpno	:empNum,
            }
        });
    	//更新表中修改过字段的颜色
    	updateCellDataClass($("#table1"));
    });
    //删除行
	$("#btn_del").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
		var ids=[];
		$.each(checklist,function(index,item){
			ids.push(item.number);
			if(item.addtRcrdId!=undefined&&item.addtRcrdId!=null&&item.addtRcrdId!=''){
				deleteIds.push(item.addtRcrdId);
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
			if(item.addtRcrdId!=undefined&&item.addtRcrdId!=null&&item.addtRcrdId!=''){
				//修改数据
				if(item.updateCell&&Object.keys(item.updateCell).length>0){
					updateData.push(item)
				}
			}else{
				//新增数据
				addData.push(item);
			}
		});
		if(addData.length==0&&updateData.length==0&&deleteData==0){
			layer.msg("没有任何修改，无需保存",{icon:3});
			return;
		}
		var data = {
				'addData':addData,
				'updateData':updateData,
				'deleteData':deleteData
		};
		var index;
		$.ajax({
			url : portal.bp() + '/table/addRecord/GS012save',
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
	queryHistory();
    
    //初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'R_CORP_IN_RES_TRAN_OUT_INFO-GS012'
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
	deleteIds = [];
    TableObjPage.table1();
    $("#tab1").click();
}
//查询修改记录
function queryHistory() {
	TableObjPageHistory.table2();
	//$("#tab2").click();
}
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $("#ADDT_RCRD_TM").val(date);
    $("#ORG_HIRCHY").selectpicker('refresh').selectpicker('val', "5").change();
    $("#CURR_CD").selectpicker('refresh').selectpicker('val', "03");
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
						  field:'orgNum',
						  title:'经营单位编号',
						  align: "center",
						  valign: "middle",
						  editable:{
			                    type:'text',
			                    title:'经营单位编号',
			                    placement:'top',
			                    emptytext:"空",
			                    validate:function(value){
			                    	//if(value==null||value=='') return "经营单位编号必填";
			                    	$el = $(this);
			                    	if (value==null||value==''){
			                    		return '经营单位编号必填';
			                    	}else if(value=='23'){
			                    		
		                    			disableSiblingsAndSetValue($el,"orgName","中关村分行");
		                    			enableSiblingsAndSetValue($el,"orgHirchy","2");
			                    	}else{
			                    		var branchName = $.param.getBranchName(value,'0');
			                    		if(branchName==null||branchName==''){
			                    			enableSiblings($el,"orgName");
			                    			//enableSiblingsAndSetValue($el,"tranInOrgName","");
			                    		}else{
			                    			disableSiblingsAndSetValue($el,"orgName",branchName);
			                    			enableSiblingsAndSetValue($el,"orgHirchy","5");
			                    		}
			                    	}
			                    },
			                },
					 },
					 {
						 field:'orgName',
						 title:'经营单位名称',
						 align: "center",
						 valign: "middle",
						 editable:{
			                    type:'text',
			                    title:'经营单位编号',
			                    placement:'top',
			                    emptytext:"空",
			                    validate:function(value){
			                    	if(value==null||value=='') return "经营单位名称必填";
			                    },
			                }
					 },
					 {
						 field:'orgHirchy',
						 title:'机构层级',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'select',
							 title:'机构层级',
							 source:$.param.getEditableJsonByParentId("GS012_ORGHIRCHY"),
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
								 if(value==null||value=='') return "机构层级必填";
								 var bizTypeValue = getSiblingsValue($(this),"bizType");
								 if(bizTypeValue!=null&&bizTypeValue=='3'){
									 //业务类型为‘公司贷款’
									 if(value!='5'){
										 //'机构层级'必须为'支行'
										 return '业务类型为公司贷款时必须为支行';
									 }
								 }
							 },
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
							 validate:function(value){
			                    	if(value==null||value=='') return "客户名称必填";
			                    },
						 }
					 },
					 {
						 field:'orgCode',
						 title:'组织机构代码',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'组织机构代码',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(value==null||value=='') return "组织机构代码必填";
			                    },
						 }
					 },
					 {
						 field:'acct',
						 title:'账号',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'账号',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
								 var bizTypeValue = getSiblingsValue($(this),"bizType");
								 if(bizTypeValue!=null&&bizTypeValue=='4'){
									 //业务类型为‘公司中收’
									 if(value==null||value==''){
										 //‘账号’必填
										 return '业务类型为公司中收时必填';
									 }
								 }
							 },
						 }
					 },
					 {
						 field:'glNum',
						 title:'科目号',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'科目号',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
								 if(value==null||value==''){
									 return '科目号必填';
								 }
						
							 },
						 }
					 },
					 {
						 field:'tranOutDrct',
						 title:'转移方向',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'select',
							 title:'转移方向',
							 source:$.param.getEditableJsonByParentId("TRAN_OUT_DRCT"),
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(value==null||value=='') return "转移方向必填";
			                    },
						 }
					 },
					 {
						 field:'tranOutCntptyNum',
						 title:'转移对手编号',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转移对手编号',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	//if(value==null||value=='') return "转移对手编号必填";
			                    	$el = $(this);
			                    	if (value==null||value==''){
			                    		return '转移对手编号必填';
			                    	}else{
			                    		var branchName = $.param.getBranchName(value,'0');
			                    		if(branchName==null||branchName==''){
			                    			enableSiblings($el,"tranOutCntpty");
			                    			//enableSiblingsAndSetValue($el,"tranInOrgName","");
			                    		}else{
			                    			disableSiblingsAndSetValue($el,"tranOutCntpty",branchName);
			                    		}
			                    	}
			                    },
						 }
					 },
					 {
						 field:'tranOutCntpty',
						 title:'转移对手',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转移对手',
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
			                    	if(value==null||value=='') return "转移对手必填";
			                    },
						 }
					 },
					 {
						 field:'bizType',
						 title:'业务类型',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'select',
							 title:'业务类型',
							 source:$.param.getEditableJsonByParentId("BIZ_TYPE"),
							 placement:'top',
							 emptytext:"空",
							 validate:function(value){
								    $el = $(this);
						    		//业务类型验证规则
						    		if(value=='1'||value=='2'){
										 enableSiblings($el,"dpstPnt");
										 enableSiblings($el,"dpstDaily");
										 enableSiblings($el,"mdlBizIncom");
										 
										 enableSiblings($el,"dpstPnt");
										 enableSiblings($el,"dpstDaily");
										 enableSiblings($el,"dpstPrft");
										 enableSiblings($el,"loanPnt");
										 enableSiblings($el,"loanDaily");
										 enableSiblings($el,"loanPrft");
										 
										 //业务类型为‘公司存款’、‘公司保本理财’时，‘贷款时点’、‘贷款日均’、‘贷款利润’、‘中间业务收入’不可填；
										 disableSiblingsAndSetValue($el,"loanPnt",null);
										 disableSiblingsAndSetValue($el,"loanDaily",null);
										 disableSiblingsAndSetValue($el,"loanPrft",null);
										 disableSiblingsAndSetValue($el,"mdlBizIncom",null);
										 
									 }else if(value=='3'){
										 enableSiblings($el,"loanPnt");
										 enableSiblings($el,"loanDaily");
										 enableSiblings($el,"loanPrft");
										 enableSiblings($el,"mdlBizIncom");
										 
										 enableSiblings($el,"dpstPnt");
										 enableSiblings($el,"dpstDaily");
										 enableSiblings($el,"dpstPrft");
										 enableSiblings($el,"loanPnt");
										 enableSiblings($el,"loanDaily");
										 enableSiblings($el,"loanPrft");
										 
										 //业务类型为‘公司贷款’时，'机构层级'必须为'支行'‘存款时点’、‘存款日均’、‘中间业务收入’不可填；
										 disableSiblingsAndSetValue($el,"dpstPnt",null);
										 disableSiblingsAndSetValue($el,"dpstDaily",null);
										 disableSiblingsAndSetValue($el,"mdlBizIncom",null);
										 
									 }else if(value=='4'){
										 enableSiblings($el,"dpstPnt");
										 enableSiblings($el,"dpstDaily");
										 enableSiblings($el,"mdlBizIncom");
										 
										 enableSiblings($el,"loanPnt");
										 enableSiblings($el,"loanDaily");
										 enableSiblings($el,"loanPrft");
										 enableSiblings($el,"mdlBizIncom");
										 
										 //业务类型为‘公司中收’时，‘账号’必填,‘存款时点’、‘存款日均’、‘存款利润’、‘贷款时点’、‘贷款日均’、‘贷款利润’不可填；
										 disableSiblingsAndSetValue($el,"dpstPnt",null);
										 disableSiblingsAndSetValue($el,"dpstDaily",null);
										 disableSiblingsAndSetValue($el,"dpstPrft",null);
										 disableSiblingsAndSetValue($el,"loanPnt",null);
										 disableSiblingsAndSetValue($el,"loanDaily",null);
										 disableSiblingsAndSetValue($el,"loanPrft",null);
									 }
						    	
							 },
						 }
					 },
					 {
						 field:'tranOutRatio',
						 title:'转移比例',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转移比例',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	/*if (v==null||v=='') 
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '转移比例必须是数字';*/
			                        if(v==null||v==''){
			                        	return '转移比例必填项';
			                        }else{
			                        	var reg = /^\d{0,8}\.{0,1}(\d{1,6})?$/;
			                        	reg = new RegExp(reg);
				                    	if(parseFloat(v)>0&&parseFloat(v)<1){
				                    		if(reg.test(v)){
				                    		}else{
				                    			return "转移比例最多保留6位有效小数";
				                    		}
				                    	}else{
				                    		return "转移比例大于0小于1"
				                    	}
			                        }
			                        
			                    }
						 }
					 },
					 {
						 field:'tranOutBeginDt',
						 title:'转移起始日',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'转移起始日',
							 //mode:'inline',
							 placement:'top',
							 format:'yyyy-mm-dd',
							 emptytext:"空",
							 validate:function(value){
			                    	if(value==null||value=='') return "转移起始日必填";
			                    },
						 }
					 },
					 {
						 field:'tranOutMatDt',
						 title:'转移到期日',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'转移到期日',
							 //mode:'inline',
							 format:'yyyy-mm-dd',
							 placement:'top',
							 emptytext:"空",
						 }
					 },
					 {
						 field:'dpstPnt',
						 title:'存款时点',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'存款时点',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '存款时点必须是数字';
			                    }
						 }
					 },
					 {
						 field:'dpstDaily',
						 title:'存款日均',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'存款日均',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '存款日均必须是数字';
			                    }
						 },
					 },
					 {
						 field:'dpstPrft',
						 title:'存款利润',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'存款利润',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '存款利润必须是数字';
			                    }
						 }
					 },
					 {
						 field:'loanPnt',
						 title:'贷款时点',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'贷款时点',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '贷款时点必须是数字';
			                    }
						 }
					 },
					 {
						 field:'loanDaily',
						 title:'贷款日均',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'贷款日均',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '贷款日均必须是数字';
			                    }
						 }
					 },
					 {
						 field:'loanPrft',
						 title:'贷款利润',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'贷款利润',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '贷款利润必须是数字';
			                    }
						 }
					 },
					 {
						 field:'mdlBizIncom',
						 title:'中间业务收入',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'中间业务收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if (v!=null&&v!=''&&!checkFloat(v)) return '中间业务收入必须是数字';
			                    }
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
	            url: portal.bp() + '/table/addRecord/GS012query',
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
	                	'orgId':$("#ORG_ID").val(),
	                	'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
	                	'DW':$("#DW").selectpicker("val"),
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
                    $('#table1').bootstrapTable('resetView',{
                        height:getTableHeight(document)
                    });
	            	initBootStrapTablevalidateEdit($("#table1"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){
			    	$("#table1").bootstrapTable("resetView");
	            	if(row.addtRcrdId!=null&&row.addtRcrdId!=''){
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.addtRcrdId===row.addtRcrdId){
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
	            columns: columns,

	        });
	    }
};

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
						  field:'orgNum',
						  title:'经营单位编号',
						  align: "center",
						  valign: "middle",
					 },
					 {
						 field:'orgName',
						 title:'经营单位名称',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'orgHirchy',
						 title:'机构层级',
						 align: "center",
						 valign: "middle",
						 formatter: function (value, row, index) {
							 return $.param.getDisplay('GS012_ORGHIRCHY', value);
					      }
					 },
					 {
						 field:'custName',
						 title:'客户名称',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'orgCode',
						 title:'组织机构代码',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'acct',
						 title:'账号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'glNum',
						 title:'科目号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'tranOutDrct',
						 title:'转移方向',
						 align: "center",
						 valign: "middle",
						 formatter: function (value, row, index) {
							 return $.param.getDisplay('TRAN_OUT_DRCT', value);
					      }
					 },
					 {
						 field:'tranOutCntptyNum',
						 title:'转移对手编号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'tranOutCntpty',
						 title:'转移对手',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'bizType',
						 title:'业务类型',
						 align: "center",
						 valign: "middle",
						 formatter: function (value, row, index) {
							 return $.param.getDisplay('BIZ_TYPE', value);
					      }
					 },
					 {
						 field:'tranOutRatio',
						 title:'转移比例',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'tranOutBeginDt',
						 title:'转移起始日',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'tranOutMatDt',
						 title:'转移到期日',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'dpstPnt',
						 title:'存款时点',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'dpstDaily',
						 title:'存款日均',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'dpstPrft',
						 title:'存款利润',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'loanPnt',
						 title:'贷款时点',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'loanDaily',
						 title:'贷款日均',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'loanPrft',
						 title:'贷款利润',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'mdlBizIncom',
						 title:'中间业务收入',
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
						 formatter: function (value, row, index) {
							 if(value=='01') return '新增'; 
							 if(value=='02') return '修改'; 
							 if(value=='03') return '删除'; 
					      }
					 },
	               ], 
	        ];
	        $('#table2').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/GS012queryHistory',
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
	                	'orgId':$("#ORG_ID").val(),
	                	'orgHirchy':$("#ORG_HIRCHY").selectpicker("val"),
	                	'DW':$("#DW").selectpicker("val"),
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            height:getTableHeight(document), //表格固定高度
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