var orgId = "";
var orgNum = "";
var orgName = "";
var superOrgId = "";
var superOrgNum = "";
var superOrgName = "";
var orgHirchy = "";
var orgHirchyName = "";
var seq="";
var operaType = "";
//分行机构id
var branchOrgId = "";
//分行机构num
var branchOrgNum = "";
var add_superOrgId="";
var add_superOrgNum="";
var add_superOrgName="";
var edit_superOrgId="";
var edit_superOrgNum="";
var edit_orgHirchyName="";
var memOrgchecklist;
var pkId = "";
var setting = {
	view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "orgId",
            pIdKey: "superOrgId",
            rootPId: ""
        },
        key:{
        	url:"",
        	name:"orgName"
        }
    },
    callback: {
        beforeClick: function(treeId, o) {
        	/*if(o.orgHirchy != undefined && o.orgHirchy==='LV2'){
        		$("#btn_add").show();
        	}else{
        		$("#btn_add").hide();
        	}*/
        	if(o.orgHirchy != undefined && o.orgHirchy==='LV3'&& o.orgChar!='2'){
				$("#btn_del").show();
				$("#btn_edit").show();
			}else{
				$("#btn_del").hide();
				$("#btn_edit").hide();
			}
        	if(o.orgHirchy != undefined && o.orgHirchy==='LV4'||o.orgHirchy==='LV5'){
        		$("#btn_editName").show();
        	}else{
        		$("#btn_editName").hide();
        	}
			orgId = o.orgId;
			orgNum = o.orgNum;
			orgName = o.orgName;
			superOrgId = o.superOrgId;
			superOrgNum = o.superOrgNum;
			superOrgName = o.superOrgName;
			orgHirchy = o.orgHirchy;
			orgHirchyName = o.orgHirchyName;
			updateElement();
        }
    }
};

