var checkedKey = [];
$(function () {

    $('#btn_refresh').click(btn_refresh);
    $('#btn_pass').click(btn_pass);
    $('#btn_reject').click(btn_reject);
    $('#toReject').click(toReject);
    $('#show_history').click(show_history);


    $('#rejectModel').on("hidden.bs.modal", function() {

        $("#rejectModel_Form").data('bootstrapValidator').destroy();
        $('#rejectModel_Form').data('bootstrapValidator', null);
        $('#rejectModel_Form')[0].reset();
        $('input,textarea').placeholder(); //防止IE8没有placleholder
    });


    TabObj.aQlyvIndexScoreApprovalTable();
});

var TabObj = {
    aQlyvIndexScoreApprovalTable: function () {
        var url = portal.bp() + './json/assess/assess_score/getAQlyvIndexScore.json';
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
            },
            {
                field: 'assObjId',
                title: '考核对象编号'
            },
            {
                field: 'assObjName',
                title: '考核对象名称'
            },
            {
                field: 'indexName',
                title: '指标名称'
            },
            {
                field: 'score',
                title: '得分'
            },
            {
                field: 'det',
                title: '详情'
            },
            {
                field: 'assMon',
                title: '考核月份'
            }
        ];


        $('#assessScoreApproval').bootstrapTable('destroy').bootstrapTable({
            url: url,
            method: 'POST',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height: getTableHeight(document),
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
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: columns,
            onCheck: function (row, $element) {

                var key = row.taskNum;
                if (checkedKey.indexOf(key) < 0) {
                    checkedKey.push(key);
                }
            },
            onUncheck: function (row, $element) {

                var key = row.taskNum;
                if (checkedKey.indexOf(key) >= 0) {
                    checkedKey.splice(checkedKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].taskNum;
                        if (checkedKey.indexOf(key) < 0) {
                            checkedKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].taskNum;
                        if (checkedKey.indexOf(key) >= 0) {
                            checkedKey.splice(checkedKey.indexOf(key), 1);
                        }
                    }
                }

            },
            onLoadSuccess: function (data) {
                $('#aQlyvIndexScoreTable').bootstrapTable('checkBy', {
                    field: "taskNum",
                    values: checkedKey
                });
                resizeTables();
            }
        });
    }
};

//通过
function btn_pass(){
    if (checkedKey.length == 0) {
        layer.msg("请选择要通过的打分项", {icon: 3});
    } else {
        var text = "确定通过选中的" + checkedKey.length + "项吗？";
        layer.confirm(text, {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var data = {
                "pkIdList": checkedKey
            };
            var index;
            $.ajax({
                url: portal.bp() + './json/ok.json',
                type: 'get',
                async: false,
                cache: false,
                data: data,
                dataType: "json",
                success: function (o) {
                    var code = o.code;
                    if (code == 200) {
                        layer.msg("提交成功", {icon: 1,time:1000});
                        TabObj.aQlyvIndexScoreApprovalTable();
                    } else {
                        layer.msg(o.message, {icon: 2});
                    }

                }
            });
        }, function () {

        });
    }
};
//拒绝
function btn_reject(){
    if (checkedKey.length == 0) {
        layer.msg("请选择要拒绝的打分项", {icon: 3});
        return;
    }
    $("#rejectModel").modal("show");
    addModalValidator();
};

function toReject(){
    //表单校验
    var bootstrapValidator = $("#rejectModel_Form").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (!bootstrapValidator.isValid()){

        return;
    }

    var rejectDesc = $("#rejectDesc").val();
    var data = {'pkIdList[]': checkedKey, 'rejectDesc': rejectDesc};
    var index;
    $.ajax({
        url: portal.bp() + './json/ok.json',
        type: 'get',
        async: false,
        cache: false,
        data: data,
        dataType: "json",
        success: function (o) {
            var code = o.code;
            if (code == 200) {
                layer.msg("提交成功", {icon: 1,time:1000});
                $("#rejectModel").modal("hide");
                TabObj.aQlyvIndexScoreApprovalTable();
            } else {
                layer.msg(o.message, {icon: 2});
            }

        }
    });
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
}
//刷新
function btn_refresh(){
    checkedKey = [];
    TabObj.aQlyvIndexScoreApprovalTable();
};
//审批历史
function show_history(){};




