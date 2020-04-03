var authLines;
var authLineCode=[];
//菜单id
var mid = getUrlParam('mid');
var type = 'post'; //ajax类型
var filedNameArray = ['pkId','check','number','empId','empName','belongPostCdDesc','belongOrgDesc','belongLineDesc','status','dealComntDesc','ope'];
var resultSearch = '';
$(function () {
	if(has4211||has4212||has4213||has4220){
		$("#btn_showApproveDetail").show();
		
		$("#btn_showApproveDetail").click(function(){
			showApproveModal.oTableInit();
			$("#showApproveModal").modal("show");
		});
	}
	if(hasToAddRolePermiss||has4230){
		$("#btn_showEmpRoleApproveDetail").show();
		
		$("#btn_showEmpRoleApproveDetail").click(function(){
			showEmpRoleApproveModal.oTableInit();
			$("#showApproveModal").modal("show");
		});
	}
	
    var addRoleEmpNum = null;//权限分配的用户
    //获取机构列表
	getOrgList();
    //获取岗位列表
    $("#belongPostCd").html("").append($.param.getSelectOptionOrder("POST"));
    $('#belongPostCd').selectpicker('refresh');
//    $("#add_belongPostCd").html("").append($.param.getSelectOptionOrder("POST"));
//    $('#add_belongPostCd').selectpicker('refresh');
    //获取条线列表
    $("#belongLine").html("").append($.param.getSelectOptionOrder("LINE"));
    $('#belongLine').selectpicker('refresh');
    authLines = getAuthLine();
    if(authLines!=null&&authLines.length>0){
    	$.each(authLines, function (index, item) {
    		authLineCode.push(item.ENCODE);
    	});
    }
    $("#add_belongLine").html("").append($.param.getSelectOptionOrder("LINE"));
    $('#add_belongLine').prop('disabled', true);
    $('#add_belongLine').selectpicker('refresh');

    //数据显示列表
    TableObj.oTableInit();


    //表单校验
    addModalValidator();

    //Modal验证销毁重构
    $('#add_Modal').on('hidden.bs.modal', function () {
        $("#add_Modal_Form").data('bootstrapValidator').destroy();
        $('#add_Modal_Form').data('bootstrapValidator', null);
        addModalValidator();
        
        //重置表单
        $("#add_Modal_Form")[0].reset();
        $('input,textarea').placeholder();
        $('#add_belongPostCd').selectpicker('refresh');
        $('#add_belongLine').selectpicker('refresh');
        $('#add_belongOrgId').selectpicker('refresh');
    });

    //新增按钮
    $("#btn_add").click(function () {
        $("#add_empNum").removeAttr("readonly");
//        $("#add_empName").removeAttr("readonly");
        $("#myModalLabel").text("新增");
        type = 'post';
        $("#add_Modal").modal("show");

    });

    //修改按钮
    $("#btn_upd").click(function () {
        var checklist = $('#usertable').bootstrapTable('getSelections');
        if (checklist.length > 1) {
            layer.msg("只能选择一个员工", {icon: 3});
        } else if (checklist.length == 0) {
            layer.msg("请选择员工", {icon: 3});
        } else {
            //赋值
            $("#add_empNum").val(checklist[0].empNum);
            $("#add_empNum").attr("readonly", "readonly");
            $("#add_empName").val(checklist[0].empName);
//            $("#add_empName").attr("readonly", "readonly");
            $('#add_belongOrgId').selectpicker('val', checklist[0].belongOrgId).change();
            $('#add_belongPostCd').selectpicker('val', checklist[0].belongPostCd);
            $('#add_belongLine').selectpicker('val', checklist[0].belongLine);
            $("#myModalLabel").text("修改");
            type = 'put';
            $("#add_Modal").modal("show");
        }
    });
    //删除按钮
    $("#btn_del").click(function () {
        var checklist = $('#usertable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择员工", {icon: 3});
        } else {
            var text = "确定删除选中的" + checklist.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var empNumList = [];
                $.each(checklist, function (index, item) {
                    empNumList.push(item.empNum);
                });

                var data = {
                    "empNumList": empNumList
                };
                var index;
                $.ajax({
                    url: portal.bp() + '/user/todo_del',
                    type: 'get',
                    async: true,
                    cache: false,
                    data: data,
                    dataType: "json",
                    success: function (o) {
                        var code = o.code;
                        if (code == 200) {
                            layer.msg("提交成功", {icon: 1});
                            query();
                        } else {
                            layer.msg(o.message, {icon: 2});
                        }
                    },
        			beforeSend:function(XMLHttpRequest){
        				index = layerLoad();
        			},
        			complete:function(XMLHttpRequest){
        				layerClose(index);
        			}
                });
            }, function () {

            });
        }

    });

    //提交审核按钮
    $("#todobtn").click(function () {
        //表单校验
        var bootstrapValidator = $("#add_Modal_Form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid())
            return;

        var data = {
            "empNum": $("#add_empNum").val(),
            "empName": $("#add_empName").val(),
            "belongOrgId": $("#add_belongOrgId").val(),
            "belongPostCd": $("#add_belongPostCd").val(),
            "belongLine": $("#add_belongLine").val(),
            "belongOrgId": $("#add_belongOrgId").val()
        }
        var index;
        $.ajax({
            url: portal.bp() + '/user/todo',
            type: type,
            async: true,
            cache: false,
            data: data,
            dataType: "json",
            success: function (o) {
                var code = o.code;
                if (code == 200) {
                    $("#add_Modal").modal("hide");
                    layer.msg("提交成功", {icon: 1});
                    query();
                    showApproveModal.oTableInit();
                } else {
                    layer.msg(o.message, {icon: 2});
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

    $("#add_belongOrgId").on('changed.bs.select',function(e){
    	getAuthPost($(this).val());
    });
    $("#add_belongPostCd").on('changed.bs.select',function(e){
    	var orgId = $("#add_belongOrgId").val();
    	getLineByOrgIdAndPostId(orgId,$(this).val());
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
function userworkflowGoback(pkId){
	if(workflowGoback(pkId)){
		showApproveModal.oTableInit();
	}
}
function editMgmt(empNum,empName,belongOrgId,belongPostCd,belongLine){
	//赋值
    $("#add_empNum").val(empNum);
    $("#add_empNum").attr("readonly", "readonly");
    $("#add_empName").val(empName);
    $('#add_belongOrgId').selectpicker('val', belongOrgId).change();
    $('#add_belongPostCd').selectpicker('val', belongPostCd);
    $('#add_belongLine').selectpicker('val', belongLine);
    $("#myModalLabel").text("修改");
    type = 'put';
    $("#add_Modal").modal("show");
}
function delMgmt(pkId){
	$.ajax({
        url: portal.bp() + '/user/workflow/del?r='+Math.random(),
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
//审批详情列表
var showApproveModal = {
	    oTableInit: function () {
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
		                field: 'empNum',
		                title: '员工工号',
		            }, {
		                field: 'empName',
		                title: '员工名称',
		            }, {
		                field: 'belongPostDesc',
		                title: '所属岗位',
		            }, {
		                field: 'belongOrgDesc',
		                title: '所属机构',
		            },
		            {
		                field: 'belongLineDesc',
		                title: '所属条线',
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
	                			if(row.roleName!=undefined&&row.roleName!=null){
	                				res = '待'+row.roleName+'审批';
	                			}else{
	                				res = '待审批';
	                			}
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
	                		var html = '';
	                		if(row.isInitPersion=='1'&&row.validTag=='1'){
	                			//是任务发起人、有效
	                			if((row.opeType=='1'||row.opeType=='2')&&row.startEndFlag=='1'){
	                				//新增或修改、审批流程到第一节点
	                				html += '<span class="oper-mid" ></span><a id="btn_sp_edit" onclick="editMgmt(\''+row.empNum+'\',\''+row.empName+'\',\''+row.belongOrgId+'\',\''+row.belongPostCd+'\',\''+row.belongLine+'\');" class="oper-left" ><b>编辑</b></a>';
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
	            url: portal.bp() + '/user/workflow/mypageList',
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
function emproleWorkflowGoback(pkId){
	if(workflowGoback(pkId)){
		showEmpRoleApproveModal.oTableInit();
	}
}
function emproleDelMgmt(pkId){
	$.ajax({
        url: portal.bp() + '/user/emprole/workflow/del?r='+Math.random(),
        type: 'POST',
        async: false,
        data:{"pkIdList": [pkId]},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	layer.msg("操作成功",{icon:1});
        	showEmpRoleApproveModal.oTableInit();
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function emproleEditMgmt(empNum){
	showDoubleBox(empNum);
}
var showEmpRoleApproveModal = {
		oTableInit: function () {
			var columns = [];
			columns = [
			           {
			                field: 'check',
			                checkbox: true
			            },
			            {
			                field: 'number',
			                title: '序号',
			                align: 'center',
			            }, {
			                field: 'empId',
			                title: '员工工号',
			            }, {
			                field: 'empName',
			                title: '员工名称',
			            }, {
			                field: 'belongPostCdDesc',
			                title: '所属岗位',
			            }, {
			                field: 'belongOrgDesc',
			                title: '所属机构',
			            },
			            {
			                field: 'belongLineDesc',
			                title: '所属条线',
			            },
			           {
			        	   field: 'status',
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
			        			   if(row.sproleName!=undefined&&row.sproleName!=null){
			        				   res = '待'+row.sproleName+'审批';
			        			   }else{
			        				   res = '待审批';
			        			   }
			        		   }
			        		   return res;
			        	   }
			           },
			           {
			        	   field: 'dealComntDesc',
			        	   title: '备注',
			        	   formatter: function (value, row, index) {
			        		   if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='0'){
			        			   return row.dealComntDesc;
			        		   }
			        	   }
			           },
			           {
			        	   field: 'ope',
			        	   title: '操作',
			        	   formatter: function (value, row, index) {
			        		   var html = '';
			        		   if(row.isInitPersion=='1'&&row.validTag=='1'){
			        			   //是任务发起人、有效
			        			   if((row.opeType=='1'||row.opeType=='2')&&row.startEndFlag=='1'){
			        				   //新增或修改、审批流程到第一节点
			        				   html += '<span class="oper-mid" ></span><a id="btn_emprole_sp_edit" onclick="emproleEditMgmt(\''+row.empId+'\');" class="oper-left" ><b>编辑</b></a>';
			        			   }
			        			   if(row.startEndFlag=='1'){
			        				   //开始节点，可删除
			        				   html += '<span class="oper-mid" ></span><a id="btn_emprole_sp_del" onclick="emproleDelMgmt(\''+row.pkId+'\');" class="oper-left" ><b>删除</b></a>';
			        			   }
			        			   if(row.initpersionisgoback=='1'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
			        				   //非结束节点、任务发起人，可撤回
			        				   html += '<span class="oper-mid" ></span><a id="btn_emprole_sp_goback" onclick="emproleWorkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
			        			   }
			        		   }
			        		   if(row.initpersionisgoback=='0'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
			        			   //非结束节点
			        			   if(row.isProcerPersion=='1'&&row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='1'){
			        				   //是最新处理人、到达该节点是通过，可撤回
			        				   html += '<span class="oper-mid" ></span><a id="btn_emprole_sp_goback" onclick="emproleWorkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
			        			   }
			        		   }
			        		   return html;
			        		   
			        	   }
			           },
			           {
			        	   field: 'roleName',
			        	   title: '角色名称',
			        	   formatter:function(value,row,index){
			            		return '<a id="btn_role_show_permission" onclick="role_show_permisstion(\''+row.roleId +'\',\''+row.empId+'\');" class="oper-left" ><b>'+row.roleName+'</b></a>';
			            	}
			           },
			           
			           ];
			$('#approvetable').bootstrapTable("destroy");
			$('#approvetable').bootstrapTable({
				url: portal.bp() + '/user/emprole/workflow/mypageList',
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
						resultSearch = res.data.sameArray;
	                    return res.data.pageFinder;
					} else {
						layer.msg(res.message, {icon: 2});
						return {};
					}
				},
				//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
				columns: columns,
				rowStyle: rowStyle,
	            onLoadSuccess: function (data) {
	                mergeCell(data.rows, 'key', 1, '#approvetable', resultSearch);
	                resizeTables();
	            },
			});
		}
};
//分页查询用户列表	 
var TableObj = {
    oTableInit: function () {
        var columns = [];
        //操作列是否展示
        if (hasToAddRolePermiss || hasTodoPermiss) {
            columns = [
                {
                     field: 'check',
                     checkbox: true,
                },
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'empNum',
                    title: '员工工号',
                }, {
                    field: 'empName',
                    title: '员工名称',
                }, {
                    field: 'belongPostDesc',
                    title: '所属岗位',
                }, {
                    field: 'belongOrgDesc',
                    title: '所属机构',
                },
                {
                    field: 'belongLineDesc',
                    title: '所属条线',
                },
                {
                    field: 'Button',
                    title: '操作',
                    events: operateEvents,
                    formatter: AddFunctionAlty,
                },
            ]
        } else {
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
                    field: 'empNum',
                    title: '员工工号',
                }, {
                    field: 'empName',
                    title: '员工名称',
                }, {
                    field: 'belongPostDesc',
                    title: '所属岗位',
                }, {
                    field: 'belongOrgDesc',
                    title: '所属机构',
                },
                {
                    field: 'belongLineDesc',
                    title: '所属条线',
                },
            ]
        }
        $('#usertable').bootstrapTable({
            url: portal.bp() + '/user/pageList',
            method: 'post',      //请求方式（*）
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
                    'empNum': $('#empNum').val(),
                    'empName': $('#empName').val(),
                    'belongPostCd': $('#belongPostCd').val(),
                    'belongOrgId': $('#belongOrgId').val(),
                    'belongLine': $('#belongLine').val()
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25,50,100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:500, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onCheckAll:function(rows){
            	changeCheckBox();
            },
            onUncheckAll:function(rows){
            	changeCheckBox();
            },
            onClickRow:function(row,tr,filed){
            	changeCheckBox();
            },
            onCheck:function(row){
            	changeCheckBox();
            },
            onUncheck:function(row){
            	changeCheckBox();
            },
            onLoadSuccess: function (data) {
            	$('#usertable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                resizeTables();
            },
        });
    }
};
function changeCheckBox(){
	var checklist = $('#usertable').bootstrapTable('getSelections');
    if(checklist.length==0){
    	$("#btn_upd").removeAttr("disabled");
    	$("#btn_del").removeAttr("disabled");
    }else{
    	var flag = true;
    	$.each(checklist,function(index,item){
    		if(item.belongLine!=null&&item.belongLine!=''&&authLineCode.indexOf(item.belongLine)==-1){
    			flag = false;
    			$("#btn_upd").attr("disabled","disabled");
    			$("#btn_del").attr("disabled","disabled");
    			return false;
    		}
    	});
    	if(flag) {
    		$("#btn_upd").removeAttr("disabled");
    		$("#btn_del").removeAttr("disabled");
    	}
    }
}
//添加分配角色按钮
function AddFunctionAlty(value, row, index) {
    var html = '';
    if (row.opeType != undefined) {
        if (row.opeType == '0') {
            if (hasToAddRolePermiss) {
                html += '<a id="toAddRole" class="oper-left" ><b>权限分配</b></a>';
            }
            if (hasTodoPermiss) {
                html += '<span class="oper-mid" >|</span><a id="tododel_btn" class="oper-right"  ><b>删除中</b><a/>';
            }
        } else if (row.opeType == '2') {
            if (hasToAddRolePermiss) {
                html += '<a id="toAddRole" class="oper-left"  ><b>权限分配</b></a>';
            }
            if (hasTodoPermiss) {
                html += '<span class="oper-mid" >|</span><a id="todoupdate_btn" class="oper-right"  ><b>修改中</b></a>';
            }
        }else if (row.opeType == '3') {
            if (hasToAddRolePermiss) {
                html += '<a id="toAddRole" class="oper-left"  ><b>权限分配</b></a>';
            }
            if (hasTodoPermiss) {
                html += '<span class="oper-mid" >|</span><a id="todoupdate_btn" class="oper-right"  ><b>跨管辖行机构变更</b></a>';
            }
        } else if (row.opeType == '1') {//新增
            if (hasTodoPermiss) {
                html += '<a id="todoadd_btn" class="oper-right" ><b>新增中</b></a>';
            }
        }
    } else {
        if (hasToAddRolePermiss) {
            html += '<a id="toAddRole" class="oper-left" ><b>权限分配</b></a>';
        }
    }
    return html;
};
var selectedList;
function showDoubleBox(empNum){
    addRoleEmpNum = empNum;
    var nonSelectedList;
    $.ajax({
        url: portal.bp() + '/user/getRolesByEmpNum',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {'empNum': empNum},
        cache: false,
        success: function (data) {
            selectedList = data.data.selectedRoles; //由于返回本来就是Json对象无需进行转换
            nonSelectedList = data.data.noselectedRoles;
        }
    });
    //重置角色选择列表
    $('.ue-container').empty();
    $(".ue-container").append("<select style='height: 100%' multiple='multiple' size='10' name='doublebox' class='demo'> </select>");
    var doubleboxdemo = $('.demo').doublebox({
        nonSelectedListLabel: '选择角色',
        selectedListLabel: '授权用户角色',
        filterPlaceHolder: '搜索',
        moveSelectedLabel: '选择',
        moveAllLabel: '全部选择',
        removeSelectedLabel: '移除',
        removeAllLabel: '全部移除',
        selectorMinimalHeight: 180,
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
        nonSelectedList: nonSelectedList,
        selectedList: selectedList,
        optionValue: "roleId",
        optionText: "roleName",
        optionTilte: "roleName",
        doubleMove: true,
    });
    $(".bootstrap-duallistbox-container").css("margin-right", "0px").css("margin-left", "0px");
    $(".settingUp-btns").css("display", "none");
    //显示分配角色面板
    $("#setRole").modal("show");

}
//按钮“分配角色”
window.operateEvents = {
    "click #toAddRole": function (e, value, row, index) {
    	showDoubleBox(row.empNum);
    },

    "click #tododel_btn,#todoupdate_btn,#todoadd_btn": function (e, value, row, index) {
        $.ajax({
            url: portal.bp() + '/user/getUserTodoShow',
            type: "get",
            async: false, // 同步 为全局变量赋值
            data: {'empNum': row.empNum},
            cache: false,
            success: function (data) {
                if (data.code == '200') {
                    $("#show_empNum").val(data.data.empNum);
                    $("#show_empName").val(data.data.empName);
                    $("#show_belongOrgId").val(data.data.belongOrgId);
                    $("#show_belongPostCd").val($.param.getDisplay('POST', data.data.belongPostCd));
                    $("#show_belongLine").val($.param.getDisplay('LINE', data.data.belongLine));
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            }
        });
        $("#todoModal").modal("show");
    }
};


//保存用户角色
function saveRolesSub() {
	var oldSelectRoles = [];
	$.each(selectedList,function(index,item){
		oldSelectRoles.push(item.roleId);
	})
	var addRoles = [];
	var delRoles = [];
    var roles = [];
    $("#bootstrap-duallistbox-selected-list_doublebox option").each(function () {
        //遍历所有option
        var role = $(this).val();
        roles.push(role);
    });
    $.each(oldSelectRoles,function(index,olditem){
    	if(roles.indexOf(olditem)==-1){
    		delRoles.push(olditem);
    	}
    });
    $.each(roles,function(index,newitem){
    	if(oldSelectRoles.indexOf(newitem)==-1){
    		addRoles.push(newitem);
    	}
    });
    if(delRoles.length==0&&addRoles==0){
    	layer.msg("没有修改，不需保存",{icon:3});
    	return;
    }
    if(delRoles.length==0){
    	delRoles.push("isNull");
    }
    if(addRoles.length==0){
    	addRoles.push("isNull");
    }
    
    var data = {'addRoles[]': addRoles,'delRoles[]':delRoles, 'empNum': addRoleEmpNum};
    var index;
    $.ajax({
        url: portal.bp() + '/user/saveUserRoles',
        type: "post",
        async: false, // 同步 为全局变量赋值
        data: data,
        cache: false,
        success: function (data) {
            if (data.code == "200") {
                layer.msg("提交成功！", {icon: 1});
                query();
                showEmpRoleApproveModal.oTableInit();
                //隐藏分配角色面板
                $("#setRole").modal("hide");
            } else {
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
}

//查询
function query() {
    $('#usertable').bootstrapTable('destroy');
    TableObj.oTableInit();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder();
    $('#belongPostCd').selectpicker('refresh');
    $('#belongOrgId').selectpicker('refresh');
    $('#belongLine').selectpicker('refresh');
}

function addModalValidator() {
    //表单校验
    $("#add_Modal_Form").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            add_empNum: {
                validators: {
                    notEmpty: {
                        message: "员工工号不能为空"
                    },
                    stringLength: {
                        max: 30,
                        message: "员工工号不能超过30个字"
                    }
                }
            },
            add_empName: {
                validators: {
                    notEmpty: {
                        message: "员工姓名不能为空"
                    },
                    stringLength: {
                        max: 30,
                        message: "员工姓名不能超过30个字"
                    }
                }
            },
            add_belongOrgId:{
                validators:{
                    notEmpty:{
                        message:"所属机构不能为空"
                    }
                }
            },
            add_belongPostCd: {
                validators: {
                    notEmpty: {
                        message: "所属岗位不能为空"
                    }
                }
            },
        }
    });
}

//初始化机构选择列表
function getOrgList() {
    $.ajax({
        url: portal.bp() + '/org/getAuthOrgForGroup',
        type: "get",
        data:{'menuId':mid},
        cache: false,
        success: function (data) {
            var html;
            var list = data.data;
            $.each(list,function(key,value){
                html += '<optgroup label="'+key+'">';
                $.each(value,function(index,item){
                    html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                })
                html += '</optgroup>';
            })
            $('#add_belongOrgId').html(html);
            $('#add_belongOrgId').selectpicker('refresh');
            $('#belongOrgId').html(html);
            $('#belongOrgId').selectpicker('refresh');
        }
    });
}
function getAuthPost(orgId){
	$.ajax({
        url: portal.bp() + '/user/getAuthPost',
        type: "get",
        async:false,
        data:{'orgId':orgId},
        cache: false,
        success: function (data) {
            var html;
            var list = data.data;
            $.each(list,function(index,item){
        		html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
        	});
            $('#add_belongPostCd').empty().html(html);
            $('#add_belongPostCd').selectpicker('refresh');
        }
    });
}
function getLineByOrgIdAndPostId(orgId,postId){
	$.ajax({
        url: portal.bp() + '/user/getLineByOrgIdAndPostId',
        type: "get",
        data:{'orgId':orgId,'postId':postId},
        cache: false,
        success: function (data) {
            var res = data.data;
            $('#add_belongLine').selectpicker('val',res);
        }
    });
}

function mergeCell(data, fieldName, colspan, target, numArr) {

    if (data.length == 0) {
        return;
    }

    if (data.length == 1 || numArr == undefined) {

        return;
    }


    /*numArr = [];
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
    if (num > 1) {
        numArr.push(num);
    }*/

    //var merIndex = 0;
    /*for (var i = 0; i <= numArr.length; i++) {

        if (merIndex >= data.length) {
            break;
        }
        $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        merIndex += numArr[i];
    }*/
    var merIndex = 0;
    //var numArr = JSON.parse(sameIndex);
    for (var i = 0; i < numArr.length; i++) {
        /*if (merIndex < data.length) {
            $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        }*/
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