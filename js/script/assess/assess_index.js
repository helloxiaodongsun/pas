//考核对象类型
var objListMap = {};
var checkOrgId = '';
var lastState='';
//是否是生效的数据
var isValid='';
//菜单id
var mid = getUrlParam('mid');
var GFXYG_belongOrg,GFXYG_assObjId,GFXYG_assObjName,GFXYG_postList;
var checkKey = [];
var orgList;
$(function(){
	
	if(has2120||has2130||has2300||has2400){
		$("#btn_showApproveDetail").show();
		
		$("#btn_showApproveDetail").click(function(){
			showApproveModal.oTableInit();
			$("#showApproveModal").modal("show");
		});
	}
	
	$("#tjDate").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm",
		minView:3,
		startView:3,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
	$("#tjDate").val(new Date().Format("yyyy-MM"));
	
	initBelongOrgId();
//	$("#assObjTypeCd").html("").append($.param.getSelectOptionOrder("TB0006"));
//    $('#assObjTypeCd').selectpicker('refresh');
//    $("#assPropTypeCd").html("").append($.param.getSelectOptionOrder("TB0007"));
//    $('#assPropTypeCd').selectpicker('refresh');
	$('#state').change(function(){
		if($(this).val()=='02'){
			//审批通过    考核方案类型和考核对象类型不限制
			var oldValue = $('#assPropTypeCd').val();
			$('#assPropTypeCd').html("").append($.param.getSelectOptionOrder("TB0007"))
							.selectpicker('refresh').selectpicker('val',oldValue).change();
			initAuthOrgList();
		}else{
			initprop_obj_list();
			initBelongOrgId();
		}
	});
	if(has2120||has2130||has2300){
		//具有新增、修改、删除权限
		$("#btn_todo").show();
		$("#state").html("").append($.param.getSelectOptionOrder("TB0008"));
	}else{
		$("#state").html("").append("<option value='02'>审批通过</option>");
	}
    $('#state').selectpicker('refresh').selectpicker('val','02').change();
    
    $('#assPropTypeCd').change(function(){
    	if($('#state').val()=='02'){
    		//审批通过
    		changeProp($(this).val());
    	}else{
    		changeAuthProp($(this).val());
    	}
    });
    //新增按钮
    $("#btn_add").click(function(){
    	window.location.href=portal.bp() + '/assess/edit_1';
    });
    $("#btn_upd").click(function(){
    	var checklist = $('#datatable').bootstrapTable("getSelections");
    	if(checklist==null||checklist.length==0){
    		layer.msg('请选择',{icon:3});
    		return;
    	}
    	if(checklist.length>1){
    		layer.msg('只能选择一条数据',{icon:3});
    		return;
    	}
    	$.ajax({
            url: portal.bp() + '/assess/queryBasicInfoMgmt?r='+Math.random(),
            type: 'get',
            async: false,
            data:{'assPropNum':checklist[0].assPropNum},
            dataType: "json"
        }).done(function (data) {
            if (data.code == '200') {
            	if(data.data!=null&&data.data.opeType=='0'){
            		layer.msg("该考核方案的删除已在审批流程中，不可修改",{icon:2});
            	}else{
            		window.location.href=portal.bp() + '/assess/edit_1?assPropNum='+checklist[0].assPropNum+'&operateType=2&isValid='+isValid;
            	}
            }else{
            	layer.msg(data.message,{icon:2});
            }
        });
    	
    });
    $("#btn_del").click(function(){
    	var checklist = $('#datatable').bootstrapTable("getSelections");
    	if(checklist==null||checklist.length==0){
    		layer.msg('请选择',{icon:3});
    		return;
    	}
    	if(checklist.length>1){
    		layer.msg('只能选择一条数据',{icon:3});
    		return;
    	}
    	layer.confirm('您确定要删除该考核方案吗？', {
    		btn: ['确定','取消']
    		}, function(){
    			var index;
    			$.ajax({
    				url : portal.bp() + '/assess/delAssess',
    				dataType:'json',
    				cache:false,
    				data:{
    					'isValid':isValid,
    					'assPropNum':checklist[0].assPropNum,
    					},
    				type:'post',
    				success : function(data) {
    					if (data.code == "200") {
    						layer.msg("操作成功",{icon:1});
    						query();
    					}else {
    						layer.msg(data.message,{icon:2});
    					}
    				},
    				beforeSend:function(XMLHttpRequest){
    					index = layerLoad();
    				},
    				complete:function(XMLHttpRequest){
    					layerClose(index);
    				}
    			});
    		}, function(){
    		});
    });
    
    getGFXYG_belongOrgList();
    initPostList();
    
    $("#GFXYG_btn_export").click(function(){
    	var columns = $("#GFXYG_datatable").bootstrapTable('getOptions').columns;
    	var exportColumns = tableNeedCopy(columns);
    	var tableHeader = JSON.stringify(exportColumns);
    	$.ajax({
            url:portal.bp() + '/assess/showNotGFXYGExport',
            type: 'post',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            data: {
            	'belongOrg': GFXYG_belongOrg,
                'assObjId': GFXYG_assObjId,
                'assObjName': GFXYG_assObjName,
                'postList': GFXYG_postList,
                'empNums': checkKey,
                'tableHeader':tableHeader.substr(1,tableHeader.length-2)}
        }).done(
            function (res) {
                if(res.code == '200'){
                    var pathName = res.data;
                    //根据获得的excel名称，下载对应的excel
                    downloadByFileName(pathName);
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            }
        );
    });
    
    $("#btn_todo").click(function(){
    	var checklist = $('#datatable').bootstrapTable("getSelections");
    	if(checklist==null||checklist.length==0){
    		layer.msg('请选择',{icon:3});
    		return;
    	}
    	var assPropNums = [];
    	$.each(checklist,function(index,item){
    		assPropNums.push(item.assPropNum);
    	});
    	layer.confirm('您确定要提交选中的考核方案吗？', {
    		btn: ['确定','取消']
    		}, function(){
    			var index;
    			$.ajax({
    		        url : portal.bp() + '/assess/assessTodo?r='+Math.random(),
    		        type:'post',
    		        cache:false,
    		        dataType: "json",
    		        data:{'assPropNums':assPropNums},
    		        success : function(data) {
    		            if(data.code=='200'){
    		            	layer.msg('提交成功',{icon:1});
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
    		}, function(){
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
    
    query();
    
});
/**
 * 初始化机构列表
 */
function initBelongOrgId(){
	var html = "";
	$.ajax({
        url: portal.bp() + '/assess/belongorg?r='+Math.random(),
        type: 'get',
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	checkOrgId = data.data.checkOrgId;
        	orgList = [];
        	$.each(data.data.orgList,function(index,item){
        		orgList.push(item.orgId);
                html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
        	});
        	var oldValue = $('#belongOrg').val();
            if(oldValue==null||oldValue==''){
            	oldValue =  checkOrgId;
            }
            $('#belongOrg').html(html);
            $('#belongOrg').selectpicker('refresh')
            				.selectpicker('val',oldValue).change();
            var newValue = $('#belongOrg').val();
            if(newValue==null||newValue==''){
            	$('#belongOrg').selectpicker('val',checkOrgId).change();
            }
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function initAuthOrgList(){
	$.ajax({
        url: portal.bp() + '/org/findAuthValidOrg234',
        type: "get",
        data:{'menuId':mid},
        async: false,
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
            });
            var oldValue = $('#belongOrg').val();
            if(oldValue==null||oldValue==''){
            	oldValue =  checkOrgId;
            }
            $('#belongOrg').html(html);
            $('#belongOrg').selectpicker('refresh')
            				.selectpicker('val',oldValue).change();
            var newValue = $('#belongOrg').val();
            if(newValue==null||newValue==''){
            	$('#belongOrg').selectpicker('val',checkOrgId).change();
            }
        }
    });
}
function query(){
	TableObj.oTableInit();
}
function resetForm() {
    $('#formSearch')[0].reset();
    $('#belongOrg').selectpicker('refresh').selectpicker('val',checkOrgId).change();
    $('#assPropTypeCd').selectpicker('refresh');
    $('#assObjTypeCd').selectpicker('refresh');
    $('#state').selectpicker('refresh').selectpicker('val','02').change();
    $("#tjDate").val(new Date().Format("yyyy-MM"));
}
function showGFXYG(){
	$("#showGFXYG").modal("show");
	GFXYG_query();
}
function GFXYG_query(){
	TableObj_yg.oTableInit();
}
function GFXYG_resetForm(){
	$('#GFXYG_formSearch')[0].reset();
	$('#GFXYG_belongOrg').selectpicker('refresh');
	$('#GFXYG_postList').selectpicker('refresh');
}
//初始化未被纳入规范性考核员工信息的机构选择列表
function getGFXYG_belongOrgList() {
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
            $('#GFXYG_belongOrg').html(html);
            $('#GFXYG_belongOrg').selectpicker('refresh');
        }
    });
}

function initPostList(){
	var html = "";
	$.ajax({
        url: portal.bp() + '/assess/assess_post_list_auth?r='+Math.random(),
        type: 'get',
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var posts = data.data.postList;
        	$.each(posts,function(index,item){
        		html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
        	});
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
	$("#GFXYG_postList").html("").append(html);
    $('#GFXYG_postList').selectpicker('refresh');
}
//分页查询未被纳入规范性考核方案的员工列表	 
var TableObj_yg = {
    oTableInit: function () {
        var columns = [
        	  {
                  field: 'check',
                  checkbox: true
              },
                {
                    field: 'xuhao',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },  {
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
            ];
        $('#GFXYG_datatable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/assess/showNotGFXYG',
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
            	GFXYG_belongOrg = $('#GFXYG_belongOrg').val();
            	GFXYG_assObjId = $('#GFXYG_assObjId').val();
            	GFXYG_assObjName = $('#GFXYG_assObjName').val();
            	GFXYG_postList = $('#GFXYG_postList').val();
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'belongOrg': $('#GFXYG_belongOrg').val(),
                    'assObjId': $('#GFXYG_assObjId').val(),
                    'assObjName': $('#GFXYG_assObjName').val(),
                    'postList': $('#GFXYG_postList').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:290, //表格固定高度
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
            onCheck: function (row, $element) {

                var key = row.empNum;
                if (checkKey.indexOf(key) < 0) {
                    checkKey.push(key);
                }


            },
            onUncheck: function (row, $element) {

                var key = row.empNum;
                if (checkKey.indexOf(key) >= 0) {
                    checkKey.splice(checkKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].empNum;
                        if (checkKey.indexOf(key) < 0) {
                            checkKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].empNum;
                        if (checkKey.indexOf(key) >= 0) {
                            checkKey.splice(checkKey.indexOf(key), 1);
                        }
                    }
                }

            }
        });
    },
}
function initprop_obj_list(){
	var oldValue = $('#assPropTypeCd').val();
	$.ajax({
        url: portal.bp() + '/assess/obj_prop_post_list?r='+Math.random(),
        type: 'get',
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var html = "";
        	var propList = data.data.propList;
        	objListMap = data.data.objListMap;
        	$.each(propList,function(index,item){
        		html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
        	});
        	$("#assPropTypeCd").html(html);
            $('#assPropTypeCd').selectpicker('refresh')
            					.selectpicker('val',oldValue).change();
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function changeProp(prop){
	var oldValue = $("#assObjTypeCd").val();
	$.ajax({
        url: portal.bp() + '/assess/findAllByProp?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'prop':prop},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var html = "";
        	var propList = data.data;
        	$.each(propList,function(index,item){
        		html += '<option value="'+item.encode+'">'+item.name+'</option>';
        	});
        	$("#assObjTypeCd").html(html);
            $('#assObjTypeCd').selectpicker('refresh')
            				.selectpicker('val',oldValue).change();
            
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function changeAuthProp(prop){
	var oldValue = $("#assObjTypeCd").val();
	var list = eval('objListMap.val'+prop);
	var html = "";
	if(list!=undefined&&list!=null&&list.length>0){
		$.each(list,function(index,item){
			html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
		});
	}
	$("#assObjTypeCd").html(html);
	$('#assObjTypeCd').selectpicker('refresh');
	$('#assObjTypeCd').selectpicker('val',oldValue).change();
}

var TableObj = {
	    oTableInit: function () {
	        var columns = [
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
	                },  {
	                    field: 'belongOrg',
	                    title: '所属机构',
	                }, {
	                    field: 'assPropNum',
	                    title: '考核方案编号',
	                    //formatter: teamDetailLink
	                }, {
	                    field: 'assPropName',
	                    title: '考核方案名称',
	                }, {
	                    field: 'assPropTypeCd',
	                    title: '考核方案类型',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('TB0007', value);
	                    }
	                },
	                {
	                    field: 'assObjTypeCd',
	                    title: '考核对象类型',
	                    formatter: function (value, row, index) {
	                    	if($('#state').val()=='02'){
	                    		//审批通过
		                    	return '<a href="#" onclick="objDetailClick(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">'+$.param.getDisplay('TB0006', value)+'</a>';
	                    	}
	                    	return '<a href="#" onclick="objDetailClick(\''+row.assPropName+'\',\''+row.assPropNum+'\')">'+$.param.getDisplay('TB0006', value)+'</a>';
	                    }
	                },
	                {
	                    field: 'charCnfgFlg',
	                    title: '是否特色化配置',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('YESORNO', value);
	                    }
	                },
	                {
	                    field: '',
	                    title: '指标详情',
	                    formatter: function (value, row, index) {
	                    	if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                    		
	                    	}else{
	                    		if($('#state').val()=='02'){
	                    			//审批通过
	                    			return '<a href="#" onclick="showIndexDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">详情</a>';
	                    		}
	                    		return '<a href="#" onclick="showIndexDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\')">详情</a>';
	                    	}
	                    }
	                }
	                ,
	                {
	                    field: '',
	                    title: '指标分配详情',
	                    clickToSelect: false,
	                    formatter: function (value, row, index) {
	                    	if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                    		
	                    	}else{
	                    		if($('#state').val()=='02'){
	                    			//审批通过
	                    			return '<a href="#" onclick="showIndexFPDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">详情</a>';
	                    		}
	                    		return '<a href="#" onclick="showIndexFPDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\')">详情</a>';
	                    	}
	                    }
	                },
	                {
	                	field: '',
	                	title: '占比详情',
	                	clickToSelect: false,
	                	formatter: function (value, row, index) {
	                		if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                			if($('#state').val()=='02'){
	                				//审批通过
	                				return '<a href="#" onclick="showZHDFDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\''+row.pkId+'\',\'1\')">详情</a>';
	                			}
	                			return '<a href="#" onclick="showZHDFDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\''+row.pkId+'\')">详情</a>';
	                    	}else{
	                    		
	                    	}
	                	}
	                },
	                {
	                	field: 'state',
	                	title: '审批状态',
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
	                	field: 'effDt',
	                	title: '生效日期',
	                },
	                {
	                	field: 'invalidDt',
	                	title: '失效日期',
	                },
	            ];
	        $('#datatable').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/assess/queryAssessList',
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
	                    'belongOrg': $('#belongOrg').val(),
	                    'assPropNum': $('#assPropNum').val(),
	                    'assPropName': $('#assPropName').val(),
	                    'assPropTypeCd': $('#assPropTypeCd').val(),
	                    'assObjTypeCd': $('#assObjTypeCd').val(),
	                    'state': $('#state').val(),
	                    'tjDate': $('#tjDate').val(),
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 5,      //每页的记录行数（*）
	            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            //height:300, //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	lastState = $('#state').val();
	                	changeTodoBtn();
	                	if(orgList.indexOf($("#belongOrg").val())==-1){
	                		//不包含在可操作的机构中
	                		$("#btn_upd").attr('disabled','disabled');
	                		$("#btn_del").attr('disabled','disabled');
	                	}else{
	                		$("#btn_upd").removeAttr('disabled');
	                		$("#btn_del").removeAttr('disabled');
	                	}
	                	
	                	/*if(lastState=='01'){
	                		//审批中-不可提交审批、不可修改、不可删除
	                		$("#btn_todo").attr('disabled','disabled');
	                		$("#btn_upd").attr('disabled','disabled');
	                		$("#btn_del").attr('disabled','disabled');
	                		isValid='0';
	                	}else if(lastState=='02'){
	                		//审批通过-不可提交审批
	                		$("#btn_todo").attr('disabled','disabled');
	                		$("#btn_upd").removeAttr('disabled');
	                		$("#btn_del").removeAttr('disabled');
	                		isValid='1';
	                	}else if(lastState=='03'){
	                		//待提交审批
	                		$("#btn_todo").removeAttr('disabled');
	                		$("#btn_upd").removeAttr('disabled');
	                		$("#btn_del").removeAttr('disabled');
	                		isValid='0';
	                	}else{
	                		//审批拒绝
	                		$("#btn_todo").removeAttr('disabled');
	                		$("#btn_upd").removeAttr('disabled');
	                		$("#btn_del").removeAttr('disabled');
	                		isValid='0';
	                	}*/
	                	if(res.data.result==null) res.data.result=[];
	                	if(res.data.rows==null) res.data.rows=[];
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
	            columns: columns,
	            onLoadSuccess: function (data) {
	                $('#datatable').bootstrapTable('resetView',{
	                    height:getTableHeight(document)
	                    
	                });
	                resizeTables();
	            },
	        });
	    },
	};

/**
 * 改变按钮是否展示
 */
function changeTodoBtn(){
	$("#btn_todo").hide();
	if(has2300||has2120||has2130){
		if(lastState=='03'||lastState=='04'){
			$("#btn_todo").show();
		}
	}
	
	if(lastState=='01'){
		//审批中-不可提交审批、不可修改、不可删除
		$("#btn_upd").hide();
		$("#btn_del").hide();
		isValid='0';
	}else if(lastState=='02'){
		//审批通过-不可提交审批
		$("#btn_upd").show();
		$("#btn_del").show();
		isValid='1';
	}else if(lastState=='03'){
		//待提交审批
		$("#btn_upd").show();
		$("#btn_del").show();
		isValid='0';
	}else{
		//审批拒绝
		$("#btn_upd").show();
		$("#btn_del").show();
		isValid='0';
	}
}

//指标分配详情
function showIndexFPDetail(currentAssPropName,currentAssPropNum,flag){
	layer.open({
        type:2,
        title:currentAssPropName+'指标分配详情',
        shadeClose:true,
        shade:0.8,
        area:['800px','620px'],
        content:portal.bp() + '/assess/showIndexFPDetail?assPropNum='+currentAssPropNum+'&flag='+flag
    });
}
//指标详情
function showIndexDetail(currentAssPropName,currentAssPropNum,flag){
	layer.open({
		type:2,
		title:currentAssPropName+'指标详情',
		shadeClose:true,
		shade:0.8,
		area:['800px','620px'],
		content:portal.bp() + '/assess/showIndexDetail?assPropNum='+currentAssPropNum+'&flag='+flag
	});
}
//占比详情
function showZHDFDetail(currentAssPropName,currentAssPropNum,currentPkId,flag){
	layer.open({
		type:2,
		title:currentAssPropName+'占比详情',
		shadeClose:true,
		shade:0.8,
		area:['800px','620px'],
		content:portal.bp() + '/assess/showZHDFDetail?assPropNum='+currentAssPropNum+'&basicInfoId='+currentPkId+'&flag='+flag
	});
}

//添加团队详情
function objDetailClick(currentAssPropName,currentAssPropNum,flag) {
	layer.open({
        type:2,
        title:currentAssPropName+'考核对象详情',
        shadeClose:true,
        shade:0.8,
        area:['800px','620px'],
        content:portal.bp() + '/assess/showObjDetail?assPropNum='+currentAssPropNum+'&flag='+flag
    });
};



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
	                },  {
	                    field: 'belongOrg',
	                    title: '所属机构',
	                }, {
	                    field: 'assPropNum',
	                    title: '考核方案编号',
	                    //formatter: teamDetailLink
	                }, {
	                    field: 'assPropName',
	                    title: '考核方案名称',
	                }, {
	                    field: 'assPropTypeCd',
	                    title: '考核方案类型',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('TB0007', value);
	                    }
	                },
	                {
	                    field: 'assObjTypeCd',
	                    title: '考核对象类型',
	                    formatter: function (value, row, index) {
	                    	if($('#state').val()=='02'){
	                    		//审批通过
		                    	return '<a href="#" onclick="objDetailClick(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">'+$.param.getDisplay('TB0006', value)+'</a>';
	                    	}
	                    	return '<a href="#" onclick="objDetailClick(\''+row.assPropName+'\',\''+row.assPropNum+'\')">'+$.param.getDisplay('TB0006', value)+'</a>';
	                    }
	                },
	                {
	                    field: 'charCnfgFlg',
	                    title: '是否特色化配置',
	                    formatter: function (value, row, index) {
	                        return $.param.getDisplay('YESORNO', value);
	                    }
	                },
	                {
	                    field: '',
	                    title: '指标详情',
	                    formatter: function (value, row, index) {
	                    	if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                    		
	                    	}else{
	                    		return '<a href="#" onclick="showIndexDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\')">详情</a>';
	                    	}
	                    }
	                }
	                ,
	                {
	                    field: '',
	                    title: '指标分配详情',
	                    clickToSelect: false,
	                    formatter: function (value, row, index) {
	                    	if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                    		
	                    	}else{
	                    		/*if($('#state').val()=='02'){
	                    		//审批通过
		                    	return '<a href="#" onclick="showIndexFPDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">详情</a>';
	                    		}*/
	                    		return '<a href="#" onclick="showIndexFPDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\')">详情</a>';
	                    	}
	                    }
	                },
	                {
	                	field: '',
	                	title: '占比详情',
	                	clickToSelect: false,
	                	formatter: function (value, row, index) {
	                		if(row.iszhdf!=undefined&&row.iszhdf!=null&&row.iszhdf=='1'){
	                			/*if($('#state').val()=='02'){
	                				//审批通过
	                				return '<a href="#" onclick="showZHDFDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\'1\')">详情</a>';
	                			}*/
	                			return '<a href="#" onclick="showZHDFDetail(\''+row.assPropName+'\',\''+row.assPropNum+'\',\''+row.pkId+'\')">详情</a>';
	                    	}else{
	                    		
	                    	}
	                	}
	                },
	                {
	                	field: 'effDt',
	                	title: '生效日期',
	                },
	                {
	                	field: 'invalidDt',
	                	title: '失效日期',
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
	                				if(row.validTag=='0'){
	                					res = '已删除';
	                				}
	                			}else if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='2'){
	                				//已撤回
	                				res = '已撤回';
	                				if(row.validTag=='0'){
	                					res = '已删除';
	                				}
	                			}else{
	                				if(row.validTag=='0'){
	                					res = '已删除';
	                				}
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
	                		if(row.validTag=='1'){
	                			if(row.isInitPersion=='1'){
	                				//是任务发起人、有效
	                				if((row.opeType=='1'||row.opeType=='2')&&row.startEndFlag=='1'){
	                					//新增或修改、审批流程到第一节点
	                					html += '<span class="oper-mid" ></span><a id="btn_sp_edit" onclick="assessEdit(\''+row.assPropNum+'\');" class="oper-left" ><b>编辑</b></a>';
	                				}
	                				if(row.startEndFlag=='1'){
	                					//开始节点，可删除
	                					html += '<span class="oper-mid" ></span><a id="btn_sp_del" onclick="assessDel(\''+row.assPropNum+'\');" class="oper-left" ><b>删除</b></a>';
	                				}
	                				if(row.initpersionisgoback=='1'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
	                					//非结束节点、任务发起人，可撤回
	                					html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="assessworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
	                				}
	                			}else{
	                				if(row.initpersionisgoback=='0'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
	                					//非结束节点
	                					if(row.isProcerPersion=='1'&&row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='1'){
	                						//是最新处理人、到达该节点是通过，可撤回
	                						html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="assessworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
	                					}
	                				}
	                			}
	                		}
	                		return html;
	                		
	                	}
	                },
	                
	            ];
	        $('#approvetable').bootstrapTable("destroy");
	        $('#approvetable').bootstrapTable({
	            url: portal.bp() + '/assess/workflow/mypageList',
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
	                	if(res.data.result==null) res.data.result=[];
	                	if(res.data.rows==null) res.data.rows=[];
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
function assessDel(currentAssessPropNum){
	layer.confirm('您确定要删除该考核方案吗？', {
		btn: ['确定','取消']
		}, function(){
			var index;
			$.ajax({
				url : portal.bp() + '/assess/delAssess',
				dataType:'json',
				cache:false,
				data:{
					'assPropNum':currentAssessPropNum,
					},
				type:'post',
				success : function(data) {
					if (data.code == "200") {
						layer.msg("操作成功",{icon:1});
						query();
						showApproveModal.oTableInit();
					}else {
						layer.msg(data.message,{icon:2});
					}
				},
				beforeSend:function(XMLHttpRequest){
					index = layerLoad();
				},
				complete:function(XMLHttpRequest){
					layerClose(index);
				}
			});
		}, function(){
		});
}
function assessEdit(currentAssessPropNum){
	$.ajax({
        url: portal.bp() + '/assess/queryBasicInfoMgmt?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'assPropNum':currentAssessPropNum},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	if(data.data!=null&&data.data.opeType=='0'){
        		layer.msg("该考核方案的删除已在审批流程中，不可修改",{icon:2});
        	}else{
        		window.location.href=portal.bp() + '/assess/edit_1?assPropNum='+currentAssessPropNum+'&operateType=2';
        	}
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function assessworkflowGoback(pkId){
	if(workflowGoback(pkId)){
		query();
		showApproveModal.oTableInit();
	}
}