$(function () {
	//行内编辑框可拖动
	$(document).on("show.bs.modal",".editable-popup",function(){
		$(this).draggable();
	})
	$("#orgtree").height(document.body.clientHeight - 105);
	$("#orgcontent").height(document.body.clientHeight - 105);
	
	$("#add_orgChar").html("").append($.param.getSelectOptionOrder("ORGCHAR"));
    $('#add_orgChar').selectpicker('refresh');
    $("#add_belongline").html("").append($.param.getSelectOptionOrder("AB0007"));
    $('#add_belongline').selectpicker('refresh');
	orgtree();
	//初始化所属分行
	initSuperOrgName();
	//Modal验证销毁重构
    $('#addModal').on('hidden.bs.modal', function() {
        $("#addModal_Modal_Form").data('bootstrapValidator').destroy();
        $('#addModal_Modal_Form').data('bootstrapValidator', null);
        //重置管辖行已选列表
		memOrgchecklist = undefined;
		
		$("#add_orgChar").prop('disabled',false).selectpicker('refresh');
		$("#add_orgNum").prop('disabled',false);
//		$("#add_president").prop('disabled',false).selectpicker('refresh');
		$("#add_orgName").prop('disabled',false);
		$("#add_superOrgName").prop('disabled',false);
		edit_superOrgId="";
		edit_superOrgNum="";
		edit_orgHirchyName="";
		//重置
    	pkId = "";
		
    });
    //机构性质change事件
    $('#add_orgChar').on('changed.bs.select',function(e){
		var val = $(this).val();
		if(seq==undefined||seq==null||seq==''){
			//获取sequence
			$.ajax({
				url : portal.bp() + '／json/org/getSeqOrgNum.json',
				dataType:'json',
				cache:false,
				async:false,
				data:{},
				type:'get',
				success : function(d) {
					if(d.code==='200'){
						seq = d.data;
					}else{
						layer.msg(d.message,{icon:2});
					}
				}
			});
		}
		if(val==='1'){//虚拟机构
			$("#add_memOrgDiv").show();
			$("#add_orgId").val("DUM_"+branchOrgId+"_"+seq).change();
			$("#add_orgNum").val(branchOrgNum+"0"+seq).change();
			$("#add_orgName").attr("readonly","readonly");
//			var president = $("#add_president").find("option:selected").text();
			var president = $("#add_president").val();
			if(president!=undefined&&president!=null&&president!='主管行长工号'&&president!=''){
				$("#add_orgName").val(president+"主管行").change();
			}
			//主管行长开启校验
			var validator = $("#addModal_Modal_Form").data('bootstrapValidator');
			if(validator!=undefined&&validator!=null){
				validator.enableFieldValidators('add_president',true);
				validator.enableFieldValidators('add_presidentName',true);
				validator.enableFieldValidators('add_belongline',false);
			}
			//validator.updateStatus('add_president','NOT_VALIDATED').validateField('add_president');
			$("#add_president_div").show();
			$("#add_presidentName_div").show();
			$("#add_belongline_div").hide();
			$("#add_belongline").selectpicker('val',['noneSelectedText']).selectpicker('refresh');
		}else{//分行部室
			$("#add_memOrgDiv").hide();
			$("#add_orgId").val("BRCH_"+branchOrgId+"_"+seq).change();
			$("#add_orgNum").val(branchOrgNum+"1"+seq).change();
			$("#add_orgName").removeAttr("readonly");
			
			//主管行长取消校验
			var validator = $("#addModal_Modal_Form").data('bootstrapValidator');
			if(validator!=undefined&&validator!=null){
				validator.enableFieldValidators('add_president',false);
				validator.enableFieldValidators('add_presidentName',false);
				validator.enableFieldValidators('add_belongline',true);
			}
			//validator.updateStatus('add_president','NOT_VALIDATED').validateField('add_president');
			$("#add_belongline_div").show();
			$("#add_president").val("").change();
			$("#add_president_div").hide();
			$("#add_presidentName").val("").change();
			$("#add_presidentName_div").hide();
		}
	});
    $("#add_president").on('blur',function(e){
    	if($("#add_orgChar").val()==='1'){
    		var presidentName = '';
    		if($(this).val().trim()!=''){
    			presidentName = getPresidentName($(this).val());
    		}
    		$("#add_presidentName").val(presidentName).change();
    		var validator = $("#addModal_Modal_Form").data('bootstrapValidator')
    		if(validator!=undefined&&validator!=null){
    			validator.validateField('add_presidentName');
    		}
    		if(presidentName!=''){
    			$("#add_orgName").val(presidentName+"主管行").change();
    		}else{
    			$("#add_orgName").val("").change();
    		}
    	}
    })
    /*$("#add_president").on('changed.bs.select',function(e){
    	if($("#add_orgChar").val()==='1'){
    		var text = $(this).find("option:selected").text();
    		$("#add_orgName").val(text+"主管行").change();;
    	}
    });*/
    
    //页面保存按钮
    $("#addSaveBtn").click(function(){
    	//表单校验
		var bootstrapValidator = $("#addModal_Modal_Form").data('bootstrapValidator');
		bootstrapValidator.validate();
		if(!bootstrapValidator.isValid())
			return;
		
		var orgDummyRelHistoryList = [];
		if($("#add_orgChar").val()==='1'){
			//虚拟主管行
			if(memOrgchecklist!==undefined){
				$.each(memOrgchecklist,function(index,item){
					var orgDummyRelHistory = {
							'memOrgNumId':item.orgId,
							'effDt':item.effDt,
							'invalidDt':item.invalidDt
					};
					orgDummyRelHistoryList.push(orgDummyRelHistory);
				});
			}
		}
		var index;
		var orgHirchyName;
		var superOrgId_param;
		var superOrgNum_param;
		var superOrgName_param=$("#add_superOrgName").val();
		var type;
		if(operaType==='edit'){
			superOrgId_param = edit_superOrgId;
			superOrgNum_param = edit_superOrgNum;
			type = "put";
			orgHirchyName = edit_orgHirchyName;
			if($("#add_orgChar").val()==='0'){
				//分行部室，上级机构变成条线
				superOrgId_param = branchOrgId+'_'+$("#add_belongline").val();
				superOrgNum_param = parseInt(branchOrgNum+$("#add_belongline").val().substr(1));
				superOrgName_param = $("#add_belongline").find("option:selected").text();
			}
		}else{
			superOrgId_param = add_superOrgId;
			superOrgNum_param = add_superOrgNum;
			type = "post";
			if($("#add_orgChar").val()==='1'){
				orgHirchyName = "虚拟主管行";
			}else{
				//分行部室，上级机构变成条线,机构层级名称变成条线名称
				orgHirchyName = $("#add_belongline").find("option:selected").text();
				superOrgId_param = branchOrgId+'_'+$("#add_belongline").val();
				superOrgNum_param = parseInt(branchOrgNum+$("#add_belongline").val().substr(1));
				superOrgName_param = $("#add_belongline").find("option:selected").text();
			}
		}
		var data = {
			'orgDummyHistory':{
				'pkId':pkId,
				'orgChar':$("#add_orgChar").val(),
				'orgId':$("#add_orgId").val(),
				'orgNum':$("#add_orgNum").val(),
				'president':$("#add_president").val(),
				'orgName':$("#add_orgName").val(),
				'superOrgName':superOrgName_param,
				'superOrgId':superOrgId_param,
				'superOrgNum':superOrgNum_param,
				'orgHirchy':'LV3',
				'orgHirchyName':orgHirchyName
			},
			'orgDummyRelHistoryList':orgDummyRelHistoryList
		};
		$.ajax({
			url : portal.bp() + './json/ok.json',
			type: type,
			cache:false,
			contentType: "application/json;charset=UTF-8",
			dataType: "json",
			data:JSON.stringify(data),
			success : function(d) {
				if(d.code=='200'){
					layer.msg("操作成功",{icon:1});
					$("#addModal").modal("hide");
					//重置序列，保证可以重新获取
					seq = "";
					//重置管辖行已选列表
					memOrgchecklist = undefined;
					showApproveModal.oTableInit();
				}else{
					layer.msg(d.message,{icon:2});
				}
			},
			beforeSend:function(XMLHttpRequest){
				//index = layerLoad();
			},
			complete:function(XMLHttpRequest){
				//layerClose(index);
			}
		});
		
    });
    //添加管辖行按钮
    $("#add_memOrg").click(function(){
    	$('#memOrgtable').bootstrapTable('destroy');
    	initMemOrg();
    	$("#memOrgModal").modal("show");
    });
    //设置管辖行页面保存按钮
    $("#memOrgSaveBtn").click(function(){
    	memOrgchecklist = $('#memOrgtable').bootstrapTable('getSelections');
    	$("#memOrgModal").modal("hide");
    });
    
    //Modal验证销毁重构
    $('#editNameModal').on('hidden.bs.modal', function() {
        $("#editNameModal_Form").data('bootstrapValidator').destroy();
        $('#editNameModal_Form').data('bootstrapValidator', null);
    });
    
    //编辑机构名称保存按钮
    $("#editNameSaveBtn").click(function(){
    	//表单校验
		var bootstrapValidator = $("#editNameModal_Form").data('bootstrapValidator');
		bootstrapValidator.validate();
		var index;
		if(!bootstrapValidator.isValid())
			return;
		
    	var data = {
			'orgId':$("#editName_orgId").val(),
			'orgName':$("#editName_orgName").val()
		};
		$.ajax({
			url : portal.bp() + './json/ok.json',
			type: "post",
			cache:false,
			dataType: "json",
			data:data,
			success : function(d) {
				if(d.code=='200'){
					layer.msg("修改成功",{icon:1});
					$("#editNameModal").modal("hide");
					window.location.reload();
				}else{
					layer.msg(d.message,{icon:2});
				}
			},
			beforeSend:function(XMLHttpRequest){
				//index = layerLoad();
			},
			complete:function(XMLHttpRequest){
				//layerClose(index);
			}
		});
    });
    $("#show_history").click(function(){
    	var checklist = $('#approvetable').bootstrapTable('getSelections');
    	if(checklist==null||checklist.length!=1){
    		layer.msg('请选择一条数据',{icon:3});
    		return;
    	}
    	showWorkFlowHistory(checklist[0].pkId);
    });
});
function getPresidentName(president){
	var presidentName;
	$.ajax({
        url: portal.bp() + './json/user/getEmpInfoByEmpNum.json',
        type: 'get',
        async: false,
        cache: false,
        data: {
            'empId': president
        },
        success: function (data) {

            if (data.code != 200) {
                layer.msg(data.message, {icon: 2});
            }
            var user = data.data;
            if(user!=null){
            	presidentName = user.empName;
            }else{
            	presidentName = "";
            }
        }
    });
	return presidentName;
}
function showApproveDetail(){
	showApproveModal.oTableInit();
	$("#showApproveModal").modal("show");
}
function userworkflowGoback(pkId){
	if(workflowGoback(pkId)){
		showApproveModal.oTableInit();
	}
}
function delMgmt(pkId){
	$.ajax({
        url: portal.bp() + './json/ok.json?r='+Math.random(),
        type: 'POST',
        async: false,
        data:{"pkIdList": [pkId]},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	layer.msg("操作成功",{icon:1});
        	showApproveModal.oTableInit();
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
var showApproveModal = {
	    oTableInit: function () {
	    	//重置
	    	pkId = "";
	        var columns = [];
	            columns = [
	                {
	                    field: 'check',
	                    checkbox: true
	                },
	                {
	                    field: 'Number',
	                    title: '序号',
	                    align: 'center',
	                    formatter: function (value, row, index) {
	                        return index + 1;
	                    }
	                }, {
	                    field: 'orgId',
	                    title: '机构编号',
	                }, {
	                    field: 'orgName',
	                    title: '机构名称',
	                }, {
	                    field: 'orgChar',
	                    title: '机构性质',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('ORGCHAR', value);
	                    }
	                }, {
	                    field: 'opeType',
	                    title: '操作类型',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('OPETYPE', value);
	                    }
	                },
	                {
	                    field: 'childrenOrgName',
	                    title: '成员详情',
	                },
	                {
	                	field: '',
	                	title: '状态',
	                	formatter: function (value, row, index) {
	                		var res = '';
	                		if(row.startEndFlag!=undefined&&row.startEndFlag!=null&&row.startEndFlag=='1'){
	                			//第一节点
	                			if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='0'){
	                				//退回到第一节点
	                				res = '审批拒绝';
	                			}else if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='2'){
	                				//已撤回
	                				res = '已撤回';
	                			}
	                		}else if (row.startEndFlag!=undefined&&row.startEndFlag!=null&&row.startEndFlag=='0'){
	                			//最后节点
	                			res = '审批通过';
	                		}else{
	                			//中间节点
	                			res = '待计财负责人审批';
	                		}
	                		return res;
	                    }
	                },
	                {
		                field: '',
		                title: '备注',
		                formatter: function (value, row, index) {
		                	if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='0'){
		                		return row.dealComntDesc;
		                	}
		                }
		            },
	                {
	                	field: '',
	                	title: '操作',
	                	formatter: function (value, row, index) {
	                		/*if(hasEditPermiss){
	                			if(row.validTag=='1'&&(row.opeType=='1'||row.opeType=='2')&&row.startEndFlag=='1'){
	                				//有效、新增或修改、审批流程到第一节点
	                				return '<a id="btn_edit" onclick="editDummy(\''+row.pkId+'\',\''+row.orgId+'\');" class="oper-left" ><b>编辑</b></a>';
	                			}
	                		}*/
	                		var html = '';
	                		if(row.isInitPersion=='1'&&row.validTag=='1'){
	                			//是任务发起人、有效
	                			if((row.opeType=='1'||row.opeType=='2')&&row.startEndFlag=='1'){
	                				//新增或修改、审批流程到第一节点
	                				html += '<span class="oper-mid" ></span><a id="btn_edit" onclick="editDummy(\''+row.pkId+'\',\''+row.orgId+'\');" class="oper-left" ><b>编辑</b></a>';
	                			}
	                			if(row.startEndFlag=='1'){
	                				//开始节点，可删除
	                				html += '<span class="oper-mid" ></span><a id="btn_sp_del" onclick="delMgmt(\''+row.pkId+'\');" class="oper-left" ><b>删除</b></a>';
	                			}
	                			if(row.initpersionisgoback=='1'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
	                				//非结束节点、任务发起人，可撤回
	                				html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="userworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
	                			}
	                		}
	                		if(row.initpersionisgoback=='0'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
	                			//非结束节点
	                			if(row.isProcerPersion=='1'&&row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='1'){
	                				//是最新处理人、到达该节点是通过，可撤回
	                				html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="userworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
	                			}
	                		}
	                		return html;
	                	}
	                },
	                
	            ];
	        $('#approvetable').bootstrapTable("destroy");
	        $('#approvetable').bootstrapTable({
	            url: portal.bp() + './json/org/workflow/mypageList.json',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: true,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {
	                return {
	                    'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 5,      //每页的记录行数（*）
	            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
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
	            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
	            columns: columns
	        });
	    }
	};

