$(function () {
    var type = 'post'; //ajax类型


    $('#teamMember').on('hide.bs.modal', function () {
        $('#teamMemberTable').bootstrapTable('destroy');
    })
    //数据显示列表
    TableObj.oTableInit();


    $('#rejectModel').on("hidden.bs.modal", function () {

        $("#rejectModel_Form").data('bootstrapValidator').destroy();
        $('#rejectModel_Form').data('bootstrapValidator', null);
        $('#rejectModel_Form')[0].reset();
        $('input,textarea').placeholder(); //防止IE8没有placleholder
    });


    //通过按钮
    $("#btn_pass").click(function () {

        var checklist = $('#teamTableApproval').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择团队", {icon: 3});
        } else {
            var text = "确定通过选中的" + checklist.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {
                layer.msg("成功", {icon: 1});
            }, function () {

            });
        }
    });

    //拒绝按钮
    $("#btn_reject").click(function () {

        var checklist = $('#teamTableApproval').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择团队", {icon: 3});
        } else {

            $("#rejectModel").modal("show");
            addModalValidator();
        }
    });


    $("#toReject").click(function () {
        //表单校验
        var bootstrapValidator = $("#rejectModel_Form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {

            return;
        }

        var checklist = $('#teamTableApproval').bootstrapTable('getSelections');
        var pkIdList = [];
        $.each(checklist, function (index, item) {
            pkIdList.push(item.pkId);
        });

        var data = {
            "pkIdList": pkIdList,
            "rejectDesc": $("#rejectDesc").val()
        };
        layer.msg("拒绝成功", {icon: 1});
        $("#rejectModel").modal("hide");
    });

    $("#btn_refresh").click(function () {
        $('#teamTableApproval').bootstrapTable('refresh');
    });
    $("#show_history").click(function () {
        var checklist = $('#teamTableApproval').bootstrapTable('getSelections');

        if (checklist == null || checklist.length != 1) {
            layer.msg('请选择一条数据', {icon: 3});
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
                field: 'teamId',
                title: '团队编号',
            }, {
                field: 'teamName',
                title: '团队名称',
                clickToSelect: false,
                formatter: teamDetailLink
            }, {
                field: 'effDt',
                title: '生效日期',
            }, {
                field: 'invalidDt',
                title: '失效日期'

            },
            {
                field: 'teamType',
                title: '团队类型',
            },
            {
                field: 'teamChar',
                title: '团队性质',
            },
            {
                field: 'belongLineDesc',
                title: '所属条线',
            },
            /*  {
                  field: 'teamDetail',
                  title: '团队详情'
              },*/
            {
                field: 'mdfrId',
                title: '提交人',
            },
            {
                field: 'modifTm',
                title: '提交时间',
                formatter: function (value, row, index) {
                    if (value != undefined && value != null && value != "") {
                        return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
                    }
                }
            },
            {
                field: 'opeType',
                title: '操作类型',
                formatter: function (value, row, index) {
                    return $.param.getDisplay('OPETYPE', value);
                }
            },
        ]

        $('#teamTableApproval').bootstrapTable({
            url: portal.bp() + './json/team/ownWorkflowList.json',
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
            resizable: true,			//是否可调整列宽度
            height: 600,
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
    },
    teamMemberTableFactory: function (teamId, teamTypeCd, operType, pkId, validTag) {
        //操作列是否展示
        columns = [
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'MEMBERID',
                title: '成员编号',
            }, {
                field: 'MEMBERNAME',
                title: '成员名称',
            }, {
                field: 'MEMBEROFORG',
                title: '所属机构',
            }, {
                field: 'MEMBEROFCAPTAIN',
                title: '是否队长',
                formatter: function (value, row, index) {
                    if (row.MEMBEROFCAPTAIN == '1') {
                        return '是';
                    }
                    return '否';
                }
            }

        ]

        $('#teamMemberTable').bootstrapTable({
            url: portal.bp() + './json/team/queryTeamMemberByPage.json',
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
                    'teamId': teamId,
                    'teamTypeCd': teamTypeCd,
                    'operType': operType,
                    'pkId': pkId,
                    'validTag': validTag
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
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns
        });
    }

};


//添加团队详情
function teamDetailLink(value, row, index) {
    var teamId = row.teamId;
    var teamTypeCd = row.teamTypeCd;
    var operType = row.operType;
    var pkId = row.pkId;
    var validTag = row.validTag;


    var htmltext = '<a id="teamDetail" class="oper-left"  onclick="teamDetailaClick(' + '\'' + teamId + '\',\'' +
        teamTypeCd + '\',\'' + operType + '\',\'' + pkId + '\',\'' + validTag + '\')"><b>' + row.teamName + '</b></a>'

    return htmltext;
}


function teamDetailaClick(teamId, teamTypeCd, operType, pkId, validTag) {
    $('#teamMember').modal("show");
    TableObj.teamMemberTableFactory(teamId, teamTypeCd, operType, pkId, validTag);
};


function addModalValidator() {
    //表单校验
    $("#rejectModel_Form").bootstrapValidator({
        live: ['submitted', 'enabled'],
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
