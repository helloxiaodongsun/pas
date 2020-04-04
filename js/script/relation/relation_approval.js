//角色类型
var roleType = undefined;
//角色类型码值
var roleTypeCode = undefined;
//编辑时的行索引
var rowIndex = undefined;
//选中的要进行业绩分配的数据
var acctData = undefined;

var resultSearch = [];
var filedNameArray = ['key','acctId','bizType','custName','custId','cerNum','orgName', 'check', 'number'];
$(function () {

    TableObj.relationApprovalInfoPage();

    //通过按钮
    $("#btn_pass").click(function () {

        var checklist = $('#relationApprovalInfoTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("至少选择一条记录", {icon: 3});
        } else {
            var array = new Array();
            var arrayTmp = new Array();
            var object = new Object();
            for(var i=0;i<checklist.length;i++){
                var acctId= checklist[i]['acctId'];
                var bizTypeCd = checklist[i]['bizTypeCd'];
                var key = acctId + '::' + bizTypeCd;
                if(arrayTmp.indexOf(key)<0){
                    arrayTmp.push(key);
                    array.push(checklist[i]);
                }

            }
            var text = "确定通过选中的" + array.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {


                object['acctData']=array;
                object['approvalFlag']='0';
                var index;
                $.ajax({
                    url: portal.bp() + './json/ok.json',
                    type: 'post',
                    cache: false,
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(object),
                    success: function (data) {
                        if (data.code == '200') {
                            layer.msg("审批成功", {icon: 1,time:1000});
                            $('#relationApprovalInfoTable').bootstrapTable('refresh');
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
            }, function () {

            });
        }
    });
    $('#rejectModel').on("hidden.bs.modal", function() {

        $("#rejectModel_Form").data('bootstrapValidator').destroy();
        $('#rejectModel_Form').data('bootstrapValidator', null);
        $('#rejectModel_Form')[0].reset();
        $('input,textarea').placeholder(); //防止IE8没有placleholder
    });


    //拒绝按钮
    $("#btn_reject").click(function () {

        var checklist = $('#relationApprovalInfoTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("至少选择一条数据", {icon: 3});
        } else {

            $("#rejectModel").modal("show");
            addModalValidator();
        }
    });

    //拒绝
    $("#toReject").click(function(){
        //表单校验
        var bootstrapValidator = $("#rejectModel_Form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()){

            return;
        }
        var checklist = $('#relationApprovalInfoTable').bootstrapTable('getSelections');
        var object = new Object();
        object['acctData']=checklist;
        object['rejectDesc']=$("#rejectDesc").val();
        var index;
        $.ajax({
            url: portal.bp() + './json/ok.json',
            type: 'post',
            cache: false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(object),
            success: function (data) {
                $("#rejectModel").modal("hide");
                if (data.code == '200') {
                    layer.msg("拒绝成功", {icon: 1,time:1000});

                    $('#relationApprovalInfoTable').bootstrapTable('refresh');
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

    });
    //按钮审批历史
    $("#show_history").click(function(){
        var checklist = $('#relationApprovalInfoTable').bootstrapTable('getSelections');

        if(checklist==null||checklist.length!=1){
            layer.msg('请选择一条数据',{icon:3});
            return;
        }
        showWorkFlowHistory(checklist[0].taskNum);
    });
});


//创建表格
var TableObj = {
    relationApprovalInfoPage: function () {
        var columns = [
            {
                field: 'check',
                checkbox: true
            },
            {
                field: 'number',
                title: '序号',
                align: 'center'/*,
                formatter: function (value, row, index) {
                    return index + 1;
                }*/
            }, {
                field: 'acctId',
                title: '账号编号',
            }, {
                field: 'bizType',
                title: '业务类型',
            }, {
                field: 'custName',
                title: '客户名称',
            }, {
                field: 'custId',
                title: '客户编号'

            },
            {
                field: 'cerNum',
                title: '客户证件号'

            },
            {
                field: 'orgName',
                title: '所属机构',
            },
            {
                field: 'relaRoleDesc',
                title: '关联角色类型',
            },
            {
                field: 'empId',
                title: '员工ID',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'relaRatioDesc',
                title: '关联比例(%)',
            },
            {
                field: 'relaStatusDesc',
                title: '关联状态',
            }
        ];

        $('#relationApprovalInfoTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_approval/ownWorkflowList.json',
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
                    'pageNum': (params.offset / params.limit) + 1
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            // resizable: true,			//是否可调整列宽度
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
            onLoadSuccess:function (res) {
                mergeCell(res.rows, 'key', 1, '#relationApprovalInfoTable',resultSearch);
                resizeTables();
            }
        });
    }


};


function mergeCell(data, fieldName, colspan, target, numArr) {

    if (data.length == 0) {
        return;
    }

    if (data.length == 1 || numArr == undefined) {

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
};

function addModalValidator() {
    //表单校验
    $("#rejectModel_Form").bootstrapValidator({
        live: ['submitted','enabled'],
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
                        message: "不能超过1000个字"
                    }
                }
            },
        }
    });
};