function initMemOrg(){
	var org = "";
	if(operaType==='edit'){
		org = orgId;
	}
	$('#memOrgtable').bootstrapTable({
		url: portal.bp() + './json/org/findMemOrg.json',
	    method: 'get',      //请求方式（*）
	    striped: true,      //是否显示行间隔色
	    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: false,     //是否显示分页（*）
	    sortStable:true,      //是否启用排序
	    sortOrder: "desc",     //排序方式
	    singleSelect:false,    //是否单选，true时没有全选按钮
	    "queryParamsType": "limit",
	    contentType: "application/x-www-form-urlencoded",
	    queryParams:function(params) {
	   		return {
	   			'orgId':org,
	   			'dummytabPkId':pkId
	   		};
	    },
	    clickToSelect: true,    //是否启用点击选中行
	    resizable:true,			//是否可调整列宽度
	    responseHandler:function(res){ //服务端返回数据
	    	if(res.code == '200'){
	    		return res.data;
	    	}else{
	    		layer.msg(res.message,{icon:2});
	    		return {};
	    	}
	    },
	    //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
	    columns: [
			{
				  field:'check',
				  checkbox:true,
				  clickToSelect: true,
				  formatter:function(value,row,index){
					  if(memOrgchecklist===undefined){
						  if(row.checkFlag == '1'){
							  return {
								  checked:true
							  }
						  }
					  }else{
						  var flag = false;
						  $.each(memOrgchecklist,function(index,item){
							  if(row.orgId === item.orgId){
								  flag = true;
								  return false;
							  }
						  });
						  if(flag){
							  return {
								  checked:true
							  }
						  }
					  }
					  return value;
				  }
			},
			{
				field: 'orgId',
				title: '机构编号',
				clickToSelect: true,
			}, {
				field: 'orgName',
				title: '机构名称',
				clickToSelect: true,
			}, {
				field: 'effDt',
				title: '生效日期',
				clickToSelect: false,
				formatter:function(value,row,index){
//					var date = eval('new '+eval(value).source);
					if(value!=null&&value!=''){
						var date = new Date(value);
						var res = date.Format("yyyy-MM-dd");
						row.effDt = res;
						return res;
					}
				},
				editable:{
					type:'date',
					title:'生效日期',
					format:'yyyy-mm-dd',
					placement:'left',
					emptytext:'空',
				}
			},  {
				field: 'invalidDt',
				title: '失效日期',
				clickToSelect: false,
				formatter:function(value,row,index){
//					var date = eval('new '+eval(value).source);
					if(value!=null&&value!=''){
						var date = new Date(value);
						var res = date.Format("yyyy-MM-dd");
						row.invalidDt = res;
						return res;
					}
				},
				editable:{
					type:'date',
					title:'失效日期',
					format:'yyyy-mm-dd',
					placement:'left',
					emptytext:'空',
				}
			}, 
	     ],
	     onLoadSuccess:function(data){
	    	 memOrgchecklist = $('#memOrgtable').bootstrapTable('getSelections');
	    	 resizeTables();
	     }
	});
}
Date.prototype.Format = function(fmt){
	var o = {
			"M+":this.getMonth()+1,
			"d+":this.getDate(),
			"h+":this.getHours(),
			"m+":this.getMinutes(),
			"s+":this.getSeconds(),
			"q+":Math.floor((this.getMonth()+3)/3),
			"S":this.getMilliseconds()
	};
	if(/(y+)/i.test(fmt)) 
		fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	for(var k in o){
		if(new RegExp("("+k+")").test(fmt)) 
			fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));
	}
	return fmt;
}
//获取机构树
function orgtree(){
	 $.ajax({
		url : portal.bp() + './json/org/allValidOrg.json',
		dataType:'json',
		cache:false,
		data:{},
		type:'get',
		success : function(d) {
			if(d.code=='200'){
				$.fn.zTree.init($("#orgtree"), setting, d.data);
				var zTree = $.fn.zTree.getZTreeObj("orgtree");
				// zTree.expandAll(true);
			}else{
				layer.msg(d.message,{icon:2});
			}
		}
	});
}

