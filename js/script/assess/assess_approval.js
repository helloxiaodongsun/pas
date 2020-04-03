$(function () {
	//数据显示列表
    TableObj.oTableInit();
    
    //Modal验证销毁重构
    $('#rejectModel').on('hidden.bs.modal', function () {
        $("#rejectModel_Form").data('bootstrapValidator').destroy();
        $('#rejectModel_Form').data('bootstrapValidator', null);
        //重置表单
        $("#rejectModel_Form")[0].reset();
        //防止IE8没有placleholder
        $('input,textarea').placeholder();
    });
    
    $("#btn_pass").click(function(){
    	var checklist = $('#usertable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择", {icon: 3});
        } else {
            var text = "确定通过选中的" + checklist.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var pkIdList = [];
                $.each(checklist, function (index, item) {
                	pkIdList.push(item.pkId);
                });

                var data = {
                    "pkIdList": pkIdList
                };
                var index;
                $.ajax({
                    url: portal.bp() + '/assess/workflowPass',
                    type: 'get',
                    async: true,
                    cache: false,
                    data: data,
                    dataType: "json",
                    success: function (o) {
                        var code = o.code;
                        if (code == 200) {
                            layer.msg("提交成功", {icon: 1});
                            TableObj.oTableInit();
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
    $("#btn_reject").click(function(){
    	var checklist = $('#usertable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择员工", {icon: 3});
        } else {
        	$("#rejectModel").modal("show");
        	addModalValidator();
        }
    });
    $("#toReject").click(function(){
    	//表单校验
        var bootstrapValidator = $("#rejectModel_Form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid())
            return;
        
        var checklist = $('#usertable').bootstrapTable('getSelections');
        var pkIdList = [];
        $.each(checklist, function (index, item) {
        	pkIdList.push(item.pkId);
        });

        var data = {
            "pkIdList": pkIdList,
            "rejectDesc":$("#rejectDesc").val()
        };
        var index;
        $.ajax({
            url: portal.bp() + '/assess/workflowReject',
            type: 'get',
            async: true,
            cache: false,
            data: data,
            dataType: "json",
            success: function (o) {
                var code = o.code;
                if (code == 200) {
                    layer.msg("提交成功", {icon: 1});
                    $("#rejectModel").modal("hide");
                    TableObj.oTableInit();
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
    
    $("#btn_refresh").click(function(){
    	$('#usertable').bootstrapTable('refresh');
    });
    
    $("#show_history").click(function(){
    	var checklist = $('#usertable').bootstrapTable('getSelections');
    	if(checklist==null||checklist.length!=1){
    		layer.msg('请选择一条数据',{icon:3});
    		return;
    	}
    	showWorkFlowHistory(checklist[0].pkId);
    });
});
//分页查询用户列表	 
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
            {
            	field: 'mdfrId',
            	title: '提交人',
            },
            {
            	field: 'modifTm',
            	title: '提交时间',
            	formatter:function(value,row,index){
            		if(value!=undefined&&value!=null&&value!=""){
            			return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
            		}
            	}
            },
            {
            	field: 'opeType',
            	title: '操作类型',
            },
        ];
        $('#usertable').bootstrapTable('destroy');
        $('#usertable').bootstrapTable({
            url: portal.bp() + '/assess/workflowPageList',
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
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:600, //表格固定高度
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
            }
        });
    }
};
function changeCheckBox(){
	var checklist = $('#usertable').bootstrapTable('getSelections');
    if(checklist.length==0){
    	$("#btn_reject").removeAttr("disabled");
    }else{
    	var flag = true;
    	$.each(checklist,function(index,item){
    		if(item.startEndFlag==='1'){
    			flag = false;
    			$("#btn_reject").attr("disabled","disabled");
    			return false;
    		}
    	});
    	if(flag) $("#btn_reject").removeAttr("disabled");
    }
}
function addModalValidator() {
    //表单校验
    $("#rejectModel_Form").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	rejectDesc: {
                validators: {
                    notEmpty: {
                        message: "拒绝原因不能为空"
                    },
                    stringLength: {
                        max: 1000,
                        message: "拒绝原因不能超过1000个字"
                    }
                }
            },
        }
    });
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