var filedNameArray = ['pkId','check','number','empId','empName','belongPostCdDesc','belongOrgDesc','belongLineDesc','mdfrId','modifTm'];
var resultSearch = '';
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
                    url: portal.bp() + '/user/emprole/workflowPass',
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
            layer.msg("请选择", {icon: 3});
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
            url: portal.bp() + '/user/emprole/workflowReject',
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
        var columns = [];
        //操作列是否展示
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
            {
            	field: 'roleName',
            	title: '角色名称',
            	formatter:function(value,row,index){
            		return '<a id="btn_role_show_permission" onclick="role_show_permisstion(\''+row.roleId +'\',\''+row.empId+'\');" class="oper-left" ><b>'+row.roleName+'</b></a>';
            	}
            },
        ]
        $('#usertable').bootstrapTable('destroy');
        $('#usertable').bootstrapTable({
            url: portal.bp() + '/user/emprole/workflowPageList',
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
                mergeCell(data.rows, 'key', 1, '#usertable', resultSearch);
                resizeTables();
            },
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