function initSuperOrgName(){
	$.ajax({
		url : portal.bp() + './json/org/findSuperOrg.json',
		dataType:'json',
		cache:false,
		data:{},
		type:'get',
		success : function(d) {
			if(d.code=='200'){
				if(d.data){
					add_superOrgId = d.data.ID;
					add_superOrgNum = d.data.NUM;
					add_superOrgName = d.data.NAME;
					branchOrgId = add_superOrgId;
					branchOrgNum = add_superOrgNum;
				}
			}else{
				layer.msg(d.message,{icon:2});
			}
		}
	});
}
function updateElement(){
	$("#orgId").val(orgId);
	$("#orgNum").val(orgNum);
	$("#orgName").val(orgName);
	$("#superOrgId").val(superOrgId);
	$("#superOrgNum").val(superOrgNum);
	$("#superOrgName").val(superOrgName);
	$("#orgHirchy").val(orgHirchy);
	$("#orgHirchyName").val(orgHirchyName);
}

//新增
function add(){
	//重置表单
	$("#addModal_Modal_Form")[0].reset();
	//防止IE8没有placleholder
	$('input,textarea').not("#key").placeholder();
	$("#key").placeholder({isSpan:false});
	
	$('#add_orgChar').selectpicker('refresh');
//	$('#add_president').selectpicker('refresh');
	$("#add_superOrgName").val(add_superOrgName);
	$("#add_memOrgDiv").hide();
	$("#addModal_title").text("新增机构");
	operaType = "add";
	$("#addModal").modal("show");
	//绑定校验规则
	JqValidate();
}

//编辑已生效机构
function edit(){
	$("#addModal_title").text("编辑机构");
	operaType = "edit";
	var index;
	$.ajax({
		url : portal.bp() + './json/org/findOrgById/'+orgId+".json",
		dataType:'json',
		cache:false,
		type:'get',
		success : function(data) {
			if (data.code == "200") {
				var org = data.data;
				$("#add_orgChar").selectpicker("val",org.orgChar).trigger("change").prop('disabled',true).selectpicker('refresh');
				$("#add_orgId").val(org.orgId);
				$("#add_orgNum").val(org.orgNum).prop('disabled',true);
				$("#add_president").val(org.president).prop('disabled',true).trigger("change").trigger("blur");
				$("#add_orgName").val(org.orgName).prop('disabled',true);
				$("#add_superOrgName").val(org.superOrgName).prop('disabled',true);
				$("#add_belongline").selectpicker("val",org.superOrgId.replace(branchOrgId+'_',''));
				edit_superOrgId = org.superOrgId;
				edit_superOrgNum = org.superOrgNum;
				edit_orgHirchyName = org.orgHirchyName;
				
				//验证规则
				JqValidatedit();
				$("#addModal").modal("show");
			}else {
				layer.msg(data.message,{icon:2});
			}
		},
		beforeSend:function(XMLHttpRequest){
			//index = layerLoad();
		},
		complete:function(XMLHttpRequest){
			//layerClose(index);
		}
	});
	
	//查询管辖行并赋值，防止不打开设置管辖行页面
	$('#memOrgtable').bootstrapTable('destroy');
	initMemOrg();
	
}
//编辑未生效机构
function editDummy(ipkId,iorgId){
	pkId = ipkId;
	orgId = iorgId;
	$("#addModal_title").text("编辑机构");
	operaType = "edit";
	var index;
	$.ajax({
		url : portal.bp() + './json/org/findDummyOrgById/'+pkId+".json",
		dataType:'json',
		cache:false,
		type:'get',
		success : function(data) {
			if (data.code == "200") {
				var org = data.data;
				$("#add_orgChar").selectpicker("val",org.orgChar).trigger("change").prop('disabled',true).selectpicker('refresh');
				$("#add_orgId").val(org.orgId);
				$("#add_orgNum").val(org.orgNum).prop('disabled',true);
				$("#add_president").val(org.president).prop('disabled',true).trigger("change").trigger("blur");
				$("#add_orgName").val(org.orgName).prop('disabled',true);
				$("#add_superOrgName").val(org.superOrgName).prop('disabled',true);
				$("#add_belongline").selectpicker("val",org.superOrgId.replace(branchOrgId+'_',''));
				edit_superOrgId = org.superOrgId;
				edit_superOrgNum = org.superOrgNum;
				edit_orgHirchyName = org.orgHirchyName;
				
				//验证规则
				JqValidatedit();
				$("#addModal").modal("show");
			}else {
				layer.msg(data.message,{icon:2});
			}
		},
		beforeSend:function(XMLHttpRequest){
			//index = layerLoad();
		},
		complete:function(XMLHttpRequest){
			//layerClose(index);
		}
	});
	
	//查询管辖行并赋值，防止不打开设置管辖行页面
	$('#memOrgtable').bootstrapTable('destroy');
	initMemOrg();
	
}


//删除
function del(){
	layer.confirm('您确定要删除该节点吗？', {
		btn: ['确定','取消']
		}, function(){
			var index;
			$.ajax({
				url : portal.bp() + './json/ok.json?'+orgId,
				dataType:'json',
				cache:false,
				type:'delete',
				success : function(data) {
					if (data.code == "200") {
						layer.msg("操作成功",{icon:1});
					}else {
						layer.msg(data.message,{icon:2});
					}
				},
				beforeSend:function(XMLHttpRequest){
					//index = layerLoad();
				},
				complete:function(XMLHttpRequest){
					//layerClose(index);
				}
			});
		}, function(){
		});
}

//编辑机构名称
function editName(){
	$("#editName_orgId").val(orgId);
	$("#editName_orgNum").val(orgNum);
	$("#editName_orgName").val(orgName).change();
	$("#editNameModal").modal("show");
	editNameJqValidate();
}

//新增表单校验规则
function JqValidate(){
	$("#addModal_Modal_Form").bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields:{
			add_orgChar:{
				validators:{
					notEmpty:{
						message:"机构性质不能为空"
					},
				}
			},
			add_orgNum:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"机构编码不能为空"
					},
				}
			},
			add_president:{
				validators:{
					callback: {
						callback: function(value, validator) {
							var orgChar = $("#add_orgChar").val();
							if(orgChar==='1'){//虚拟机构
								if(value==undefined||value==null||value==''){
									return {
	                                    valid: false,
	                                    message: '主管行长工号不能为空'
	                                }
								}
							}
							return true;
						}
					}
				}
			},
			add_presidentName:{
				trigger:"change",
				validators:{
					callback: {
						callback: function(value, validator) {
							var orgChar = $("#add_orgChar").val();
							if(orgChar==='1'){//虚拟机构
								if(value==undefined||value==null||value==''){
									return {
										valid: false,
										message: '主管行长姓名不能为空'
									}
								}
							}
							return true;
						}
					}
				}
			},
			add_orgName:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"机构名称不能为空"
					},
				}
			},
			add_belongline:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"所属条线不能为空"
					},
				}
			},
			add_superOrgName:{
				validators:{
					notEmpty:{
						message:"所属分行不能为空"
					},
				}
			},
		}
	})
}

//编辑机构名称表单校验规则
function editNameJqValidate(){
	$("#editNameModal_Form").bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields:{
			editName_orgName:{
				validators:{
					notEmpty:{
						message:"机构名称不能为空"
					},
				}
			},
		}
	})
}

function winclose(){
	layer.closeAll();
}
//编辑表单校验规则
function JqValidatedit(){
	$("#addModal_Modal_Form").bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields:{
			add_orgChar:{
				validators:{
					notEmpty:{
						message:"机构性质不能为空"
					},
				}
			},
			add_orgNum:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"机构编码不能为空"
					},
				}
			},
			add_president:{
				validators:{
					callback: {
						callback: function(value, validator) {
							var orgChar = $("#add_orgChar").val();
							if(orgChar==='1'){//虚拟机构
								if(value==undefined||value==null||value==''){
									return {
	                                    valid: false,
	                                    message: '主管行长工号不能为空'
	                                }
								}
							}
							return true;
						}
					}
				}
			},
			add_presidentName:{
				trigger:"change",
				validators:{
					callback: {
						callback: function(value, validator) {
							var orgChar = $("#add_orgChar").val();
							if(orgChar==='1'){//虚拟机构
								if(value==undefined||value==null||value==''){
									return {
										valid: false,
										message: '主管行长姓名不能为空'
									}
								}
							}
							return true;
						}
					}
				}
			},
			add_orgName:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"机构名称不能为空"
					},
				}
			},
			add_belongline:{
				trigger:"change",
				validators:{
					notEmpty:{
						message:"所属条线不能为空"
					},
				}
			},
			add_superOrgName:{
				validators:{
					notEmpty:{
						message:"所属分行不能为空"
					},
				}
			},
		}
	})
	
}


var lastValue = "", nodeList = [], fontCss = {};
//键盘释放：当输入框的键盘按键被松开时，把查询到的数据结果显示在标签中
function callNumber() {
	//先更改上次搜索设置
	updateNodes(true,false);
	//搜索
	searchNode();
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	//如果结果有值，则显示比例；如果结果为0，则显示"[0/0]"；如果结果为空，则清空标签框；
	if (nodeList.length) {
		// 让结果集里边的第一个获取焦点（主要为了设置背景色），再把焦点返回给搜索框
		zTree.selectNode(nodeList[0], false);
		document.getElementById("key").focus();
		clickCount = 1; // 防止重新输入的搜索信息的时候，没有清空上一次记录
		// 显示当前所在的是第一条
		document.getElementById("number").innerHTML = "[" + clickCount + "/"
				+ nodeList.length + "]";

	} else if (nodeList.length == 0) {
		//搜索结果为0
		document.getElementById("number").innerHTML = "[0/0]";
		zTree.cancelSelectedNode(); // 取消焦点
		updateNodes(false,false);
//		var node = zTree.getNodes();
//		var nodes = zTree.transformToArray(node);
//		for (var i = 0, l = nodes.length; i < l; i++) {
//			zTree.setting.view.fontCss["font-weight"] = "normal";
//			zTree.setting.view.fontCss["color"] = "#333";
//			zTree.updateNode(nodes[i]);
//		}
	}

	// 如果输入框中没有搜索内容，则清空标签框
	if (document.getElementById("key").value == "") {
		document.getElementById("number").innerHTML = "";
		clickCount = 1;
		nodeList = [];
		zTree.cancelSelectedNode();
	}
}

//搜索节点
function searchNode() {
	var key = $('#key').val();
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	var value = key;
	//搜索框中无内容
	if (value == "") {
		updateNodes(false,false);
		return;
	}
	//搜索
	var keyType = "orgName";
	nodeList = zTree.getNodesByParamFuzzy(keyType, value); // 调用ztree的模糊查询功能，得到符合条件的节点
	updateNodes(true,true); // 更新节点
}

//高亮显示被搜索到的节点
function updateNodes(highlight,rest) {
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	for (var i = 0, l = nodeList.length; i < l; i++) {
		nodeList[i].highlight = highlight; // 高亮显示搜索到的节点(highlight是自己设置的一个属性)
		zTree.expandNode(nodeList[i].getParentNode(), true, false, false); // 将搜索到的节点的父节点展开
		if (highlight == true && rest== true) {
			// 设置搜索到的节点颜色
			zTree.setting.view.fontCss["font-weight"] = "bold";
			zTree.setting.view.fontCss["color"] = "#f96";
			zTree.updateNode(nodeList[i]); // 更新节点数据，主要用于该节点显示属性的更新
		} else {
			zTree.setting.view.fontCss["font-weight"] = "normal";
			zTree.setting.view.fontCss["color"] = "#333";
			zTree.updateNode(nodeList[i]);
		}
	}
}

//点击向上按钮时，将焦点移向上一条数据
function clickUp() {
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	// 如果焦点已经移动到了最后一条数据上，就返回第一条重新开始，否则继续移动到下一条
	if (nodeList.length == 0) {
		layer.alert("没有搜索结果！");
		return;
	} else if (clickCount == 1) {
		layer.alert("您已位于第一条记录上！");
		return;
		// 让结果集里边的下一个节点获取焦点（主要为了设置背景色），再把焦点返回给搜索框
		// zTree.selectNode(nodeList[clickCount], false)
	} else {
		var focus = clickCount - 2;
		// 让结果集里边的第一个获取焦点（主要为了设置背景色），再把焦点返回给搜索框
		zTree.selectNode(nodeList[focus], false);
		clickCount--;
		// alert("向上clickCount后==="+clickCount);
	}
	document.getElementById("key").focus();
	// 显示当前所在的是条数
	document.getElementById("number").innerHTML = "[" + clickCount + "/"
			+ nodeList.length + "]";
}
//点击向上按钮时，将焦点移向下一条数据
function clickDown() {
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	// 如果焦点已经移动到了最后一条数据上，则提示用户（或者返回第一条重新开始），否则继续移动到下一条
	if (nodeList.length == 0) {
		layer.alert("没有搜索结果！");
		return;
	} else if (nodeList.length == clickCount) {
		layer.alert("您已位于最后一条记录上！")
		return;
	} else {
		// 让结果集里边的第一个获取焦点（主要为了设置背景色），再把焦点返回给搜索框
		// alert("clickCount前==="+clickCount);
		zTree.selectNode(nodeList[clickCount], false)
		clickCount++;
		// alert("clickCount后==="+clickCount)
	}
	document.getElementById("key").focus();
	// 显示当前所在的条数
	document.getElementById("number").innerHTML = "[" + clickCount + "/"
			+ nodeList.length + "]";
}

